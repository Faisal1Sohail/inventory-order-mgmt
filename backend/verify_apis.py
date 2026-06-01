import sys
import os

# Append the directory containing 'app' to sys.path so we can import it
sys.path.append(os.path.dirname(__file__))

try:
    from app.main import app
    from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
    from app.services.product_service import ProductService
    from app.api.endpoints.products import router as products_router
    
    from app.schemas.customer import CustomerCreate, CustomerResponse
    from app.services.customer_service import CustomerService
    from app.api.endpoints.customers import router as customers_router
    
    from app.schemas.order import OrderCreate, OrderResponse
    from app.services.order_service import OrderService
    from app.api.endpoints.orders import router as orders_router
    
    print("Successfully imported all Product, Customer, and Order API configurations!")
    print(f"FastAPI app instance: {app}")
    print(f"Active route endpoints count: {len(app.routes)}")
    print("All syntax and import verifications passed successfully!")
    sys.exit(0)
except Exception as e:
    print(f"Error during API verification: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)
