"""Law catalog endpoints backed by normalized Congress.gov federal records."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.services.law_service import (
    get_congress_laws_freshness,
    list_congress_laws,
)

router = APIRouter()


@router.get("")
async def get_laws(
    limit: int = Query(default=50, ge=1, le=200),
    q: str = Query(default=""),
    risk: str = Query(default=""),
    tag: str = Query(default=""),
    db: AsyncSession = Depends(get_db),
):
    """Return the normalized federal legislative library sourced from Congress.gov."""
    laws = await list_congress_laws(db, limit=limit, q=q, risk=risk, tag=tag)
    freshness = await get_congress_laws_freshness(db)
    return {"laws": laws, "freshness": freshness}


@router.get("/congress")
async def get_congress_laws(
    limit: int = Query(default=50, ge=1, le=200),
    q: str = Query(default=""),
    risk: str = Query(default=""),
    tag: str = Query(default=""),
    db: AsyncSession = Depends(get_db),
):
    """
    Alias for the normalized Congress.gov-backed federal legislative catalog.
    """
    laws = await list_congress_laws(db, limit=limit, q=q, risk=risk, tag=tag)
    freshness = await get_congress_laws_freshness(db)
    return {"laws": laws, "freshness": freshness}
