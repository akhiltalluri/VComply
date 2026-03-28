"""Liveness/readiness style endpoint for monitors and hackathon demos."""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}
