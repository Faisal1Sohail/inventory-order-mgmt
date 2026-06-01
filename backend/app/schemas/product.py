import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator

class ProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=100, description="Unique stock keeping unit")
    name: str = Field(..., min_length=1, max_length=255, description="Name of the product")
    description: str | None = Field(None, max_length=1000, description="Product description")
    price: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2, description="Product price, must be greater than zero")

    @field_validator("sku")
    @classmethod
    def validate_sku(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("SKU cannot be empty or just whitespace.")
        return stripped

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Name cannot be empty or just whitespace.")
        return stripped

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    sku: str | None = Field(None, min_length=1, max_length=100)
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None, max_length=1000)
    price: Decimal | None = Field(None, gt=Decimal("0.00"), decimal_places=2)

    @field_validator("sku", "name")
    @classmethod
    def validate_optional_fields(cls, v: str | None) -> str | None:
        if v is not None:
            stripped = v.strip()
            if not stripped:
                raise ValueError("Field cannot be empty or just whitespace.")
            return stripped
        return v

class ProductResponse(ProductBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
