# Project Overview – FuturesPilot

## Executive Summary

FuturesPilot is a client-side SaaS starter that helps discretionary crypto desks document trade ideas, monitor funding telemetry, and keep intelligence flows in one workspace—no wallets, servers, or databases required. Everything runs inside Next.js 15 with data persisted to the browser’s `localStorage`, making it ideal for rapid prototyping or internal research tooling.

## Feature Highlights

1. **Immersive Landing Page** – futures narrative, capability grid, CTA buttons, and a “How it works” walkthrough.
2. **Workspace Dashboard** – stat cards, funding radar table, market pulse narratives, action queue, and upcoming playbooks.
3. **Strategy Studio** – local-storage powered CRUD experience with conviction sliders, risk budgets, tags, and kanban-style grouping.
4. **Intelligence Board** – funding vs. basis dual-axis chart, positioning breakdown, and alert tape for qualitative insights.
5. **Research-only UX** – no wallet connection, no deposits, and no backend dependencies; perfect for mock trading or ideation sessions.

## Technology Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4, Framer Motion accents
- **Charts & Icons**: Recharts + Lucide
- **State/Persistence**: Browser `localStorage` helpers in `src/lib/validation/strategy.ts`
- **Notifications**: react-hot-toast

## Project Structure

```
/workspace
├── src/
│   ├── app/
│   │   ├── dashboard/         # Workspace home (funding radar + playbook reel)
│   │   ├── strategies/        # Strategy Studio (local storage CRUD)
│   │   ├── intelligence/      # Funding vs. basis visualizations
│   │   ├── layout.tsx         # Root layout + disclaimer modal
│   │   ├── page.tsx           # Marketing landing page
│   │   └── providers.tsx      # Toast provider
│   ├── components/
│   │   ├── StrategyForm.tsx   # Playbook composer
│   │   ├── StatCard.tsx       # Animated metrics card
│   │   ├── Navbar.tsx         # Rebranded navigation
│   │   └── DisclaimerModal.tsx
│   └── lib/
│       ├── validation/strategy.ts # Strategy types, seeds, and storage helpers
│       └── utils.ts                # Formatting helpers
├── public/                       # Static assets
├── README.md                     # Product documentation
└── ...
```

## Data & Persistence

Strategies are stored in local storage under `futurespilot_strategies`. The helper functions exported from `src/lib/validation/strategy.ts` provide:

- `loadStrategies()` – reads from storage or seeds demo data on first load.
- `persistStrategies(plans)` – saves the latest array.
- `buildStrategyPlan(partial)` – fabricates ids/timestamps for new ideas.

Because the project is client-only, you can deploy to Vercel without environment variables or Prisma migrations.

## Suggested Customizations

- Replace the seed strategies with real research from your desk.
- Extend the `StrategyPlan` interface with venue sizing, approvals, or checklists.
- Wire the funding radar/market pulse modules into your own data feeds (REST, GraphQL, or CSV exports) if you later add an API route.
- Swap the local-storage helpers for a backend when you’re ready for multi-user synchronization.

## Deployment Checklist

- [x] `yarn install`
- [x] `yarn build`
- [x] `vercel deploy`
- [x] Confirm local storage seeding works in production (private window test)

## Maintenance Tips

- Use the browser devtools “Application → Local Storage” tab to inspect or reset playbooks.
- Keep the seed strategies fresh so first-time visitors see relevant examples.
- When evolving into a full SaaS, reintroduce API routes and swap the persistence helpers for real services.

## Status

**✅ Feature Complete for the research-copilot scope.**

The project now focuses entirely on trader tooling—no wallet connections, no deposits, no database setup. Plug in your own data sources or keep it lightweight for workshops and ideation sprints.
