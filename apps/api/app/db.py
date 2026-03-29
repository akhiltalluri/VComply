import os
from pathlib import Path
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Load local env vars from apps/api/.env
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
engine = None
AsyncSessionLocal = None


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Create the async session factory lazily so the app can boot without DB env."""
    global engine, AsyncSessionLocal

    if AsyncSessionLocal is not None:
        return AsyncSessionLocal

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set")

    engine = create_async_engine(database_url, pool_pre_ping=True)
    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    return AsyncSessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields a DB session per request."""
    session_factory = get_session_factory()
    async with session_factory() as session:
        yield session
