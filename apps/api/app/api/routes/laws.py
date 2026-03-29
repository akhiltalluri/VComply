"""Law catalog endpoints — preview + optional congress ingestion output."""
import json
import time
import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.services.law_service import (
    get_congress_laws_freshness,
    list_congress_laws,
    list_laws_preview,
)

router = APIRouter()
DEBUG_LOG_PATH = "/Users/sriyamsvedula/Vcomply/VComply/.cursor/debug-04ddc2.log"


def _debug_log(hypothesis_id: str, message: str, data: dict) -> None:
    payload = {
        "sessionId": "04ddc2",
        "id": f"log_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}",
        "timestamp": int(time.time() * 1000),
        "runId": "pre-fix",
        "hypothesisId": hypothesis_id,
        "location": "apps/api/app/api/routes/laws.py:get_congress_laws",
        "message": message,
        "data": data,
    }
    with open(DEBUG_LOG_PATH, "a", encoding="utf-8") as fp:
        fp.write(json.dumps(payload) + "\n")


@router.get("")
def get_laws():
    """Placeholder list; wire to DB or law-seeds package when ready."""
    return {"laws": list_laws_preview()}


@router.get("/congress")
async def get_congress_laws(
    limit: int = Query(default=50, ge=1, le=200),
    q: str = Query(default=""),
    risk: str = Query(default=""),
    tag: str = Query(default=""),
    db: AsyncSession = Depends(get_db),
):
    """
    Return ingested Congress.gov AI-law candidates.
    This is additive and does not modify existing /laws behavior.
    """
    # region agent log
    _debug_log(
        "H1",
        "entered_get_congress_laws",
        {"limit": limit, "q": q, "risk": risk, "tag": tag},
    )
    # endregion
    laws = await list_congress_laws(db, limit=limit, q=q, risk=risk, tag=tag)
    freshness = await get_congress_laws_freshness(db)
    # region agent log
    _debug_log(
        "H1",
        "returning_get_congress_laws",
        {
            "law_count": len(laws),
            "first_keys": sorted(list(laws[0].keys())) if laws else [],
            "freshness_keys": sorted(list(freshness.keys())) if isinstance(freshness, dict) else [],
        },
    )
    # endregion
    return {"laws": laws, "freshness": freshness}
