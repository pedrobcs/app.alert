# FuturesPilot Data & API Notes

FuturesPilot ships as a 100% client-side experience. There are **no serverless API routes or databases** in the default build—everything lives in browser `localStorage`. That makes it trivial to deploy to Vercel without environment variables or wallet integrations.

## Local Persistence

- Storage key: `futurespilot_strategies`
- Helper functions: see `src/lib/validation/strategy.ts`
- Data shape: `StrategyPlan` interface (title, market, direction, entry, risk, tags, status)

## Extending With Real APIs

Want multi-user sync or live market data? Add your own routes under `src/app/api` and replace the helper functions with fetch calls. A common pattern is:

1. Create a REST endpoint (`POST /api/strategies`) that writes to your DB.
2. Swap the local-storage helpers for `fetch` calls inside `StrategyForm` and the Strategy Studio page.
3. Use `SWR`/`React Query` or server actions to hydrate the dashboard.

Until you add those integrations, FuturesPilot remains a zero-config trader workspace suitable for demos, workshops, and internal ideation.
