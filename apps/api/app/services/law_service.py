"""Law catalog access for Congress.gov-backed federal legislative records."""
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


def normalize_legislative_status(latest_action_text: str) -> str:
    normalized = latest_action_text.lower()

    if "became public law" in normalized or "signed into law" in normalized or "public law" in normalized:
        return "ENACTED"
    if "presented to president" in normalized or "to the president" in normalized:
        return "PASSED_CONGRESS"
    if "passed senate" in normalized or "passed house" in normalized:
        return "PASSED_ONE_CHAMBER"
    if "reported by committee" in normalized or "ordered to be reported" in normalized:
        return "COMMITTEE_REVIEW"
    if "introduced" in normalized:
        return "INTRODUCED"

    return "IN_PROGRESS"


def derive_category(tags: list[str]) -> str:
    normalized_tags = {tag.lower() for tag in tags}

    if "hiring" in normalized_tags:
        return "Employment AI"
    if "biometrics" in normalized_tags:
        return "Biometrics & Identity"
    if "privacy" in normalized_tags:
        return "Privacy & Consumer Protection"
    if "transparency" in normalized_tags:
        return "AI Transparency"

    return "Federal AI Legislation"


def derive_enforcement_stage(status: str) -> str:
    return {
        "ENACTED": "Enacted Federal Law",
        "PASSED_CONGRESS": "Passed Congress",
        "PASSED_ONE_CHAMBER": "Advancing Through Congress",
        "COMMITTEE_REVIEW": "Committee Review",
        "INTRODUCED": "Introduced in Congress",
        "IN_PROGRESS": "Active Legislative Process",
    }.get(status, "Active Legislative Process")


def titleize_tags(tags: list[str]) -> list[str]:
    return [tag.replace("_", " ").title() for tag in tags]


def normalize_congress_law(row: dict[str, Any]) -> dict[str, Any]:
    applicability_tags = [
        str(tag).strip().lower()
        for tag in (row.get("applicability_tags") or [])
        if str(tag).strip()
    ]
    latest_action = str(row.get("latest_action") or "Latest action unavailable.").strip()
    legislative_status = normalize_legislative_status(latest_action)
    latest_action_date = row.get("latest_action_date")
    latest_action_date_text = str(latest_action_date) if latest_action_date else None

    return {
        "id": row.get("id"),
        "name": row.get("name"),
        "title": row.get("name"),
        "bill_number": row.get("bill_number"),
        "bill_type": row.get("bill_type"),
        "congress": row.get("congress"),
        "jurisdiction": "United States",
        "level": "federal",
        "status": legislative_status,
        "summary": row.get("summary"),
        "category": derive_category(applicability_tags),
        "source": row.get("source") or "congress_gov",
        "source_label": "Congress.gov",
        "source_url": row.get("source_url"),
        "latest_action": latest_action,
        "latest_action_date": latest_action_date_text,
        "effective_date": latest_action_date_text if legislative_status == "ENACTED" else None,
        "enforcement_stage": derive_enforcement_stage(legislative_status),
        "enforcement_status": latest_action,
        "risk": row.get("risk") or "MEDIUM",
        "tags": titleize_tags(applicability_tags),
        "use_cases": titleize_tags(applicability_tags),
        "affected_workflows": titleize_tags(applicability_tags),
    }


async def list_congress_laws(
    db: AsyncSession,
    *,
    limit: int = 50,
    q: str = "",
    risk: str = "",
    tag: str = "",
) -> list[dict[str, Any]]:
    """
    Fetch normalized federal legislative records ingested from Congress.gov.
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
            congress_number as congress,
            bill_type,
            bill_number,
            coalesce(summary, 'Summary unavailable.') as summary,
            coalesce(status, 'Latest action unavailable.') as latest_action,
            coalesce(url, '') as source_url,
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
    return [normalize_congress_law(dict(row)) for row in rows]


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
