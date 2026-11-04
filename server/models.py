from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Order(SQLModel, table=True):
    __tablename__ = "orders"  # "order" is a reserved SQL word, so avoid it

    id: Optional[int] = Field(default=None, primary_key=True)
    order_number: str = Field(default="", index=True)  # e.g. "#1001"
    session_id: str = ""

    # Customer
    name: str
    email: str = Field(index=True)
    phone: str
    address: str
    city: str
    postal_code: str = ""
    note: str = ""

    # What they bought (a snapshot of the cart at checkout)
    items: list = Field(default_factory=list, sa_column=Column(JSON))
    subtotal: float = 0
    savings: float = 0

    # Payment and fulfilment
    payment_method: str = "cod"
    payment_status: str = "unpaid"  # unpaid | paid
    status: str = "pending"  # pending | confirmed | shipped | delivered | cancelled
    tracking_number: str = Field(default="", index=True)
    carrier: str = ""

    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)
