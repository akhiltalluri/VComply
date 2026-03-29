<<<<<<< Updated upstream
=======
"""
Applicability checks: map company facts (states, AI use) to candidate laws.
Replace mock logic in the service with rules engine + law corpus later.
"""
import json
import time
import uuid

>>>>>>> Stashed changes
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas.applicability import (
    ApplicabilityCheckRequest,
    ApplicabilityCheckResponse,
    SourceLawItem,
)
from app.services.applicability_engine import run_applicability_check

router = APIRouter()
DEBUG_LOG_PATH = "/Users/sriyamsvedula/Vcomply/VComply/.cursor/debug-04ddc2.log"


def _debug_log(hypothesis_id: str, message: str, data: dict) -> None:
    payload = {
        "sessionId": "04ddc2",
        "id": f"log_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}",
        "timestamp": int(time.time() * 1000),
        "runId": "pre-fix",
        "hypothesisId": hypothesis_id,
        "location": "apps/api/app/api/routes/applicability.py:check_applicability",
        "message": message,
        "data": data,
    }
    with open(DEBUG_LOG_PATH, "a", encoding="utf-8") as fp:
        fp.write(json.dumps(payload) + "\n")


async def fetch_source_laws(db: AsyncSession, payload: ApplicabilityCheckRequest) -> list[SourceLawItem]:
    states_upper = {state.strip().upper() for state in payload.states}
    prefers_hiring = payload.uses_hiring_ai
    rows = await db.execute(
        text(
            """
            select
              source_id as id,
              source,
              title as law,
              coalesce(risk, 'MEDIUM') as risk,
              coalesce(summary, 'Summary unavailable.') as reason,
              url,
              latest_action_date,
              last_synced_at
            from public.law_documents
            where source = 'congress_gov'
              and (
                :prefers_hiring = false
                or 'hiring' = any(coalesce(applicability_tags, '{}'))
                or lower(coalesce(summary, '')) like '%hiring%'
              )
            order by
              case when upper(coalesce(risk, 'MEDIUM')) = 'HIGH' then 2 else 1 end desc,
              coalesce(latest_action_date, introduced_at) desc nulls last
            limit 5
            """
        ),
        {"prefers_hiring": prefers_hiring},
    )
    mappings = rows.mappings().all()

    # Federal laws are broadly applicable for US operations; keep additive + conservative.
    include_federal = bool(states_upper)
    if not include_federal:
        return []

    return [
        SourceLawItem(
            id=str(item.get("id") or ""),
            source=str(item.get("source") or "congress_gov"),
            law=str(item.get("law") or "Federal bill"),
            risk=str(item.get("risk") or "MEDIUM"),
            reason=str(item.get("reason") or "No summary available."),
            url=str(item.get("url")) if item.get("url") else None,
            latest_action_date=str(item.get("latest_action_date")) if item.get("latest_action_date") else None,
            last_synced_at=str(item.get("last_synced_at")) if item.get("last_synced_at") else None,
        )
        for item in mappings
    ]


@router.post("/check", response_model=ApplicabilityCheckResponse)
async def check_applicability(
    payload: ApplicabilityCheckRequest,
    db: AsyncSession = Depends(get_db),
) -> ApplicabilityCheckResponse:
    # region agent log
    _debug_log(
        "H2",
        "entered_check_applicability",
        {"states_count": len(payload.states), "uses_hiring_ai": payload.uses_hiring_ai},
    )
    # endregion
    result = run_applicability_check(payload)
    source_laws = await fetch_source_laws(db, payload)
    # region agent log
    _debug_log(
        "H3",
        "computed_applicability_and_source_laws",
        {
            "risk_score": result.risk_score,
            "applicable_law_count": len(result.applicable_laws),
            "source_law_count": len(source_laws),
        },
    )
    # endregion

    first_law = result.applicable_laws[0] if result.applicable_laws else None

    await db.execute(
        text(
            """
            insert into public.intake_checks
            (states, uses_hiring_ai, risk_score, law, risk, reason)
            values
            (:states, :uses_hiring_ai, :risk_score, :law, :risk, :reason)
            """
        ),
        {
            "states": ",".join(payload.states),
            "uses_hiring_ai": payload.uses_hiring_ai,
            "risk_score": result.risk_score,
            "law": first_law.law if first_law else None,
            "risk": first_law.risk if first_law else None,
            "reason": first_law.reason if first_law else None,
        },
    )
    await db.commit()
<<<<<<< Updated upstream

    return result
=======
    # region agent log
    _debug_log(
        "H3",
        "committed_intake_check",
        {"saved_law": first_law.law if first_law else None, "risk_score": result.risk_score},
    )
    # endregion
    return ApplicabilityCheckResponse(
        applicable_laws=result.applicable_laws,
        risk_score=result.risk_score,
        source_laws=source_laws,
    )
>>>>>>> Stashed changes
