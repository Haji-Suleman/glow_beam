from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    kind: str = "product"  # "product" or "addon"
    name: str
    price: float = 0
    compare_price: float = 0
    image: str = ""
    colors: list = Field(default_factory=list, sa_column=Column(JSON))
    sizes: list = Field(default_factory=list, sa_column=Column(JSON))
    gallery: list = Field(default_factory=list, sa_column=Column(JSON))
