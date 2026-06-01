import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Numeric, DateTime, func, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.order_item import OrderItem

class Product(Base):
    """
    Product model representing catalog items with unique SKU and pricing details.
    """
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, 
        default=uuid.uuid4,
        comment="Unique identifier for the product"
    )
    sku: Mapped[str] = mapped_column(
        String(100), 
        unique=True, 
        index=True, 
        nullable=False,
        comment="Unique stock keeping unit (SKU)"
    )
    name: Mapped[str] = mapped_column(
        String(255), 
        nullable=False,
        comment="Name of the product"
    )
    description: Mapped[str | None] = mapped_column(
        String(1000), 
        nullable=True,
        comment="Detailed description of the product"
    )
    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), 
        nullable=False,
        comment="Price per unit of the product"
    )
    stock_quantity: Mapped[int] = mapped_column(
        primary_key=False,
        default=0,
        nullable=False,
        comment="Current stock quantity in inventory"
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    # Relationships
    order_items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="product"
    )

    __table_args__ = (
        CheckConstraint("price >= 0", name="check_product_price_non_negative"),
        CheckConstraint("stock_quantity >= 0", name="check_product_stock_non_negative"),
    )

    def __repr__(self) -> str:
        return f"<Product sku={self.sku!r} name={self.name!r} price={self.price}>"
