import sys
import os

# Append the directory containing 'app' to sys.path so we can import it
sys.path.append(os.path.dirname(__file__))

try:
    from app.models import Base, Product, Customer, Order, OrderItem
    from sqlalchemy.orm import RelationshipProperty
    
    print("Successfully imported all database models!")
    
    # Simple introspection of relationships
    for model in [Product, Customer, Order, OrderItem]:
        print(f"\nModel: {model.__name__} (Table: {model.__tablename__})")
        for key, prop in model.__mapper__.relationships.items():
            target = prop.mapper.class_.__name__
            uselist = prop.uselist
            direction = "1-to-Many" if uselist else "Many-to-1"
            print(f"  -> Relationship: '{key}' connects to '{target}' ({direction})")

    print("\nAll database model verification passed successfully!")
    sys.exit(0)
except Exception as e:
    print(f"Error during database model verification: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    sys.exit(1)
