import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator

class OrderItemCreate(BaseModel):
    product_id: uuid.UUID = Field(..., description="UUID of the product being purchased")
    quantity: int = Field(..., gt=0, description="Quantity to purchase, must be greater than zero")

class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    unit_price: Decimal

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: uuid.UUID = Field(..., description="UUID of the customer placing the order")
    items: list[OrderItemCreate] = Field(..., min_length=1, description="List of items in the order, must contain at least one item")

    @field_validator("items")
    @classmethod
    def validate_items_non_empty(cls, v: list[OrderItemCreate]) -> list[OrderItemCreate]:
        if not v:
            raise ValueError("Order must contain at least one item.")
        # Check for duplicate product IDs within the same order request
        seen_products = set()
        for item in v:
            if item.product_id in seen_products:
                raise ValueError(f"Duplicate product_id '{item.product_id}' in order items. Combine quantities instead.")
            seen_products.add(item.product_id)
        return v

class OrderResponse(BaseModel):
    id: uuid.UUID
    customer_id: uuid.UUID
    status: str
    total_amount: Decimal
    items: list[OrderItemResponse]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
