import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, TYPE_CHECKING
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.order import Order

class Customer(Base):
    """
    Customer model representing users or organizations purchasing items.
    Ensures unique emails to prevent duplicate accounts.
    """
    __tablename__ = "customers"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, 
        default=uuid.uuid4,
        comment="Unique identifier for the customer"
    )
    email: Mapped[str] = mapped_column(
        String(255), 
        unique=True, 
        index=True, 
        nullable=False,
        comment="Unique email address of the customer"
    )
    name: Mapped[str] = mapped_column(
        String(255), 
        nullable=False,
        comment="Name of the customer"
    )
    phone: Mapped[str | None] = mapped_column(
        String(50), 
        nullable=True,
        comment="Phone number of the customer"
    )
    address: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="Billing/shipping address of the customer"
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
    orders: Mapped[List["Order"]] = relationship(
        "Order",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Customer email={self.email!r} name={self.name!r}>"
