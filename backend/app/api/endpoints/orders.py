import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import OrderService

router = APIRouter()

@router.post(
    "/", 
    response_model=OrderResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Place a new order",
    description="Validates customer accounts, checks and decrements product inventory, calculates cost aggregates, and processes atomic checkout transactions."
)
async def create_order(
    order_in: OrderCreate, 
    db: AsyncSession = Depends(get_db)
):
    return await OrderService.create_order(db, order_in)


@router.get(
    "/", 
    response_model=list[OrderResponse],
    summary="List all orders",
    description="Retrieves a paginated list of all customer orders, ordered by most recently placed."
)
async def get_orders(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    return await OrderService.get_orders(db, skip=skip, limit=limit)


@router.get(
    "/{id}", 
    response_model=OrderResponse,
    summary="Get order details",
    description="Retrieves detailed attributes and order item specifications based on the unique Order UUID."
)
async def get_order(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    return await OrderService.get_order(db, id)


@router.post(
    "/{id}/cancel", 
    response_model=OrderResponse,
    summary="Cancel a customer order",
    description="Transitions an order status to 'cancelled' and returns all purchased line-item quantities back to the product's catalog stock levels. Rejects requests if order is already shipped."
)
async def cancel_order(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    return await OrderService.cancel_order(db, id)
