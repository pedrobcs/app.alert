# Project Overview – FuturesPilot

## Executive Summary

FuturesPilot is a production-ready Next.js SaaS application that helps discretionary crypto futures desks organize research, funding analytics, and trade playbooks without executing real trades. Wallet-gated workspaces consolidate strategy documentation, intelligence dashboards, and action queues so teams can move from idea to execution-ready states while keeping capital flows external.

## Feature Highlights

1. **Immersive Landing Page**
   - Futures-focused hero copy, capability grid, and story-driven stats
   - Wallet CTA + updated disclaimer emphasising “research only”
   - Animated gradients and motion-powered sections

2. **Wallet Authentication**
   - RainbowKit (MetaMask, WalletConnect)
   - Signature challenge mentioning FuturesPilot
   - JWT cookie sessions stored via Prisma

3. **Workspace Dashboard**
   - Stat cards (live/ready strategies, average conviction, risk per play)
   - Funding radar table, market pulse narratives, action queue
   - Upcoming playbooks timeline sourced from StrategyPlan data

4. **Strategy Studio**
   - Rich form for title, narrative, entry math, invalidation, targets, conviction slider, risk bps, tags
   - Kanban-style sections for Draft, Ready, Live, Archived with status selector
   - Backed by new `/api/strategies` CRUD endpoints

5. **Intelligence Board**
   - Funding vs. basis dual-axis chart
   - Positioning (long vs. short) area chart
   - Alert tape of qualitative insights

6. **Legal & Safety**
   - Research-only disclaimer modal
   - No custody, no execution, no automated trading

## Technology Stack

### Frontend
- Next.js 15 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 with custom glass morph styles
- Framer Motion for micro-interactions
- Recharts for funding/positioning visualizations

### Wallet & Data
- wagmi 2.x + RainbowKit 2.1 for wallet UX
- viem/ethers scaffolding (legacy deposit flow still available but hidden)
- Prisma ORM (PostgreSQL)
- Zod validation

### Backend
- Next.js Route Handlers (`/api/*`)
- JWT auth with `jose`
- Cookie-based session management

### DevOps
- Works seamlessly on Vercel + hosted Postgres (Vercel Postgres, Supabase, Neon, Railway)
- WalletConnect Cloud project ID for production wallets

## Project Structure

```
/workspace
├── prisma/
│   └── schema.prisma          # Users, Sessions, StrategyPlans, legacy deposit tables
├── src/
│   ├── app/
│   │   ├── api/               # Auth, settings, strategies, workspace
│   │   ├── dashboard/         # Workspace home
│   │   ├── strategies/        # Strategy Studio (new)
│   │   ├── intelligence/      # Intelligence board (new)
│   │   ├── layout.tsx         # Providers + disclaimer
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── StrategyForm.tsx   # Strategy composer
│   │   ├── StatCard.tsx       # Animated stat cards
│   │   ├── Navbar.tsx         # Rebranded navigation
│   │   └── DisclaimerModal.tsx
│   └── lib/
│       ├── validation/strategy.ts # Zod schemas + shared enums
│       ├── auth.ts
│       ├── prisma.ts
│       ├── config.ts
│       └── wagmi.ts
├── README.md
├── PROJECT_OVERVIEW.md (this file)
└── ...
```

## Database Schema Snapshot

| Table | Purpose |
| --- | --- |
| `users` | Wallet-first identity, optional KYC fields, historical totals (from legacy deposit era). |
| `sessions` | JWT tokens with expiry for server-side auth. |
| `strategy_plans` *(new)* | Structured playbooks: market, direction, narrative, entry, invalidation, targets, conviction, risk (bps), tags, status. |
| `app_settings`, `deposits`, `withdrawals`, `admin_logs` | Retained for future capital flows; not exposed in the current UI. |

## API Surface

- `POST /api/auth/nonce`, `POST /api/auth/verify`, `POST /api/auth/logout`
- `GET /api/workspace` – dashboard summary data
- `GET /api/strategies` – list playbooks
- `POST /api/strategies` – create playbook (validated with Zod)
- `PATCH /api/strategies/:id` – update status (Draft/Ready/Live/Archived)
- `DELETE /api/strategies/:id` – delete playbook
- `GET /api/settings` – legacy settings (still available for backwards compatibility)

## User Journey (Desk Lead)

1. **Connect wallet** to unlock a private workspace.
2. **Capture idea** via Strategy Studio (define narrative, entry math, invalidation, tags).
3. **Monitor dashboard** for funding radar + action queue nudges.
4. **Promote status** when conditions are satisfied (Draft → Ready → Live).
5. **Review intelligence** charts before sending real orders through external OMS/HF infrastructure.

## Security & Compliance Considerations

- Wallet signature authentication + JWT sessions
- Research-only workflows (no token transfers, no custodial logic)
- Prisma parameterization prevents SQL injection
- Legacy deposit verification code remains isolated for future use but is not referenced in the UI

## Deployment Checklist

- [ ] Populate `.env` with DB URL, WalletConnect Project ID, admin wallet, JWT secret
- [ ] Run `yarn prisma:generate` (and migrations if needed)
- [ ] Verify RainbowKit project configuration for production origin
- [ ] Configure Vercel/Supabase/Neon Postgres
- [ ] Double-check disclaimer + support contact info

## Maintenance Notes

- Refresh funding/insight mock data or wire to your internal data pipeline
- Expand `StrategyPlan` model with PnL targets, execution venues, or approvals as needed
- Leverage legacy deposit tables if you later add capital coordination modules

## Future Enhancements

- Live data ingestion for funding curves and positioning (WebSockets, Kafka, etc.)
- Role-based workspaces (research vs. execution vs. compliance)
- Notification system (email/Telegram/Slack) for upcoming playbooks
- Rich commenting + collaborative annotations within Strategy Studio
- Optional integration with OMS/EMS for read-only status sync

---

Project status: **✅ Feature Complete** for the research-copilot scope. Ready for customization, data wiring, and deployment to Vercel or any Node 18+ environment.
