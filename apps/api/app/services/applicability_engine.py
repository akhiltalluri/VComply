"""
Mock applicability engine — returns deterministic demo output for NY + hiring AI.
Swap for real rules + embeddings / retrieval over `packages/law-seeds` data.
"""
from app.schemas.applicability import (
    ApplicabilityCheckRequest,
    ApplicabilityCheckResponse,
    ApplicableLawItem,
)


def run_applicability_check(payload: ApplicabilityCheckRequest) -> ApplicabilityCheckResponse:
    applicable: list[ApplicableLawItem] = []

    states_upper = {s.strip().upper() for s in payload.states}
    if "NY" in states_upper and payload.uses_hiring_ai:
        applicable.append(
            ApplicableLawItem(
                law="NYC Local Law 144",
                risk="HIGH",
                reason="AI used in hiring in NY",
            )
        )

    # Simple demo score: bump when we surface at least one high-risk law
    risk_score = 30 if applicable else 0

    return ApplicabilityCheckResponse(applicable_laws=applicable, risk_score=risk_score)
