import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate

class CustomerService:
    """
    Service layer coordinating Customer business logic, uniqueness constraints,
    and database transactional boundaries.
    """

    @staticmethod
    async def get_customer_by_email(db: AsyncSession, email: str) -> Customer | None:
        """Helper to retrieve a customer by their unique email."""
        result = await db.execute(
            select(Customer).where(Customer.email == email.strip().lower())
        )
        return result.scalars().first()

    @classmethod
    async def create_customer(cls, db: AsyncSession, customer_in: CustomerCreate) -> Customer:
        """
        Registers a new customer.
        Raises 400 BAD REQUEST if the email address is already registered.
        """
        existing_customer = await cls.get_customer_by_email(db, customer_in.email)
        if existing_customer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Customer with email '{customer_in.email}' already exists."
            )

        db_customer = Customer(
            email=customer_in.email,
            name=customer_in.name,
            phone=customer_in.phone,
            address=customer_in.address
        )
        db.add(db_customer)
        await db.commit()
        await db.refresh(db_customer)
        return db_customer

    @staticmethod
    async def get_customer(db: AsyncSession, customer_id: uuid.UUID) -> Customer:
        """
        Retrieves a single customer by UUID.
        Raises 404 NOT FOUND if the customer does not exist.
        """
        result = await db.execute(select(Customer).where(Customer.id == customer_id))
        db_customer = result.scalars().first()
        if not db_customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer with ID '{customer_id}' not found."
            )
        return db_customer

    @staticmethod
    async def get_customers(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Customer]:
        """Retrieves a paginated list of customers."""
        result = await db.execute(
            select(Customer).offset(skip).limit(limit).order_by(Customer.created_at.desc())
        )
        return list(result.scalars().all())

    @classmethod
    async def delete_customer(cls, db: AsyncSession, customer_id: uuid.UUID) -> None:
        """
        Deletes a customer account.
        Raises 404 NOT FOUND if the customer is not present.
        """
        db_customer = await cls.get_customer(db, customer_id)
        await db.delete(db_customer)
        await db.commit()
