import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.services.customer_service import CustomerService

router = APIRouter()

@router.post(
    "/", 
    response_model=CustomerResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Register a new customer",
    description="Creates a new customer profile. Enforces unique email addresses."
)
async def create_customer(
    customer_in: CustomerCreate, 
    db: AsyncSession = Depends(get_db)
):
    return await CustomerService.create_customer(db, customer_in)


@router.get(
    "/", 
    response_model=list[CustomerResponse],
    summary="List all customers",
    description="Retrieves a paginated list of registered customers, ordered by most recently created."
)
async def get_customers(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    return await CustomerService.get_customers(db, skip=skip, limit=limit)


@router.get(
    "/{id}", 
    response_model=CustomerResponse,
    summary="Get customer profile",
    description="Retrieves customer parameters based on the unique Customer UUID."
)
async def get_customer(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    return await CustomerService.get_customer(db, id)


@router.delete(
    "/{id}", 
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a customer profile",
    description="Removes a customer account from the database."
)
async def delete_customer(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    await CustomerService.delete_customer(db, id)
