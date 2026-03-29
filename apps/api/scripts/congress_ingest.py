"""
Congress.gov ingestion script for MVP law discovery.

This script fetches AI-relevant federal legislative records from the
official Congress.gov API and upserts them into public.law_documents.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import asyncpg
from dotenv import load_dotenv

BASE_URL = "https://api.congress.gov/v3/bill"
DEFAULT_KEYWORDS = [
    "artificial intelligence",
    "ai",
    "machine learning",
    "algorithmic",
    "automated decision",
    "deepfake",
    "biometric",
]
DEFAULT_APPLICABILITY_TAGS = {
    "hiring": ["hiring", "employment", "candidate", "recruiting"],
    "biometrics": ["biometric", "facial recognition", "voiceprint"],
    "privacy": ["data privacy", "consumer data", "personally identifiable"],
    "transparency": ["disclosure", "notice", "explainability", "audit"],
}


def get_json(url: str) -> dict[str, Any]:
    req = Request(url, headers={"Accept": "application/json", "User-Agent": "vcomply-mvp-ingest/1.0"})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def normalize_database_url_for_asyncpg(database_url: str) -> str:
    # SQLAlchemy async URL (postgresql+asyncpg://...) -> asyncpg DSN (postgresql://...)
    if database_url.startswith("postgresql+asyncpg://"):
        return "postgresql://" + database_url.split("://", 1)[1]
    return database_url


def ai_match_score(title: str, summary: str, keywords: list[str]) -> int:
    haystack = f"{title} {summary}".lower()
    return sum(1 for kw in keywords if kw.lower() in haystack)


def derive_applicability_tags(title: str, summary: str) -> list[str]:
    haystack = f"{title} {summary}".lower()
    tags: list[str] = []
    for tag, triggers in DEFAULT_APPLICABILITY_TAGS.items():
        if any(trigger in haystack for trigger in triggers):
            tags.append(tag)
    return tags


def extract_bill_records(payload: dict[str, Any]) -> list[dict[str, Any]]:
    # Congress.gov response formats vary slightly by endpoint/query.
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


def parse_date(date_text: str | None) -> datetime | None:
    if not date_text:
        return None
    try:
        # Typical format: YYYY-MM-DD
        return datetime.strptime(date_text[:10], "%Y-%m-%d")
    except ValueError:
        return None


async def upsert_law(conn: asyncpg.Connection, row: dict[str, Any]) -> None:
    await conn.execute(
        """
        insert into public.law_documents (
            source, source_id, congress_number, bill_type, bill_number, title,
            summary, status, introduced_at, latest_action_date, url,
            keywords, applicability_tags, risk, updated_at, last_synced_at
        )
        values (
            'congress_gov', $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11::text[], $12::text[], $13, now(), now()
        )
        on conflict (source, source_id)
        do update set
            congress_number = excluded.congress_number,
            bill_type = excluded.bill_type,
            bill_number = excluded.bill_number,
            title = excluded.title,
            summary = excluded.summary,
            status = excluded.status,
            introduced_at = excluded.introduced_at,
            latest_action_date = excluded.latest_action_date,
            url = excluded.url,
            keywords = excluded.keywords,
            applicability_tags = excluded.applicability_tags,
            risk = excluded.risk,
            updated_at = now(),
            last_synced_at = now()
        """,
        row["source_id"],
        row["congress_number"],
        row["bill_type"],
        row["bill_number"],
        row["title"],
        row["summary"],
        row["status"],
        row["introduced_at"],
        row["latest_action_date"],
        row["url"],
        row["keywords"],
        row["applicability_tags"],
        row["risk"],
    )


async def start_ingestion_run(
    conn: asyncpg.Connection,
    *,
    source: str,
    congress: int,
    pages: int,
    limit: int,
    min_score: int,
    keywords: list[str],
    input_file: str | None,
) -> str | None:
    try:
        return await conn.fetchval(
            """
            insert into public.law_ingestion_runs (
                source, congress_number, pages_requested, request_limit, min_score,
                keywords, input_file, status, run_started_at
            )
            values ($1, $2, $3, $4, $5, $6::text[], $7, 'RUNNING', now())
            returning id::text
            """,
            source,
            congress,
            pages,
            limit,
            min_score,
            keywords,
            input_file,
        )
    except Exception:
        # Keep ingestion resilient if run-log table has not been applied yet.
        return None


async def finish_ingestion_run(
    conn: asyncpg.Connection,
    run_id: str | None,
    *,
    status: str,
    scanned: int,
    matched: int,
    upserted: int,
    error_message: str | None = None,
) -> None:
    if not run_id:
        return
    await conn.execute(
        """
        update public.law_ingestion_runs
        set status = $2,
            scanned_count = $3,
            matched_count = $4,
            upserted_count = $5,
            error_count = case when $2 = 'FAILED' then 1 else 0 end,
            error_message = $6,
            run_finished_at = now()
        where id::text = $1
        """,
        run_id,
        status,
        scanned,
        matched,
        upserted,
        error_message,
    )


def read_payload_from_file(input_file: str) -> dict[str, Any]:
    return json.loads(Path(input_file).read_text(encoding="utf-8"))


def build_law_row(bill: dict[str, Any], congress_default: int, keywords: list[str]) -> dict[str, Any] | None:
    title = str(bill.get("title") or bill.get("shortTitle") or "")
    summary = extract_summary_text(bill)
    score = ai_match_score(title, summary, keywords)
    if score < 1:
        return None

    bill_type = str(bill.get("type") or "").lower()
    bill_number = str(bill.get("number") or "")
    congress_num = int(bill.get("congress") or congress_default)
    source_id = f"{congress_num}-{bill_type}-{bill_number}".strip("-")
    latest_action = bill.get("latestAction") if isinstance(bill.get("latestAction"), dict) else {}
    latest_action_text = extract_latest_action_text(bill)
    latest_action_date = parse_date(str(latest_action.get("actionDate") or bill.get("latestActionDate") or ""))
    introduced_at = parse_date(str(bill.get("introducedDate") or ""))
    url_value = str(bill.get("url") or "")
    tags = derive_applicability_tags(title, summary)
    risk = "MEDIUM" if score < 3 else "HIGH"

    return {
        "source_id": source_id,
        "congress_number": congress_num,
        "bill_type": bill_type or None,
        "bill_number": bill_number or None,
        "title": title or f"Bill {source_id}",
        "summary": summary or latest_action_text or None,
        "status": latest_action_text or None,
        "introduced_at": introduced_at,
        "latest_action_date": latest_action_date,
        "url": url_value or None,
        "keywords": keywords,
        "applicability_tags": tags,
        "risk": risk,
    }


async def ingest(
    congress: int,
    pages: int,
    limit: int,
    min_score: int,
    keywords: list[str],
    input_file: str | None,
) -> dict[str, int | str | None]:
    load_dotenv()
    api_key = os.getenv("CONGRESS_API_KEY")
    database_url = os.getenv("DATABASE_URL")
    if not api_key and not input_file:
        raise RuntimeError("CONGRESS_API_KEY is not set (or provide --input-file)")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set")

    dsn = normalize_database_url_for_asyncpg(database_url)
    conn = await asyncpg.connect(dsn=dsn, statement_cache_size=0)

    inserted_or_updated = 0
    scanned = 0
    matched = 0
    run_id: str | None = None
    try:
        run_id = await start_ingestion_run(
            conn,
            source="congress_gov",
            congress=congress,
            pages=pages,
            limit=limit,
            min_score=min_score,
            keywords=keywords,
            input_file=input_file,
        )

        if input_file:
            payload = read_payload_from_file(input_file)
            bills = extract_bill_records(payload)
            for bill in bills:
                scanned += 1
                row = build_law_row(bill, congress, keywords)
                if not row or ai_match_score(str(row["title"]), str(row["summary"] or ""), keywords) < min_score:
                    continue
                matched += 1
                await upsert_law(conn, row)
                inserted_or_updated += 1
        else:
            for page in range(pages):
                offset = page * limit
                query = urlencode(
                    {
                        "api_key": api_key,
                        "format": "json",
                        "limit": limit,
                        "offset": offset,
                    }
                )
                url = f"{BASE_URL}/{congress}?{query}"
                payload = get_json(url)
                bills = extract_bill_records(payload)
                if not bills:
                    break

                for bill in bills:
                    scanned += 1
                    row = build_law_row(bill, congress, keywords)
                    if not row or ai_match_score(str(row["title"]), str(row["summary"] or ""), keywords) < min_score:
                        continue
                    matched += 1
                    await upsert_law(conn, row)
                    inserted_or_updated += 1

        await finish_ingestion_run(
            conn,
            run_id,
            status="SUCCESS",
            scanned=scanned,
            matched=matched,
            upserted=inserted_or_updated,
        )
    except Exception as exc:
        await finish_ingestion_run(
            conn,
            run_id,
            status="FAILED",
            scanned=scanned,
            matched=matched,
            upserted=inserted_or_updated,
            error_message=str(exc),
        )
        raise
    finally:
        await conn.close()

    return {
        "run_id": run_id,
        "scanned": scanned,
        "matched": matched,
        "upserted": inserted_or_updated,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Ingest AI-related laws from Congress.gov into Supabase.")
    parser.add_argument("--congress", type=int, default=118, help="Congress number to ingest (default: 118)")
    parser.add_argument("--pages", type=int, default=3, help="How many paginated API pages to fetch")
    parser.add_argument("--limit", type=int, default=50, help="Records per API request")
    parser.add_argument("--min-score", type=int, default=1, help="Minimum keyword match score")
    parser.add_argument(
        "--input-file",
        type=str,
        default="",
        help="Optional local JSON payload file for validation/backfill testing",
    )
    parser.add_argument(
        "--keywords",
        type=str,
        default=",".join(DEFAULT_KEYWORDS),
        help="Comma-separated AI keywords",
    )
    return parser


async def main() -> None:
    args = build_parser().parse_args()
    keywords = [item.strip().lower() for item in args.keywords.split(",") if item.strip()]
    stats = await ingest(
        congress=args.congress,
        pages=args.pages,
        limit=args.limit,
        min_score=args.min_score,
        keywords=keywords,
        input_file=args.input_file or None,
    )
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
