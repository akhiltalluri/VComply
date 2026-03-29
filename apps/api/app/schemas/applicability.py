"""Pydantic models for POST /applicability/check."""
from pydantic import BaseModel, Field


class ApplicabilityCheckRequest(BaseModel):
    ai_use_cases: str = Field(
        default="", description="Description of AI use cases in scope"
    )
    selected_categories: list[str] = Field(
        default_factory=list, description="Selected AI system categories"
    )
    critical_use_cases: str | None = Field(
        default=None, description="Additional sensitive workflow context"
    )
    states: list[str] = Field(
        default_factory=list,
        description="Legacy compatibility field for older intake payloads.",
    )
    uses_hiring_ai: bool | None = Field(
        default=None,
        description="Legacy compatibility field for older intake payloads.",
    )


class ApplicableLawItem(BaseModel):
    id: str | None = None
    law: str
    jurisdiction: str | None = "United States"
    risk: str
    reason: str
    next_step: str | None = None


class SourceLawItem(BaseModel):
    id: str
    source: str
    law: str
    jurisdiction: str = "United States"
    level: str = "federal"
    status: str = "IN_PROGRESS"
    risk: str
    reason: str
    latest_action: str | None = None
    source_url: str | None = None
    url: str | None = None
    latest_action_date: str | None = None
    last_synced_at: str | None = None


class ApplicabilityCheckResponse(BaseModel):
    applicable_laws: list[ApplicableLawItem]
    risk_score: int
    source_laws: list[SourceLawItem] = []
