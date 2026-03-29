import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"


def get_supabase_env() -> tuple[str | None, str | None]:
    load_dotenv(dotenv_path=ENV_PATH, override=False)
    return os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")


def get_supabase_client() -> Client:
    supabase_url, supabase_key = get_supabase_env()

    if not supabase_url:
        raise RuntimeError("SUPABASE_URL is not set")

    if not supabase_key:
        raise RuntimeError("SUPABASE_KEY is not set")

    return create_client(supabase_url, supabase_key)
