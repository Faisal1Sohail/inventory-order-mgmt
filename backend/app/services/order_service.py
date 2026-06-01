import uuid
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.customer import Customer
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderCreate

class OrderService:
    """
    Service layer coordinating Order processing business logic:
    1. Establishes transactional isolation.
    2. Employs row-level pessimistic write-locks (SELECT FOR UPDATE) on products
       to prevent overselling in high-concurrency environments.
    3. Performs inventory checks and automatically adjusts stock levels.
    4. Automatically calculates the running order cost.
    5. Commits atomically, reverting all modifications on any intermediate failure.
    """

    @classmethod
    async def create_order(cls, db: AsyncSession, order_in: OrderCreate) -> Order:
        """
        Processes and registers a new customer order.
        * Locks products to ensure no overselling.
        * Rolls back automatically on any validation or constraint failure.
        """
        # Validate Customer existence
        customer_result = await db.execute(
            select(Customer).where(Customer.id == order_in.customer_id)
        )
        customer = customer_result.scalars().first()
        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer with ID '{order_in.customer_id}' not found."
            )

        order_items = []
        total_amount = Decimal("0.00")

        try:
            # We process all products within the current session.
            # If any failure occurs, an exception will be raised, and the calling 
            # transaction will rollback the session.
            for item in order_in.items:
                # Lock the specific product row to prevent concurrent stock adjustments
                product_result = await db.execute(
                    select(Product)
                    .where(Product.id == item.product_id)
                    .with_for_update()
                )
                product = product_result.scalars().first()

                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Product with ID '{item.product_id}' not found."
                    )

                # Inventory Level Validation
                if product.stock_quantity < item.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=(
                            f"Insufficient stock for product '{product.name}' (SKU: {product.sku}). "
                            f"Available: {product.stock_quantity}, Requested: {item.quantity}."
                        )
                    )

                # Auto Reduce Stock (inventory decrement)
                product.stock_quantity -= item.quantity
                db.add(product)

                # Auto Calculate Total Amount (price accumulation)
                item_cost = product.price * item.quantity
                total_amount += item_cost

                # Instantiate the Order Line Item
                db_item = OrderItem(
                    product_id=product.id,
                    quantity=item.quantity,
                    unit_price=product.price
                )
                order_items.append(db_item)

            # Create the Parent Order
            db_order = Order(
                customer_id=customer.id,
                status="pending",
                total_amount=total_amount,
                items=order_items
            )
            
            db.add(db_order)
            await db.commit()
            await db.refresh(db_order)
            return db_order

        except HTTPException:
            # Re-raise HTTPExceptions to let FastAPI route handler return proper code
            await db.rollback()
            raise
        except Exception as e:
            # Fallback for database integrity violations (e.g. check constraints)
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Transactional checkout failure: {str(e)}"
            )

    @staticmethod
    async def get_order(db: AsyncSession, order_id: uuid.UUID) -> Order:
        """
        Retrieves a single order by UUID, loading its sub-items.
        Raises 404 NOT FOUND if the order does not exist.
        """
        # Eagerly load items to avoid lazy-loading issues outside the session
        result = await db.execute(
            select(Order).where(Order.id == order_id)
        )
        db_order = result.scalars().first()
        if not db_order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with ID '{order_id}' not found."
            )
        return db_order

    @staticmethod
    async def get_orders(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Order]:
        """Retrieves a paginated list of all orders."""
        result = await db.execute(
            select(Order).offset(skip).limit(limit).order_by(Order.created_at.desc())
        )
        return list(result.scalars().all())

    @classmethod
    async def cancel_order(cls, db: AsyncSession, order_id: uuid.UUID) -> Order:
        """
        Cancels an order and returns all items back into stock.
        * Ensures only non-shipped orders can be cancelled.
        """
        db_order = await cls.get_order(db, order_id)
        
        if db_order.status == "cancelled":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order is already cancelled."
            )
        if db_order.status == "shipped":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Shipped orders cannot be cancelled."
            )

        try:
            # Return item quantities back to product stock levels
            for item in db_order.items:
                product_result = await db.execute(
                    select(Product)
                    .where(Product.id == item.product_id)
                    .with_for_update()
                )
                product = product_result.scalars().first()
                if product:
                    product.stock_quantity += item.quantity
                    db.add(product)

            db_order.status = "cancelled"
            db.add(db_order)
            await db.commit()
            await db.refresh(db_order)
            return db_order
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to cancel order: {str(e)}"
            )
