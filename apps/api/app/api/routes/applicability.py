"""Applicability checks: map intake facts to candidate federal legislative records."""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas.applicability import (
    ApplicabilityCheckRequest,
    ApplicabilityCheckResponse,
    SourceLawItem,
)
from app.services.applicability_engine import derive_focus_flags, run_applicability_check
from app.services.law_service import normalize_legislative_status

router = APIRouter()


async def fetch_source_laws(db: AsyncSession, payload: ApplicabilityCheckRequest) -> list[SourceLawItem]:
    flags = derive_focus_flags(payload)
    primary_tag = ""
    secondary_tag = ""

    if flags["has_hiring"]:
        primary_tag = "hiring"
        secondary_tag = "transparency"
    elif flags["has_vision"]:
        primary_tag = "biometrics"
        secondary_tag = "transparency"
    elif flags["has_scoring"] or flags["has_recommendation"] or flags["has_general"]:
        primary_tag = "transparency"
        secondary_tag = "privacy"

    rows = await db.execute(
        text(
            """
            select
              source_id as id,
              source,
              title as law,
              coalesce(risk, 'MEDIUM') as risk,
              coalesce(summary, 'Summary unavailable.') as reason,
              coalesce(status, 'Latest action unavailable.') as latest_action,
              url,
              url as source_url,
              latest_action_date,
              last_synced_at
            from public.law_documents
            where source = 'congress_gov'
              and (
                :primary_tag = ''
                or :primary_tag = any(coalesce(applicability_tags, '{}'))
                or (:secondary_tag != '' and :secondary_tag = any(coalesce(applicability_tags, '{}')))
                or (:employment_focus = true and lower(coalesce(summary, '')) like '%employment%')
              )
            order by
              case when :primary_tag != '' and :primary_tag = any(coalesce(applicability_tags, '{}')) then 3 else 0 end desc,
              case when :secondary_tag != '' and :secondary_tag = any(coalesce(applicability_tags, '{}')) then 2 else 0 end desc,
              case when upper(coalesce(risk, 'MEDIUM')) = 'HIGH' then 2 else 1 end desc,
              coalesce(latest_action_date, introduced_at) desc nulls last
            limit 5
            """
        ),
        {
            "primary_tag": primary_tag,
            "secondary_tag": secondary_tag,
            "employment_focus": flags["has_hiring"],
        },
    )
    mappings = rows.mappings().all()

    return [
        SourceLawItem(
            id=str(item.get("id") or ""),
            source=str(item.get("source") or "congress_gov"),
            law=str(item.get("law") or "Federal bill"),
            jurisdiction="United States",
            level="federal",
            status=normalize_legislative_status(str(item.get("latest_action") or "")),
            risk=str(item.get("risk") or "MEDIUM"),
            reason=str(item.get("reason") or "No summary available."),
            latest_action=str(item.get("latest_action")) if item.get("latest_action") else None,
            source_url=str(item.get("source_url")) if item.get("source_url") else None,
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
    source_laws = await fetch_source_laws(db, payload)
    result = run_applicability_check(payload, source_laws)
    flags = derive_focus_flags(payload)

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
            "states": "federal-only",
            "uses_hiring_ai": flags["has_hiring"],
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
