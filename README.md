# VComply

Real-time AI compliance intelligence MVP: map your AI use cases and jurisdictions to applicable laws with a simple intake flow, dashboard, and API.

## Monorepo layout

| Path | Purpose |
|------|---------|
| `apps/web` | Next.js 15 frontend (intake, dashboard, laws) |
| `apps/api` | FastAPI backend (health, applicability checks, laws) |
| `packages/shared` | Shared types/constants (grow as needed) |
| `packages/law-seeds` | Seed data for regulations (JSON, etc.) |
| `docs` | Architecture and product notes |

## Quick start

**Web** — from `apps/web`: `npm install` then `npm run dev` (default [http://localhost:3000](http://localhost:3000)).

**API** — from `apps/api`: create a venv, `pip install -r requirements.txt`, then `uvicorn app.main:app --reload --port 8000` ([http://localhost:8000/docs](http://localhost:8000/docs)).

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `apps/web/.env.local` so the browser can call the API.

## License

See [LICENSE](LICENSE).

hello