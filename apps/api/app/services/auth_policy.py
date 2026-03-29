from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

BLOCKED_EMAIL_DOMAINS = frozenset(
    {
        "aol.com",
        "gmail.com",
        "gmx.com",
        "hotmail.com",
        "icloud.com",
        "live.com",
        "mail.com",
        "me.com",
        "msn.com",
        "outlook.com",
        "proton.me",
        "protonmail.com",
        "yahoo.com",
        "ymail.com",
    }
)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def extract_email_domain(email: str) -> str | None:
    normalized = normalize_email(email)
    local_part, separator, domain = normalized.partition("@")
    if not separator or not local_part or not domain:
        return None

    return domain


def uses_blocked_email_domain(email: str) -> bool:
    domain = extract_email_domain(email)
    return bool(domain and domain in BLOCKED_EMAIL_DOMAINS)


@lru_cache(maxsize=1)
def get_reserved_demo_emails() -> frozenset[str]:
    raw_value = os.getenv("DEMO_ACCOUNT_EMAILS", "")
    emails = {
        normalize_email(item)
        for item in raw_value.split(",")
        if item and item.strip()
    }
    return frozenset(emails)


def is_reserved_demo_email(email: str) -> bool:
    return normalize_email(email) in get_reserved_demo_emails()
