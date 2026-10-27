from datetime import datetime, timezone  # <-- Added timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import Column, JSON
from sqlmodel import Field as SQLField, Session, SQLModel

from database import get_session  # use your existing session dependency

router = APIRouter(prefix="/api/cart", tags=["cart"])


class CartItemIn(BaseModel):
    kind: str = "product"  # "product" | "addon"
    slug: str
    name: str
    color: Optional[str] = None  # every single color is stored
    size: Optional[str] = None
    qty: int = Field(ge=1, le=99)
    unit_price: float
    line_total: float
    deal: Optional[str] = None


class CartIn(BaseModel):
    session_id: str
    items: list[CartItemIn]
    subtotal: float
    savings: float = 0


class Cart(SQLModel, table=True):
    session_id: str = SQLField(primary_key=True)
    items: list = SQLField(default_factory=list, sa_column=Column(JSON))
    subtotal: float = 0
    savings: float = 0
    status: str = "open"  # "open" | "checkout"
    # FIX: Use timezone-aware datetime
    updated_at: datetime = SQLField(default_factory=lambda: datetime.now(timezone.utc))


def _save(body: CartIn, status: str, db: Session) -> Cart:
    cart = Cart(
        session_id=body.session_id,
        items=[i.model_dump() for i in body.items],
        subtotal=body.subtotal,
        savings=body.savings,
        status=status,
        # FIX: Use timezone-aware datetime
        updated_at=datetime.now(timezone.utc),
    )
    db.merge(cart)  # insert or update by session_id
    db.commit()
    return cart


@router.post("/sync")
def sync_cart(body: CartIn, db: Session = Depends(get_session)):
    _save(body, "open", db)
    return {"ok": True, "items": len(body.items)}


@router.post("/checkout")
def checkout(body: CartIn, db: Session = Depends(get_session)):
    if not body.items:
        raise HTTPException(400, "Cart is empty")
    _save(body, "checkout", db)
    return {"ok": True, "order_id": body.session_id, "checkout_url": None}


@router.get("/{session_id}")
def get_cart(session_id: str, db: Session = Depends(get_session)):
    cart = db.get(Cart, session_id)
    if not cart:
        raise HTTPException(404, "Cart not found")
    return cart
