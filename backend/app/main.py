from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api import api_router
from app.core.database import engine
from app.models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize the database tables under a safe transaction
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set up CORS middleware for dev server cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Configure specific allowed hosts in production config
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route all version 1 endpoints under the /api/v1 prefix
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": f"Welcome to the {settings.PROJECT_NAME} API. Access docs at /docs or /redoc."
    }
