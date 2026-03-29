"""Law catalog access for Congress.gov-backed federal legislative records."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

CONGRESS_BASE_URL = "https://api.congress.gov/v3/bill"
CONGRESS_SAMPLE_PATH = Path(__file__).resolve().parents[2] / "scripts" / "samples" / "congress_sample.json"
CONGRESS_KEYWORDS = [
    "artificial intelligence",
    "ai",
    "machine learning",
    "algorithmic",
    "automated decision",
    "deepfake",
    "biometric",
]
CONGRESS_APPLICABILITY_TAGS = {
    "hiring": ["hiring", "employment", "candidate", "recruiting"],
    "biometrics": ["biometric", "facial recognition", "voiceprint"],
    "privacy": ["data privacy", "consumer data", "personally identifiable"],
    "transparency": ["disclosure", "notice", "explainability", "audit"],
}


def get_json(url: str) -> dict[str, Any]:
    req = Request(
        url,
        headers={"Accept": "application/json", "User-Agent": "vcomply-laws-service/1.0"},
    )
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def load_sample_congress_payload() -> dict[str, Any]:
    if not CONGRESS_SAMPLE_PATH.exists():
        return {}

    return json.loads(CONGRESS_SAMPLE_PATH.read_text(encoding="utf-8"))


def extract_bill_records(payload: dict[str, Any]) -> list[dict[str, Any]]:
    if isinstance(payload.get("bills"), list):
        return payload["bills"]
    if isinstance(payload.get("data"), dict) and isinstance(payload["data"].get("bills"), list):
        return payload["data"]["bills"]
    return []


def extract_summary_text(bill: dict[str, Any]) -> str:
    summary_candidate = bill.get("summary") or bill.get("latestSummary")

    if isinstance(summary_candidate, str):
        return summary_candidate.strip()

    if isinstance(summary_candidate, dict):
        for key in ("text", "actionDesc", "summary"):
            value = summary_candidate.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()

    if isinstance(summary_candidate, list):
        for item in reversed(summary_candidate):
            if isinstance(item, dict):
                for key in ("text", "actionDesc", "summary"):
                    value = item.get(key)
                    if isinstance(value, str) and value.strip():
                        return value.strip()
            elif isinstance(item, str) and item.strip():
                return item.strip()

    return ""


def extract_latest_action_text(bill: dict[str, Any]) -> str:
    latest_action = bill.get("latestAction")
    if isinstance(latest_action, dict):
        text_value = latest_action.get("text")
        if isinstance(text_value, str) and text_value.strip():
            return text_value.strip()

    latest_action_text = bill.get("latestActionText")
    if isinstance(latest_action_text, str) and latest_action_text.strip():
        return latest_action_text.strip()

    return ""


def ai_match_score(title: str, summary: str, keywords: list[str]) -> int:
    haystack = f"{title} {summary}".lower()
    return sum(1 for kw in keywords if kw.lower() in haystack)


def derive_applicability_tags(title: str, summary: str) -> list[str]:
    haystack = f"{title} {summary}".lower()
    tags: list[str] = []
    for tag, triggers in CONGRESS_APPLICABILITY_TAGS.items():
        if any(trigger in haystack for trigger in triggers):
            tags.append(tag)
    return tags


def normalize_live_congress_bill(
    bill: dict[str, Any],
    *,
    fallback_congress: int,
) -> dict[str, Any] | None:
    title = str(bill.get("title") or bill.get("shortTitle") or "").strip()
    summary = extract_summary_text(bill)
    latest_action = extract_latest_action_text(bill) or "Latest action unavailable."
    score = ai_match_score(title, summary, CONGRESS_KEYWORDS)

    if score < 1:
        return None

    tags = derive_applicability_tags(title, summary)
    congress = int(bill.get("congress") or fallback_congress)
    bill_type = str(bill.get("type") or "").lower()
    bill_number = str(bill.get("number") or "").strip()
    bill_id = f"{congress}-{bill_type}-{bill_number}".strip("-")
    legislative_status = normalize_legislative_status(latest_action)
    latest_action_date = None

    latest_action_obj = bill.get("latestAction")
    if isinstance(latest_action_obj, dict):
        action_date = latest_action_obj.get("actionDate")
        if isinstance(action_date, str) and action_date.strip():
            latest_action_date = action_date[:10]

    return {
        "id": bill_id or f"bill-{congress}-{bill_number or 'unknown'}",
        "name": title or f"Bill {bill_number or 'Unknown'}",
        "title": title or f"Bill {bill_number or 'Unknown'}",
        "bill_number": bill_number,
        "bill_type": bill_type,
        "congress": congress,
        "jurisdiction": "United States",
        "level": "federal",
        "status": legislative_status,
        "summary": summary or latest_action,
        "category": derive_category(tags),
        "source": "congress_gov",
        "source_label": "Congress.gov",
        "source_url": str(bill.get("url") or "").strip(),
        "latest_action": latest_action,
        "latest_action_date": latest_action_date,
        "effective_date": latest_action_date if legislative_status == "ENACTED" else None,
        "enforcement_stage": derive_enforcement_stage(legislative_status),
        "enforcement_status": latest_action,
        "risk": "HIGH" if score >= 3 else "MEDIUM",
        "tags": titleize_tags(tags),
        "use_cases": titleize_tags(tags),
        "affected_workflows": titleize_tags(tags),
    }


def matches_filters(law: dict[str, Any], *, q: str, risk: str, tag: str) -> bool:
    query = q.strip().lower()
    if query:
        searchable = " ".join(
            [
                str(law.get("name") or ""),
                str(law.get("summary") or ""),
                " ".join(str(item) for item in (law.get("tags") or [])),
                " ".join(str(item) for item in (law.get("use_cases") or [])),
            ]
        ).lower()
        if query not in searchable:
            return False

    if risk.strip() and str(law.get("risk") or "").upper() != risk.strip().upper():
        return False

    if tag.strip():
        normalized_tag = tag.strip().lower()
        tag_values = [str(item).strip().lower() for item in law.get("tags") or []]
        if normalized_tag not in tag_values:
            return False

    return True


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


async def fetch_live_congress_laws(
    *,
    limit: int = 50,
    q: str = "",
    risk: str = "",
    tag: str = "",
    congress: int = 119,
    pages: int = 2,
) -> list[dict[str, Any]]:
    """Fetch live federal legislative records directly from Congress.gov as a fallback."""
    api_key = os.getenv("CONGRESS_API_KEY")
    if not api_key:
        return []

    collected: list[dict[str, Any]] = []
    seen: set[str] = set()
    request_limit = min(max(limit, 10), 50)

    for page in range(max(pages, 1)):
        offset = page * request_limit
        query_string = urlencode(
            {
                "api_key": api_key,
                "format": "json",
                "limit": request_limit,
                "offset": offset,
            }
        )
        payload = get_json(f"{CONGRESS_BASE_URL}/{congress}?{query_string}")
        bills = extract_bill_records(payload)
        if not bills:
            break

        for bill in bills:
            normalized = normalize_live_congress_bill(bill, fallback_congress=congress)
            if not normalized or not matches_filters(normalized, q=q, risk=risk, tag=tag):
                continue

            law_id = str(normalized.get("id") or "")
            if not law_id or law_id in seen:
                continue

            seen.add(law_id)
            collected.append(normalized)

            if len(collected) >= limit:
                return collected[:limit]

    return collected[:limit]


def get_sample_congress_laws(
    *,
    limit: int = 50,
    q: str = "",
    risk: str = "",
    tag: str = "",
    congress: int = 118,
) -> list[dict[str, Any]]:
    """Load a small real Congress.gov-backed sample snapshot as a demo-safe fallback."""
    payload = load_sample_congress_payload()
    bills = extract_bill_records(payload)
    collected: list[dict[str, Any]] = []
    seen: set[str] = set()

    for bill in bills:
        normalized = normalize_live_congress_bill(bill, fallback_congress=congress)
        if not normalized or not matches_filters(normalized, q=q, risk=risk, tag=tag):
            continue

        law_id = str(normalized.get("id") or "")
        if not law_id or law_id in seen:
            continue

        seen.add(law_id)
        collected.append(normalized)

        if len(collected) >= limit:
            break

    return collected[:limit]
