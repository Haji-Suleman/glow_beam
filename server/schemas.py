from pydantic import BaseModel, field_validator
import re


class SupportRequest(BaseModel):
    name: str
    email: str
    orderNumber: str = ""  # optional in frontend
    phone: str = ""  # optional in frontend
    comment: str

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        v = v.strip()
        if not re.fullmatch(r"[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*", v):
            raise ValueError("Invalid name format")
        return v

    @field_validator("email")
    @classmethod
    def _email(cls, v: str) -> str:
        v = v.strip()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[A-Za-z]{2,}", v):
            raise ValueError("Invalid email format")
        return v

    @field_validator("orderNumber")
    @classmethod
    def _order(cls, v: str) -> str:
        v = v.strip()
        if v and not re.fullmatch(r"#?\d{3,12}", v):
            raise ValueError("Order number should look like #1234")
        return v

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        v = v.strip()
        if v and not re.fullmatch(r"(?=(?:\D*\d){7,15}\D*$)\+?[\d\s()-]{7,20}", v):
            raise ValueError("Invalid phone number")
        return v

    @field_validator("comment")
    @classmethod
    def _comment(cls, v: str) -> str:
        v = v.strip()
        if not (5 <= len(v) <= 1000):
            raise ValueError("Comment must be 5–1000 characters")
        return v
