import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class ProductService:
    """
    Service layer coordinating all Product business logic, transaction handling,
    and semantic database constraints (e.g., uniqueness, presence).
    """

    @staticmethod
    async def get_product_by_sku(db: AsyncSession, sku: str) -> Product | None:
        """Helper to retrieve a product by its unique SKU."""
        result = await db.execute(select(Product).where(Product.sku == sku))
        return result.scalars().first()

    @classmethod
    async def create_product(cls, db: AsyncSession, product_in: ProductCreate) -> Product:
        """
        Creates a new catalog product.
        Raises 400 BAD REQUEST if the SKU is already registered.
        """
        existing_product = await cls.get_product_by_sku(db, product_in.sku)
        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with SKU '{product_in.sku}' already exists."
            )

        db_product = Product(
            sku=product_in.sku,
            name=product_in.name,
            description=product_in.description,
            price=product_in.price
        )
        db.add(db_product)
        await db.commit()
        await db.refresh(db_product)
        return db_product

    @staticmethod
    async def get_product(db: AsyncSession, product_id: uuid.UUID) -> Product:
        """
        Retrieves a single product by UUID.
        Raises 404 NOT FOUND if the product does not exist.
        """
        result = await db.execute(select(Product).where(Product.id == product_id))
        db_product = result.scalars().first()
        if not db_product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with ID '{product_id}' not found."
            )
        return db_product

    @staticmethod
    async def get_products(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Product]:
        """Retrieves a paginated list of catalog products."""
        result = await db.execute(
            select(Product).offset(skip).limit(limit).order_by(Product.sku)
        )
        return list(result.scalars().all())

    @classmethod
    async def update_product(
        cls, db: AsyncSession, product_id: uuid.UUID, product_in: ProductUpdate
    ) -> Product:
        """
        Updates an existing product's fields.
        Raises 404 NOT FOUND if the product doesn't exist.
        Raises 400 BAD REQUEST if updating to a SKU that is already taken by another product.
        """
        db_product = await cls.get_product(db, product_id)

        update_data = product_in.model_dump(exclude_unset=True)

        # Check SKU uniqueness if a new SKU is provided
        if "sku" in update_data and update_data["sku"] != db_product.sku:
            existing_product = await cls.get_product_by_sku(db, update_data["sku"])
            if existing_product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product with SKU '{update_data['sku']}' already exists."
                )

        for field, value in update_data.items():
            setattr(db_product, field, value)

        db.add(db_product)
        await db.commit()
        await db.refresh(db_product)
        return db_product

    @classmethod
    async def delete_product(cls, db: AsyncSession, product_id: uuid.UUID) -> None:
        """
        Deletes a product from the database catalog.
        Raises 404 NOT FOUND if the product does not exist.
        """
        db_product = await cls.get_product(db, product_id)
        await db.delete(db_product)
        await db.commit()
