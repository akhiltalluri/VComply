"""
Applicability checks: map company facts (states, AI use) to candidate laws.
Replace mock logic in the service with rules engine + law corpus later.
"""
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
    result = run_applicability_check(payload)
    source_laws = await fetch_source_laws(db, payload)

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
    return ApplicabilityCheckResponse(
        applicable_laws=result.applicable_laws,
        risk_score=result.risk_score,
        source_laws=source_laws,
    )
