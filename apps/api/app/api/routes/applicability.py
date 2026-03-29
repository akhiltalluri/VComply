from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas.applicability import ApplicabilityCheckRequest, ApplicabilityCheckResponse
from app.services.applicability_engine import run_applicability_check

router = APIRouter()


@router.post("/check", response_model=ApplicabilityCheckResponse)
async def check_applicability(
    payload: ApplicabilityCheckRequest,
    db: AsyncSession = Depends(get_db),
) -> ApplicabilityCheckResponse:
    result = run_applicability_check(payload)

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

    return result
