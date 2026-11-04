import os
import secrets
from datetime import datetime, timezone
from typing import Literal, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, func, select

from database import get_session
from models import Order
from routers.cart import Cart


def require_admin(x_admin_key: str = Header(default="")) -> None:
    """Reject the request unless X-Admin-Key matches ADMIN_KEY in the environment."""
    key = os.getenv("ADMIN_KEY", "").strip()
    if not key:
        raise HTTPException(
            status_code=503, detail="ADMIN_KEY is not set on the server"
        )
    if not secrets.compare_digest(x_admin_key.strip().encode(), key.encode()):
        raise HTTPException(status_code=401, detail="Invalid admin key")


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
    dependencies=[Depends(require_admin)],
)


# ------------------------------------------------------------------ #
#  Schemas                                                            #
# ------------------------------------------------------------------ #
class OrderUpdate(BaseModel):
    status: Optional[
        Literal["pending", "confirmed", "shipped", "delivered", "cancelled"]
    ] = None
    payment_status: Optional[Literal["unpaid", "paid"]] = None
    tracking_number: Optional[str] = Field(default=None, max_length=100)
    carrier: Optional[str] = Field(default=None, max_length=100)


def _commit(session: Session, what: str) -> None:
    try:
        session.commit()
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(status_code=409, detail=f"Could not save {what}: {e.orig}")


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
#  Orders                                                             #
# ------------------------------------------------------------------ #
@router.get("/orders")
def list_orders(
    status: Optional[
        Literal["pending", "confirmed", "shipped", "delivered", "cancelled"]
    ] = None,
    session: Session = Depends(get_session),
):
    q = select(Order).order_by(Order.id.desc())

    if status:
        q = q.where(Order.status == status)

    return session.exec(q).all()


@router.patch("/orders/{order_id}")
def update_order(
    order_id: int, body: OrderUpdate, session: Session = Depends(get_session)
):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(order, k, v.strip() if isinstance(v, str) else v)

    order.updated_at = datetime.now(timezone.utc)
    session.add(order)
    _commit(session, "order")
    session.refresh(order)
    return order


# ------------------------------------------------------------------ #
#  Stats                                                              #
# ------------------------------------------------------------------ #
@router.get("/stats")
def stats(session: Session = Depends(get_session)):
    def count(model, *where):
        q = select(func.count()).select_from(model)
        for w in where:
            q = q.where(w)
        return session.exec(q).one()

    return {
        "carts_total": count(Cart),
        "carts_open": count(Cart, Cart.status == "open"),
        "carts_checkout": count(Cart, Cart.status == "checkout"),
        "orders_total": count(Order),
        "orders_pending": count(Order, Order.status == "pending"),
    }
