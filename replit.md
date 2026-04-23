# ResolveAI

## Overview

ResolveAI is an AI-powered Customer Complaint Resolution Agent. It uses intelligent analysis to classify complaints, assess sentiment, generate resolutions, and determine escalation needs — all in real-time through a polished operations dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: In-memory (no database needed)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Recharts

## Artifacts

- **ResolveAI Dashboard** (`artifacts/resolveai/`) — React frontend at `/`
- **API Server** (`artifacts/api-server/`) — Express backend at `/api`

## AI Engine Features

The AI complaint analysis engine (`artifacts/api-server/src/lib/resolveai-engine.ts`) implements:

1. **Complaint Classifier** — Keyword-based zero-shot classification into: billing, refund, technical, delivery, account, product_quality
2. **Sentiment Analyzer** — Returns: positive/neutral/negative + frustration score (0-100)
3. **Confidence Scoring** — `(classification_score * 0.5) + (policy_match_score * 0.3) + (history_factor * 0.2)`
4. **Escalation Engine** — Triggers on: frustration > 80, confidence < 0.60, policy conditions, or 2+ unresolved same-type tickets
5. **Resolution Generator** — Policy-based resolution templates personalized by customer tier

## API Endpoints

- `POST /api/analyze` — Analyze a complaint, returns full AI analysis result
- `GET /api/complaints` — List all session complaints
- `GET /api/customer/:id` — Get customer profile with history
- `GET /api/customers` — List all customers
- `POST /api/escalate` — Manually escalate a complaint
- `GET /api/dashboard/stats` — Aggregated dashboard statistics

## Customer Data

10 customer profiles in `artifacts/api-server/data/customers.json`:
- CUST001 (Rahul Sharma), CUST002 (Priya Nair), CUST003 (Karan Mehta), CUST004 (Ananya Reddy), CUST005 (Vikram Joshi) — Indian market customers
- CUST-001 (Sarah Mitchell), CUST-002 (Robert Kim), CUST-003 (Elena Rodriguez), CUST-004 (Marcus Johnson), CUST-005 (Jennifer Walsh), CUST-006 (David Chen) — Global customers

## Policies

6 complaint categories with SLA hours and escalation conditions in `artifacts/api-server/data/policies.json`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/resolveai run dev` — run frontend locally

## Ticket ID Format

`TKT-{timestamp}-{random4digits}` — e.g., `TKT-1776927111447-1410`
