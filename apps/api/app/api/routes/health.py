"""Liveness/readiness style endpoints for monitors and DB connectivity checks."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/health/db")
async def health_db(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        value = result.scalar_one()
        return {"status": "ok", "db": "connected", "result": value}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database check failed: {exc}")