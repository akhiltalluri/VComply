"""Pydantic models for POST /applicability/check."""
from pydantic import BaseModel, Field


class ApplicabilityCheckRequest(BaseModel):
    states: list[str] = Field(..., description="US state codes, e.g. NY, CA")
    uses_hiring_ai: bool = Field(..., description="Whether AI is used in hiring / recruiting")


class ApplicableLawItem(BaseModel):
    law: str
    risk: str
    reason: str


class SourceLawItem(BaseModel):
    id: str
    source: str
    law: str
    risk: str
    reason: str
    url: str | None = None
    latest_action_date: str | None = None
    last_synced_at: str | None = None


class ApplicabilityCheckResponse(BaseModel):
    applicable_laws: list[ApplicableLawItem]
    risk_score: int
    source_laws: list[SourceLawItem] = []
