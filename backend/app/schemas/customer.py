import re
import uuid
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

# Standard robust email verification regex
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

class CustomerBase(BaseModel):
    email: str = Field(..., description="Unique email address of the customer")
    name: str = Field(..., min_length=1, max_length=255, description="Full name of the customer")
    phone: str | None = Field(None, max_length=50, description="Phone number")
    address: str | None = Field(None, max_length=500, description="Physical address")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        stripped = v.strip().lower()
        if not stripped:
            raise ValueError("Email cannot be empty.")
        if not EMAIL_REGEX.match(stripped):
            raise ValueError("Invalid email format.")
        return stripped

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Name cannot be empty or just whitespace.")
        return stripped

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
