# Fully Functional Guide – FuturesPilot

## Overview

FuturesPilot is intentionally lightweight. Everything runs in the browser, so you get instant feedback without managing infrastructure. Use this checklist to verify the major flows.

## 1. Dashboard Telemetry

- Funding radar data lives inside `dashboard/page.tsx`. Replace the mock array with your own feed.
- Market pulse + action queue are just arrays—map them to whatever narratives matter for your desk.

## 2. Strategy Studio

- `StrategyForm` builds new plans via `buildStrategyPlan()` and stores them in local storage.
- Status changes, deletions, and new entries all persist automatically via `persistStrategies()`.
- Want to sync to a backend? Swap the helper for `fetch('/api/strategies')` and wire it to your service.

## 3. Intelligence Board

- Funding vs. basis chart uses Recharts. Point it at a CSV, REST endpoint, or WebSocket when you’re ready.
- Positioning area chart follows the same pattern.

## 4. Deployment Ready

- No env vars, no secrets, no wallet deps.
- Default Vercel build command: `yarn build`.
- Static assets + client bundles only, so cold starts vanish.

## 5. Custom Ideas

- Add a “Research Inbox” panel powered by Notion/Slack exports.
- Pipe in CEX/DEX funding differentials via your analytics stack.
- Hook a lightweight auth layer (Clerk, Supabase, your own) if you need sharing.

Treat this repo as a canvas—extend it to match how your trading desk thinks.
