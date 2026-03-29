"""Simple federal applicability scoring for intake-driven assessments."""
from app.schemas.applicability import (
    ApplicabilityCheckRequest,
    ApplicabilityCheckResponse,
    ApplicableLawItem,
    SourceLawItem,
)


def derive_focus_flags(payload: ApplicabilityCheckRequest) -> dict[str, bool]:
    categories = {category.strip().lower() for category in payload.selected_categories}
    text_blob = f"{payload.ai_use_cases} {payload.critical_use_cases or ''}".lower()
    legacy_hiring = bool(payload.uses_hiring_ai)

    has_hiring = "hiring-hr-ai" in categories or legacy_hiring or any(
        token in text_blob for token in ("hiring", "candidate", "recruit", "interview", "employee")
    )
    has_predictive = "predictive-analytics" in categories or any(
        token in text_blob for token in ("fraud", "credit", "eligibility", "underwriting", "score")
    )
    has_general = any(
        category in categories
        for category in (
            "llm",
            "customer-support-ai",
            "document-workflow-automation",
            "internal-knowledge-search-assistant",
            "compliance-monitoring-automation",
        )
    ) or any(token in text_blob for token in ("assistant", "chatbot", "workflow", "automation", "summar"))

    return {
        "has_hiring": has_hiring,
        "has_predictive": has_predictive,
        "has_scoring": has_predictive,
        "has_vision": False,
        "has_recommendation": False,
        "has_general": has_general,
    }


def compute_risk_score(payload: ApplicabilityCheckRequest, source_laws: list[SourceLawItem]) -> int:
    flags = derive_focus_flags(payload)
    score = 24 + min(len(payload.selected_categories), 4) * 4 + len(source_laws) * 4

    if flags["has_hiring"]:
        score += 32
    if flags["has_predictive"]:
        score += 18 if len(source_laws) > 1 else 14
    if flags["has_general"]:
        score += 6

    return max(24, min(94, score))


def derive_risk_label(score: int) -> str:
    if score >= 75:
        return "HIGH"
    if score >= 45:
        return "MEDIUM"
    return "LOW"


def build_reason(payload: ApplicabilityCheckRequest, law: SourceLawItem) -> str:
    flags = derive_focus_flags(payload)

    if flags["has_hiring"] and ("employment" in law.law.lower() or "hiring" in law.reason.lower()):
        return (
            "Hiring and HR workflows are in scope, so this federal legislative record is relevant "
            "to screening, recommendation, and transparency controls."
        )

    if flags["has_predictive"]:
        return (
            "Predictive or consequential scoring workflows are in scope, so this federal "
            "record is relevant to audit readiness, documentation, and oversight."
        )

    return (
        "The current AI deployment profile overlaps with federal legislative monitoring themes "
        "around transparency, accountability, and governance."
    )


def run_applicability_check(
    payload: ApplicabilityCheckRequest,
    source_laws: list[SourceLawItem],
) -> ApplicabilityCheckResponse:
    risk_score = compute_risk_score(payload, source_laws)
    risk_label = derive_risk_label(risk_score)

    applicable = [
        ApplicableLawItem(
            id=law.id,
            law=law.law,
            jurisdiction=law.jurisdiction,
            risk=law.risk or risk_label,
            reason=build_reason(payload, law),
            next_step="Review enacted text" if law.status == "ENACTED" else "Monitor congressional status",
        )
        for law in source_laws[:4]
    ]

    return ApplicabilityCheckResponse(
        applicable_laws=applicable,
        risk_score=risk_score,
        source_laws=source_laws,
    )
