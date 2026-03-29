# VComply

VComply is an AI compliance workspace for mapping deployed AI systems to applicable regulations, assessing regulatory exposure, and surfacing concrete remediation steps.

The current project includes:
- a polished Next.js frontend
- a FastAPI backend
- Supabase-backed authentication for login and signup
- a guided intake flow
- a mission-control dashboard
- a regulatory intelligence workspace

## What the product does

VComply helps a team answer three questions quickly:
- What AI regulations apply to our company?
- Why do they apply?
- What do we need to do next?

The product flow is:
- `Landing` → public product overview
- `Login / Signup` → workspace access
- `Intake` → guided assessment inputs
- `Dashboard` → risk, impacted regulations, and required actions
- `Laws Explorer` → deeper regulation-by-regulation analysis

## Current state of the project

### Frontend

The frontend lives in [`apps/web`](apps/web) and is built with:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

Current frontend behavior:
- the landing page is public
- core product features are gated behind sign-in
- `Start Assessment` sends signed-out users to `/login`
- authenticated users can access `/intake`, `/dashboard`, and `/laws`
- auth state is stored in `localStorage` for a demo-safe session flow

### Backend

The backend lives in [`apps/api`](apps/api) and is built with:
- FastAPI
- SQLAlchemy async
- Supabase Python client

Current backend behavior:
- `POST /auth/signup`
- `POST /auth/login`
- `POST /applicability/check`
- `GET /laws`
- `GET /`

Authentication uses Supabase Auth. Signup allows only company/work email domains and blocks common personal domains such as Gmail, Outlook, Yahoo, Hotmail, and iCloud.

## Monorepo layout

| Path | Purpose |
|------|---------|
| `apps/web` | Next.js frontend |
| `apps/api` | FastAPI backend |
| `packages/shared` | Shared package placeholder |
| `packages/law-seeds` | Seed/data placeholder |

## Demo access

### Public demo path

Anyone can:
- open the landing page
- review product messaging
- click through to login/signup

### Workspace access

To use the product itself, a user must sign in.

You currently have three practical demo paths:

1. Sign in with an existing workspace account  
   If a seeded demo account has already been created in Supabase for your environment, use that account on [`/login`](http://localhost:8000/login).

2. Create an account with a company email  
   Use [`/signup`](http://localhost:8000/signup) with a work email address. Personal domains are intentionally blocked.

3. Use the demo-safe assessment fallback  
   If assessment generation fails during the intake flow, the UI exposes `Open Demo Assessment`, which loads a realistic local demo workspace so the walkthrough can continue.

Important:
- live demo credentials are not stored in this repository
- if your team uses a seeded demo account, keep those credentials in a secure place outside the repo

## Local development

### 1. Install frontend dependencies

From the repo root:

```bash
npm install
```

### 2. Set up backend Python dependencies

From the repo root:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt
```

## Environment configuration

### Frontend

Copy the frontend example file if needed:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Current frontend env values:

```env
NEXT_PUBLIC_API_URL=/api
BACKEND_API_URL=http://localhost:8001
```

Why this matters:
- the frontend runs on port `8000`
- API calls stay same-origin through `/api`
- Next.js rewrites `/api/*` to the FastAPI backend on port `8001`

### Backend

Copy the backend example file if needed:

```bash
cp apps/api/.env.example apps/api/.env
```

Current backend auth env values:

```env
SUPABASE_URL=https://xluchlsmeoynorwpfbvy.supabase.co
SUPABASE_KEY=sb_publishable_Bg5WvTZjSaIQJz6SFQ0tBQ_N9CfwT0H
```

If you want assessment persistence to work through the database-backed applicability route, also provide:

```env
DATABASE_URL=postgresql+asyncpg://...
```

Note:
- the FastAPI app can boot without `DATABASE_URL`
- the applicability check route requires `DATABASE_URL` when used because it writes intake data to the database

## Running the app

### Start the backend

From the repo root:

```bash
source .venv/bin/activate
PYTHONPATH=apps/api python3 -m uvicorn app.main:app --reload --port 8001
```

Backend:
- API root: [http://localhost:8001](http://localhost:8001)
- docs: [http://localhost:8001/docs](http://localhost:8001/docs)

### Start the frontend

From the repo root:

```bash
npm run dev
```

Frontend:
- app: [http://localhost:8000](http://localhost:8000)

Root scripts:

```bash
npm run dev
npm run build
npm run lint
```

## Product walkthrough

### Landing page

Route:
- `/`

Purpose:
- public-facing product overview
- explains what VComply does
- gates product usage behind sign-in

### Login

Route:
- `/login`

Purpose:
- sign in an existing user through the backend auth route
- stores `session` and `user` in local storage after success
- redirects to `/dashboard`

### Signup

Route:
- `/signup`

Purpose:
- create a new workspace account using Supabase Auth
- only work/company emails are allowed
- personal email domains are rejected with a clean validation error

### Intake

Route:
- `/intake`

Purpose:
- guided multi-step assessment flow
- captures company footprint, AI use cases, risk context, and review inputs
- generates an assessment through the backend when available
- offers a demo-safe local fallback if generation fails

### Dashboard

Route:
- `/dashboard`

Purpose:
- shows regulatory risk level
- shows impacted regulations
- highlights required compliance actions
- explains why laws apply

### Laws Explorer

Route:
- `/laws`

Purpose:
- browse the regulation catalog
- filter by jurisdiction, risk, category, and enforcement stage
- inspect detail panels with rationale and required actions

## API surface

### Auth

- `POST /auth/signup`
- `POST /auth/login`

### Applicability

- `POST /applicability/check`

Example request body:

```json
{
  "states": ["NY", "CA"],
  "uses_hiring_ai": true
}
```

### Laws

- `GET /laws`

## Authentication notes

Frontend auth is intentionally lightweight for demo use:
- `session` is stored in `localStorage`
- `user` is stored in `localStorage`
- protected product pages check for a valid stored session
- logout clears stored auth state and returns the user to `/login`

This is enough for the current demo flow, but it is not a full production auth architecture yet.

## Troubleshooting

### Frontend route shows a white screen or runtime chunk error

If you see errors like:
- `Cannot find module './294.js'`
- `Cannot find module './611.js'`
- `Cannot read properties of undefined (reading 'call')`

clear the Next.js cache and restart the frontend:

```bash
rm -rf apps/web/.next
npm run dev
```

### Login or signup returns a proxy / unreadable response error

Make sure the backend is running on port `8001`:

```bash
PYTHONPATH=apps/api python3 -m uvicorn app.main:app --reload --port 8001
```

The frontend expects:

```env
BACKEND_API_URL=http://localhost:8001
```

### Signup fails with `422` or a work-email error

That usually means the submitted email was rejected by validation or the personal-domain restriction.

Examples of blocked domains:
- `gmail.com`
- `outlook.com`
- `yahoo.com`
- `hotmail.com`
- `icloud.com`
- `proton.me`

Use a company email address instead.

### Applicability check fails

If the backend assessment route is unavailable or the database is not configured, the intake flow can still continue through the built-in `Open Demo Assessment` fallback.

## Build verification

Frontend production build:

```bash
cd apps/web
npm run build
```

Backend import sanity check:

```bash
PYTHONPATH=apps/api python3 -c "from app.main import app; print(len(app.routes))"
```

## License

See [LICENSE](LICENSE).
