"""
FastAPI entrypoint: mounts route modules and exposes the root ping.
Extend with middleware, CORS tightening, and auth when you graduate from MVP.
"""
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.api.routes import applicability, auth, health, laws

app = FastAPI(title="VComply API", version="0.1.0")

frontend_url = os.getenv(
    "FRONTEND_APP_URL",
    "https://v-comply-web.vercel.app" if os.getenv("RENDER") else "http://localhost:8000",
).rstrip("/")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://v-comply-web.vercel.app",
]

if frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(auth.router)
app.include_router(applicability.router, prefix="/applicability", tags=["applicability"])
app.include_router(laws.router, prefix="/laws", tags=["laws"])


@app.get("/")
def root(request: Request):
    """Send browser traffic to the frontend while preserving an API-friendly ping."""
    accepts = request.headers.get("accept", "").lower()
    user_agent = request.headers.get("user-agent", "").lower()
    wants_html = "text/html" in accepts or "mozilla" in user_agent

    if wants_html:
        return RedirectResponse(url=frontend_url, status_code=307)

    return {
        "message": "VComply API running",
        "frontend_url": frontend_url,
        "health_url": "/health",
        "docs_url": "/docs",
    }
