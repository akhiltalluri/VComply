"""
FastAPI entrypoint: mounts route modules and exposes the root ping.
Extend with middleware, CORS tightening, and auth when you graduate from MVP.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import applicability, auth, health, laws

app = FastAPI(title="VComply API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(auth.router)
app.include_router(applicability.router, prefix="/applicability", tags=["applicability"])
app.include_router(laws.router, prefix="/laws", tags=["laws"])


@app.get("/")
def root():
    """Root health-style message for quick sanity checks."""
    return {"message": "VComply API running"}
