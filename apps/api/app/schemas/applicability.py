"""Pydantic models for POST /applicability/check."""
from pydantic import BaseModel, Field


class ApplicabilityCheckRequest(BaseModel):
    states: list[str] = Field(..., description="US state codes, e.g. NY, CA")
    uses_hiring_ai: bool = Field(..., description="Whether AI is used in hiring / recruiting")


class ApplicableLawItem(BaseModel):
    law: str
    risk: str
    reason: str


class ApplicabilityCheckResponse(BaseModel):
    applicable_laws: list[ApplicableLawItem]
    risk_score: int
