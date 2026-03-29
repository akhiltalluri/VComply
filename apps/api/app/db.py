import os
from pathlib import Path
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

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

    connect_args = {}
    engine_options = {"pool_pre_ping": True}

    if database_url.startswith("postgresql+asyncpg://") and ":6543/" in database_url:
        # Supabase pooler uses PgBouncer in transaction mode, so asyncpg prepared
        # statement caching needs to be disabled to avoid DuplicatePreparedStatementError.
        connect_args["statement_cache_size"] = 0
        engine_options["poolclass"] = NullPool

    engine = create_async_engine(database_url, connect_args=connect_args, **engine_options)
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


async def get_optional_db() -> AsyncGenerator[AsyncSession | None, None]:
    """Yield a DB session when available, otherwise allow callers to degrade gracefully."""
    try:
        session_factory = get_session_factory()
    except RuntimeError:
        yield None
        return

    async with session_factory() as session:
        yield session
