from fastapi import APIRouter
from app.api.endpoints import products, customers, orders

api_router = APIRouter()

# Incorporate endpoints under their respective path prefixes
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(customers.router, prefix="/customers", tags=["customers"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
