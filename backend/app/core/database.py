from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Async engine configured for PostgreSQL with asyncpg driver
engine = create_async_engine(
    settings.async_database_url,
    pool_pre_ping=True,      # Automatically verify connections before using them
    echo=False,              # Set to True for verbose SQL query logs in development
    future=True,
)

# Async session maker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for obtaining an asynchronous database session.
    Automatically handles transaction commit on success and rollback on failure.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
