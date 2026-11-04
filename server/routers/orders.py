import re
from datetime import datetime
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from database import get_session
from mailer import send_order_emails
from models import Order
from routers.cart import Cart

router = APIRouter(prefix="/api/orders", tags=["Orders"])


# ---------------------------------------------------------------------------
# Hardcoded product catalog — must match src/Store/Products/Products.js
# and src/Store/cartConfig.js on the frontend.
# Update BOTH places whenever a price changes.
# ---------------------------------------------------------------------------
# slug (lowercase) -> (name, price, compare_price)
_CATALOG = {
    "glowbeam-sculpt-brief": ("Glowbeam Sculpt Brief", 11207.31, 14015.15),
    "sculpt-leggings-stay-up": ("Sculpt Leggings · Stay-Up", 14016.16, 14016.16),
    "belly-brush": ("Belly Sculpt Brush", 2785.90, 2785.90),
    "flat-belly-ebook": ("The Flat Belly Method", 0.00, 0.00),
    "gift-card": ("$10 Gift Card", 0.00, 0.00),
}


def _lookup(slug: str):
    """Case-insensitive slug lookup. Returns (name, price, compare_price) or None."""
    return _CATALOG.get((slug or "").strip().lower())


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _digits(s: str) -> str:
    return re.sub(r"\D", "", s or "")


def _phone_matches(input_contact: str, stored_phone: str) -> bool:
    """Safely compare last 7-10 digits of a phone number to avoid false positives."""
    c_digits = _digits(input_contact)
    p_digits = _digits(stored_phone)
    if not c_digits or not p_digits:
        return False
    compare_len = min(len(c_digits), len(p_digits), 10)
    return compare_len >= 7 and c_digits[-compare_len:] == p_digits[-compare_len:]


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class CheckoutIn(BaseModel):
    session_id: str
    name: str
    email: str
    phone: str
    address: str
    city: str
    postal_code: str = ""
    note: str = ""
    payment_method: Literal["cod"] = "cod"

    @field_validator("session_id")
    @classmethod
    def _validate_sid(cls, v: str) -> str:
        v = v.strip()
        if not re.fullmatch(r"[0-9a-fA-F-]{36}", v):
            raise ValueError("Invalid session format")
        return v

    @field_validator("name", "city")
    @classmethod
    def _short_text(cls, v: str) -> str:
        v = v.strip()
        if not (2 <= len(v) <= 100):
            raise ValueError("Must be 2-100 characters")
        return v

    @field_validator("address")
    @classmethod
    def _address(cls, v: str) -> str:
        v = v.strip()
        if not (5 <= len(v) <= 300):
            raise ValueError("Address must be 5-300 characters")
        return v

    @field_validator("email")
    @classmethod
    def _email(cls, v: str) -> str:
        v = v.strip()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[A-Za-z]{2,}", v):
            raise ValueError("Invalid email")
        return v.lower()

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        v = v.strip()
        if not (7 <= len(_digits(v)) <= 15):
            raise ValueError("Invalid phone number")
        return v

    @field_validator("note", "postal_code")
    @classmethod
    def _optional(cls, v: str) -> str:
        v = v.strip()
        if len(v) > 500:
            raise ValueError("Must be under 500 characters")
        return v


class TrackIn(BaseModel):
    order_number: str = ""
    contact: str = ""
    tracking_number: str = ""


class OrderPublic(BaseModel):
    order_number: str
    status: str
    payment_method: str
    payment_status: str
    created_at: datetime
    city: str
    tracking_number: str
    carrier: str
    subtotal: float
    items: list[dict]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.post("", status_code=status.HTTP_201_CREATED)
def create_order(
    body: CheckoutIn,
    background: BackgroundTasks,
    db: Session = Depends(get_session),
):
    # 1. Fetch the cart
    cart = db.get(Cart, body.session_id)
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    # 2. Recompute prices server-side from the hardcoded catalog
    #    (never trust client-submitted prices)
    subtotal = 0.0
    savings = 0.0
    validated_items = []

    for item in cart.items:
        slug = item.get("slug")
        entry = _lookup(slug)
        if not entry:
            raise HTTPException(
                status_code=400,
                detail=f"Item '{slug}' is no longer available",
            )
        name, price, compare_price = entry

        qty = int(item.get("qty", 1))
        if qty < 1:
            continue

        line_total = price * qty
        line_savings = (compare_price - price) * qty if compare_price > price else 0.0

        subtotal += line_total
        savings += line_savings

        validated_items.append(
            {
                "slug": slug,
                "name": name,
                "price": price,
                "qty": qty,
                "color": item.get("color"),
                "size": item.get("size"),
                "line_total": line_total,
            }
        )

    if not validated_items:
        raise HTTPException(status_code=400, detail="Your cart contains no valid items")

    # 3. Create the order
    order = Order(
        session_id=body.session_id,
        name=body.name,
        email=body.email,
        phone=body.phone,
        address=body.address,
        city=body.city,
        postal_code=body.postal_code,
        note=body.note,
        items=validated_items,
        subtotal=subtotal,
        savings=savings,
        payment_method=body.payment_method,
    )

    try:
        db.add(order)
        db.flush()  # assigns order.id
        order.order_number = f"#{1000 + order.id}"
        db.commit()
        db.refresh(order)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Order conflict, please try again")
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500, detail="Could not create order. Please try again."
        )

    # 4. Queue the confirmation emails
    email_payload = {
        "order_number": order.order_number,
        "name": order.name,
        "email": order.email,
        "phone": order.phone,
        "address": order.address,
        "city": order.city,
        "postal_code": order.postal_code,
        "note": order.note,
        "items": order.items,
        "subtotal": order.subtotal,
        "savings": order.savings,
        "payment_method": order.payment_method,
        "created_at": order.created_at.isoformat(),
    }
    background.add_task(send_order_emails, email_payload)

    return {"order_number": order.order_number, "email": order.email}


@router.post("/track", response_model=OrderPublic)
def track_order(body: TrackIn, db: Session = Depends(get_session)):
    order = None
    tracking_num = body.tracking_number.strip()
    order_num = body.order_number.strip()
    contact = body.contact.strip().lower()

    if tracking_num:
        order = db.exec(
            select(Order).where(Order.tracking_number == tracking_num)
        ).first()
        if order and contact:
            if not (
                contact == order.email.lower() or _phone_matches(contact, order.phone)
            ):
                order = None
        elif order:
            raise HTTPException(
                status_code=400,
                detail="Please provide your email or phone number to view this order",
            )

    elif order_num and contact:
        normalized_num = f"#{_digits(order_num)}"
        found = db.exec(
            select(Order).where(Order.order_number == normalized_num)
        ).first()
        if found:
            if contact == found.email.lower() or _phone_matches(contact, found.phone):
                order = found

    else:
        raise HTTPException(
            status_code=400,
            detail="Enter your order number and email/phone, or a tracking number",
        )

    if not order:
        raise HTTPException(
            status_code=404, detail="We couldn't find an order with those details"
        )

    return OrderPublic(
        order_number=order.order_number,
        status=order.status,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        created_at=order.created_at,
        city=order.city,
        tracking_number=order.tracking_number,
        carrier=order.carrier,
        subtotal=order.subtotal,
        items=[
            {
                "name": i.get("name"),
                "color": i.get("color"),
                "size": i.get("size"),
                "qty": i.get("qty"),
                "line_total": i.get("line_total"),
            }
            for i in (order.items or [])
        ],
    )
