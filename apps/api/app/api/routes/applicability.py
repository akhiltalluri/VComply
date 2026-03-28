"""
Applicability checks: map company facts (states, AI use) to candidate laws.
Replace mock logic in the service with rules engine + law corpus later.
"""
from fastapi import APIRouter

from app.schemas.applicability import ApplicabilityCheckRequest, ApplicabilityCheckResponse
from app.services.applicability_engine import run_applicability_check

router = APIRouter()


@router.post("/check", response_model=ApplicabilityCheckResponse)
def check_applicability(payload: ApplicabilityCheckRequest) -> ApplicabilityCheckResponse:
    return run_applicability_check(payload)
