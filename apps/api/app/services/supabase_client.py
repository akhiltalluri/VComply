import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

def get_supabase_client() -> Client:
    if not supabase_url:
        raise RuntimeError("SUPABASE_URL is not set")

    if not supabase_key:
        raise RuntimeError("SUPABASE_KEY is not set")

    return create_client(supabase_url, supabase_key)
