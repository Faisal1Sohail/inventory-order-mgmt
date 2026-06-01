import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services.product_service import ProductService

router = APIRouter()

@router.post(
    "/", 
    response_model=ProductResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
    description="Registers a new catalog item with a unique SKU and details."
)
async def create_product(
    product_in: ProductCreate, 
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.create_product(db, product_in)


@router.get(
    "/", 
    response_model=list[ProductResponse],
    summary="List all products",
    description="Retrieves a paginated list of catalog products."
)
async def get_products(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.get_products(db, skip=skip, limit=limit)


@router.get(
    "/{id}", 
    response_model=ProductResponse,
    summary="Get product details",
    description="Retrieves product details by its unique identifier UUID."
)
async def get_product(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.get_product(db, id)


@router.put(
    "/{id}", 
    response_model=ProductResponse,
    summary="Update product details",
    description="Modifies product specifications or pricing. Handles SKU uniqueness validations."
)
async def update_product(
    id: uuid.UUID, 
    product_in: ProductUpdate, 
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.update_product(db, id, product_in)


@router.delete(
    "/{id}", 
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a product",
    description="Removes a product from the database catalog."
)
async def delete_product(
    id: uuid.UUID, 
    db: AsyncSession = Depends(get_db)
):
    await ProductService.delete_product(db, id)
