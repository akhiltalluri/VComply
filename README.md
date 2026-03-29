# VComply

AI compliance workspace for turning AI system intake into a clear federal legislative risk report.

## Overview

VComply helps teams answer a practical question fast: what federal AI-related legislative records matter to the systems we already use, and what should we do next?

The product turns a short intake into a structured compliance report, keeps the latest assessment front and center, preserves report history, and lets teams review the underlying Congress.gov-backed law records without leaving the workspace.

## How It Works

1. Sign in or create an account
2. Start a new assessment from Intake
3. Generate a compliance report with computed risk
4. Review the active report in the dashboard
5. Revisit archived reports or explore the federal laws catalog

## Key Features

- Guided intake flow for company context, AI systems, and sensitive workflows
- Computed risk scoring instead of manual risk selection
- Dashboard built around one active assessment plus archived report history
- PDF and CSV export for the current report
- Federal laws explorer powered by Congress.gov-backed records
- Auth-gated workspace with demo-friendly local persistence

## Tech Stack

- Next.js, React, TypeScript, Tailwind CSS
- FastAPI
- Supabase Auth
- Congress.gov-backed federal legislative data

## Demo Access

Email: `demo@vcomply.ai`  
Password: `DemoAccess123!`

## Local Setup

```bash
npm install
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

Run the backend:

```bash
source .venv/bin/activate
PYTHONPATH=apps/api python3 -m uvicorn app.main:app --reload --port 8001
```

Run the frontend:

```bash
npm run dev
```

App: `http://localhost:8000`  
API: `http://127.0.0.1:8001`

## Notes

This is a hackathon build, so the goal is clarity and a strong product flow over heavy enterprise infrastructure. The foundation is there for deeper persistence, broader law coverage, and richer compliance workflows.
