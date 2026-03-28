"""Law catalog endpoints — stub for listing/searching regulations."""
from fastapi import APIRouter

from app.services.law_service import list_laws_preview

router = APIRouter()


@router.get("")
def get_laws():
    """Placeholder list; wire to DB or law-seeds package when ready."""
    return {"laws": list_laws_preview()}
