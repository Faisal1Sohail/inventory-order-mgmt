import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Numeric, DateTime, ForeignKey, func, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.customer import Customer
    from app.models.order_item import OrderItem

class Order(Base):
    """
    Order model representing a customer purchase checkout.
    Tracks overall order value and shipping/processing status.
    """
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, 
        default=uuid.uuid4,
        comment="Unique identifier for the order"
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"), 
        nullable=False,
        comment="Reference to the customer who placed the order"
    )
    status: Mapped[str] = mapped_column(
        String(50), 
        default="pending", 
        nullable=False,
        comment="Status of the order (e.g., pending, processing, shipped, cancelled)"
    )
    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), 
        default=Decimal("0.00"), 
        nullable=False,
        comment="Sum total cost of all line items in this order"
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
    customer: Mapped["Customer"] = relationship(
        "Customer",
        back_populates="orders"
    )
    items: Mapped[List["OrderItem"]] = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint("total_amount >= 0", name="check_order_total_non_negative"),
    )

    def __repr__(self) -> str:
        return f"<Order id={self.id!r} status={self.status!r} total={self.total_amount}>"
