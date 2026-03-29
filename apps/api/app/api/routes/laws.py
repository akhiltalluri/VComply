"""Law catalog endpoints backed by normalized Congress.gov federal records."""

import logging

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_optional_db
from app.services.law_service import (
    fetch_live_congress_laws,
    get_congress_laws_freshness,
    get_sample_congress_laws,
    list_congress_laws,
)

router = APIRouter()
logger = logging.getLogger(__name__)


def unavailable_payload(reason: str):
    return {
        "laws": [],
        "freshness": {"total_records": 0, "latest_sync": None},
        "availability": {"ready": False, "reason": reason},
    }


async def build_laws_response(
    *,
    db: AsyncSession | None,
    limit: int,
    q: str,
    risk: str,
    tag: str,
):
    if db is not None:
        try:
            laws = await list_congress_laws(db, limit=limit, q=q, risk=risk, tag=tag)
            freshness = await get_congress_laws_freshness(db)
            if laws:
                return {
                    "laws": laws,
                    "freshness": freshness,
                    "availability": {"ready": True, "reason": None, "source": "database"},
                }
        except Exception:
            logger.exception("Unable to load Congress.gov federal legislative records from the database.")

    try:
        live_laws = await fetch_live_congress_laws(limit=limit, q=q, risk=risk, tag=tag)
        if live_laws:
            return {
                "laws": live_laws,
                "freshness": {"total_records": len(live_laws), "latest_sync": None},
                "availability": {"ready": True, "reason": "live_fetch", "source": "congress_gov"},
            }
    except Exception:
        logger.exception("Unable to load Congress.gov federal legislative records from the live API.")

    try:
        sample_laws = get_sample_congress_laws(limit=limit, q=q, risk=risk, tag=tag)
        if sample_laws:
            logger.warning("Serving sample Congress.gov records because live federal data is unavailable.")
            return {
                "laws": sample_laws,
                "freshness": {"total_records": len(sample_laws), "latest_sync": None},
                "availability": {"ready": True, "reason": "sample_fallback", "source": "congress_sample"},
            }
    except Exception:
        logger.exception("Unable to load sample Congress.gov fallback records.")

    if db is None:
        logger.warning("Federal laws requested without an available database connection.")
        return unavailable_payload("database_unavailable")

    return unavailable_payload("catalog_unavailable")


@router.get("")
async def get_laws(
    limit: int = Query(default=50, ge=1, le=200),
    q: str = Query(default=""),
    risk: str = Query(default=""),
    tag: str = Query(default=""),
    db: AsyncSession | None = Depends(get_optional_db),
):
    """Return the normalized federal legislative library sourced from Congress.gov."""
    return await build_laws_response(db=db, limit=limit, q=q, risk=risk, tag=tag)


@router.get("/congress")
async def get_congress_laws(
    limit: int = Query(default=50, ge=1, le=200),
    q: str = Query(default=""),
    risk: str = Query(default=""),
    tag: str = Query(default=""),
    db: AsyncSession | None = Depends(get_optional_db),
):
    """
    Alias for the normalized Congress.gov-backed federal legislative catalog.
    """
    return await build_laws_response(db=db, limit=limit, q=q, risk=risk, tag=tag)
