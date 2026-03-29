# VComply

Federal AI compliance workspace for turning company AI usage into a clear risk report and action plan.

## Overview

VComply helps teams understand which federal AI-related legislative records matter to their systems, why they matter, and what to do next.

Instead of forcing teams to manually read policy updates, VComply turns a guided intake into a structured compliance workflow with risk scoring, report history, supporting law records, and exportable outputs.

## Product Flow

1. Create an account or sign in
2. Start an assessment
3. Generate a compliance report
4. Review the dashboard and current risk level
5. Revisit archived reports
6. Explore the federal laws library
7. Export the report as PDF or CSV

## Key Features

- Work-email-only signup with common free-email providers blocked
- Demo account access for quick testing
- Federal-law-based compliance workflow powered by Congress.gov-backed records
- Computed risk assessment from intake inputs
- Dashboard with current report plus archived history
- PDF and CSV export for reports
- Deployed frontend and backend

## Live App

- Frontend: https://v-comply-web.vercel.app/
- Backend: https://vcomply.onrender.com

## Demo Access

Email: `demo@vcomply.ai`  
Password: `DemoAccess123!`

## Tech Stack

- Next.js
- FastAPI
- Supabase
- Vercel
- Render

## Local Setup

```bash
npm install
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

```bash
PYTHONPATH=apps/api python3 -m uvicorn app.main:app --reload --port 8001
npm run dev
```

Frontend runs on `http://localhost:8000`  
Backend runs on `http://localhost:8001`

## Notes

VComply was built as a hackathon-ready product: focused, demoable, and grounded in real federal legislative source data. The next step is broader coverage, deeper persistence, and richer reporting workflows.
