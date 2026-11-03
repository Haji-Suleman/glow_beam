import os
import secrets
from typing import List, Literal, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, func, select

from database import get_session
from models import Product
from routers.cart import Cart


def require_admin(x_admin_key: str = Header(default="")) -> None:
    """Reject the request unless X-Admin-Key matches ADMIN_KEY in the environment."""
    key = os.getenv("ADMIN_KEY", "").strip()
    if not key:
        # Server is misconfigured: fail closed instead of letting everyone in
        raise HTTPException(
            status_code=503, detail="ADMIN_KEY is not set on the server"
        )
    if not secrets.compare_digest(x_admin_key.strip().encode(), key.encode()):
        raise HTTPException(status_code=401, detail="Invalid admin key")


# Every route in this router requires the admin key
router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
    dependencies=[Depends(require_admin)],
)


# ------------------------------------------------------------------ #
#  Schemas                                                            #
# ------------------------------------------------------------------ #
class ProductIn(BaseModel):
    slug: str = Field(min_length=1, max_length=200)
    kind: Literal["product", "addon"] = "product"
    name: str = Field(min_length=1, max_length=300)
    price: float = Field(default=0, ge=0)
    compare_price: float = Field(default=0, ge=0)
    image: str = ""
    colors: list = Field(default_factory=list)
    sizes: list = Field(default_factory=list)
    gallery: list = Field(default_factory=list)


class ProductUpdate(BaseModel):
    """Every field optional: only the fields you send are changed."""

    slug: Optional[str] = Field(default=None, min_length=1, max_length=200)
    kind: Optional[Literal["product", "addon"]] = None
    name: Optional[str] = Field(default=None, min_length=1, max_length=300)
    price: Optional[float] = Field(default=None, ge=0)
    compare_price: Optional[float] = Field(default=None, ge=0)
    image: Optional[str] = None
    colors: Optional[list] = None
    sizes: Optional[list] = None
    gallery: Optional[list] = None


def _commit(session: Session, what: str) -> None:
    """Commit, turning a database constraint error into a readable 409."""
    try:
        session.commit()
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(status_code=409, detail=f"Could not save {what}: {e.orig}")


# ------------------------------------------------------------------ #
#  Products                                                           #
# ------------------------------------------------------------------ #
@router.get("/products")
def list_products(
    kind: Optional[Literal["product", "addon"]] = None,
    session: Session = Depends(get_session),
):
    q = select(Product).order_by(Product.kind, Product.name)
    if kind:
        q = q.where(Product.kind == kind)
    return session.exec(q).all()


@router.post("/products", status_code=201)
def create_product(body: ProductIn, session: Session = Depends(get_session)):
    if session.exec(select(Product).where(Product.slug == body.slug)).first():
        raise HTTPException(
            status_code=409, detail="A product with this slug already exists"
        )
    product = Product(**body.model_dump())
    session.add(product)
    _commit(session, "product")
    session.refresh(product)
    return product


@router.put("/products/{product_id}")
def update_product(
    product_id: int, body: ProductUpdate, session: Session = Depends(get_session)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    changes = body.model_dump(exclude_unset=True)

    new_slug = changes.get("slug")
    if new_slug and new_slug != product.slug:
        taken = session.exec(select(Product).where(Product.slug == new_slug)).first()
        if taken:
            raise HTTPException(
                status_code=409, detail="Another product already uses this slug"
            )

    for k, v in changes.items():
        setattr(product, k, v)
    session.add(product)
    _commit(session, "product")
    session.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True}


@router.post("/products/import")
def import_products(items: List[ProductIn], session: Session = Depends(get_session)):
    """Upsert by slug. Used to copy the hardcoded products into the database.
    Safe to run repeatedly: it updates existing rows and never deletes."""
    if not items:
        raise HTTPException(status_code=400, detail="No products sent")

    # If the same slug appears twice in one request, the last one wins
    unique = {it.slug: it for it in items}

    existing = {
        p.slug: p
        for p in session.exec(
            select(Product).where(Product.slug.in_(list(unique)))
        ).all()
    }

    created = updated = 0
    for slug, it in unique.items():
        data = it.model_dump()
        row = existing.get(slug)
        if row:
            for k, v in data.items():
                setattr(row, k, v)
            session.add(row)
            updated += 1
        else:
            session.add(Product(**data))
            created += 1

    _commit(session, "products")
    return {
        "created": created,
        "updated": updated,
        "skipped_duplicates": len(items) - len(unique),
    }


# ------------------------------------------------------------------ #
#  Carts                                                              #
# ------------------------------------------------------------------ #
@router.get("/carts")
def list_carts(
    status: Optional[Literal["open", "checkout"]] = None,
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
):
    q = select(Cart).order_by(Cart.updated_at.desc()).offset(offset).limit(limit)
    if status:
        q = q.where(Cart.status == status)

    return [
        {
            "session_id": c.session_id,
            "status": c.status,
            "subtotal": c.subtotal,
            "savings": c.savings,
            "updated_at": c.updated_at,
            "item_count": sum(int(i.get("qty", 0)) for i in (c.items or [])),
            "items": c.items or [],
        }
        for c in session.exec(q).all()
    ]


@router.delete("/carts/{session_id}")
def delete_cart(session_id: str, session: Session = Depends(get_session)):
    cart = session.get(Cart, session_id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    session.delete(cart)
    session.commit()
    return {"ok": True}


# ------------------------------------------------------------------ #
#  Stats                                                              #
# ------------------------------------------------------------------ #
@router.get("/stats")
def stats(session: Session = Depends(get_session)):
    """Small numbers for an admin dashboard header."""

    def count(model, *where):
        q = select(func.count()).select_from(model)
        for w in where:
            q = q.where(w)
        return session.exec(q).one()

    return {
        "products": count(Product, Product.kind == "product"),
        "addons": count(Product, Product.kind == "addon"),
        "carts_total": count(Cart),
        "carts_open": count(Cart, Cart.status == "open"),
        "carts_checkout": count(Cart, Cart.status == "checkout"),
    }
