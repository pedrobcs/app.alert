# 🚀 START HERE – FuturesPilot

A quick orientation for the lightweight trader workspace.

## 1. Install & Run

```bash
yarn install
yarn dev
```

Open http://localhost:3000 to explore the marketing site. Jump straight to `/dashboard` for the live cockpit.

## 2. Explore the Modules

- **Dashboard** – funding radar, market pulse, action queue, and upcoming playbooks.
- **Strategy Studio** – capture ideas, adjust statuses, and store everything in local storage.
- **Intelligence Board** – visualize funding vs. basis trends and positioning shifts.

## 3. Customize Seed Data

Edit `seedStrategies` inside `src/lib/validation/strategy.ts` to preload your own research backlog. Every browser session uses `localStorage`, so clearing it resets the demo state.

## 4. Extend When Ready

Need authentication or multi-user sync? Add API routes under `src/app/api` and swap the storage helpers for real fetch calls. Until then, FuturesPilot stays wallet-free, database-free, and deployable in minutes.
