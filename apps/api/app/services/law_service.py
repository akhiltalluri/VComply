"""Law catalog access — file/DB backed implementations go here."""
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


def list_laws_preview() -> list[dict]:
    """Minimal stub so GET /laws returns structured JSON for the UI."""
    return [
        {
            "id": "nyc-ll-144",
            "name": "NYC Local Law 144",
            "jurisdiction": "New York City",
            "summary": "Automated employment decision tools — bias audit and notice requirements.",
        }
    ]


async def list_congress_laws(
    db: AsyncSession,
    *,
    limit: int = 50,
    q: str = "",
    risk: str = "",
    tag: str = "",
) -> list[dict[str, Any]]:
    """
    Fetch normalized laws ingested from Congress.gov.
    Additive endpoint support; existing preview path remains unchanged.
    """
    where_clauses = ["source = 'congress_gov'"]
    params: dict[str, Any] = {"limit_value": limit}

    if q.strip():
        where_clauses.append("(title ilike :query or coalesce(summary, '') ilike :query)")
        params["query"] = f"%{q.strip()}%"
    if risk.strip():
        where_clauses.append("upper(coalesce(risk, 'MEDIUM')) = :risk_value")
        params["risk_value"] = risk.strip().upper()
    if tag.strip():
        where_clauses.append(":tag_value = any(coalesce(applicability_tags, '{}'))")
        params["tag_value"] = tag.strip().lower()

    where_sql = " and ".join(where_clauses)
    query = f"""
        select
            source_id as id,
            title as name,
            coalesce(status, 'Unknown status') as status,
            coalesce(summary, 'Summary unavailable.') as summary,
            coalesce(url, '') as url,
            coalesce(risk, 'MEDIUM') as risk,
            coalesce(applicability_tags, '{{}}') as applicability_tags,
            latest_action_date,
            last_synced_at,
            source
        from public.law_documents
        where {where_sql}
        order by coalesce(latest_action_date, introduced_at) desc nulls last
        limit :limit_value
    """
    result = await db.execute(text(query), params)

    rows = result.mappings().all()
    return [dict(row) for row in rows]


async def get_congress_laws_freshness(db: AsyncSession) -> dict[str, Any]:
    result = await db.execute(
        text(
            """
            select
              count(*)::int as total_records,
              max(last_synced_at) as latest_sync
            from public.law_documents
            where source = 'congress_gov'
            """
        )
    )
    row = result.mappings().first()
    return dict(row) if row else {"total_records": 0, "latest_sync": None}
