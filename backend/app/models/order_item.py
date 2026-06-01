import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Numeric, Integer, DateTime, ForeignKey, func, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.product import Product

class OrderItem(Base):
    """
    OrderItem model representing individual product entries inside a purchase order.
    Ensures quantities are strictly positive (cannot be negative or zero).
    """
    __tablename__ = "order_items"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, 
        default=uuid.uuid4,
        comment="Unique identifier for the order item"
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), 
        nullable=False,
        comment="Reference to the parent order"
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="RESTRICT"), 
        nullable=False,
        comment="Reference to the product purchased"
    )
    quantity: Mapped[int] = mapped_column(
        Integer, 
        nullable=False,
        comment="Quantity of product purchased"
    )
    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), 
        nullable=False,
        comment="The price of a single unit at the time of purchase"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )

    # Relationships
    order: Mapped["Order"] = relationship(
        "Order",
        back_populates="items"
    )
    product: Mapped["Product"] = relationship(
        "Product",
        back_populates="order_items"
    )

    __table_args__ = (
        CheckConstraint("quantity > 0", name="check_order_item_quantity_positive"),
        CheckConstraint("unit_price >= 0", name="check_order_item_price_non_negative"),
    )

    def __repr__(self) -> str:
        return f"<OrderItem order={self.order_id!r} product={self.product_id!r} qty={self.quantity}>"
