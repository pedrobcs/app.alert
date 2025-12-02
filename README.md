# FuturesPilot — Trader Intelligence Workspace

FuturesPilot is a Next.js SaaS starter that helps discretionary crypto traders turn loose research into structured, repeatable playbooks. It ships with a landing page, an interactive dashboard, a strategy studio, and an intelligence board—all running entirely on the client, so there’s no wallet connection, database, or secret management to worry about.

## ✨ Highlights

- **Story-driven marketing site** with hero animations, capability grid, and “how it works” narrative tuned for trading desks.
- **Workspace dashboard** featuring funding radar, market pulse cards, action queues, and quick links to the playbook studio.
- **Strategy Studio** that lets you capture ideas (entry, invalidation, targets, risk) and manage them across Draft → Ready → Live → Archived stages using local storage.
- **Intelligence board** with funding vs. basis charts, positioning heatmaps, and narrative alerts powered by Recharts + Framer Motion.
- **Offline-first architecture** – everything is persisted in `localStorage`, so Vercel deployments are zero-config and traders can experiment without signing messages or wiring funds.

## 🧱 Tech Stack

- **Runtime**: Next.js 15 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + custom glassmorphism utilities
- **Animation & Charts**: Framer Motion, Recharts, Lucide icons
- **Notifications**: react-hot-toast for lightweight UX feedback

## ⚙️ Setup

```bash
# Install dependencies
yarn install

# Start the workspace in dev mode
yarn dev

# Build for production
yarn build && yarn start
```

No database, migrations, or secrets are required. All playbooks are saved inside the browser under the `futurespilot_strategies` key. Deleting local storage resets the demo data.

## 📋 Workspace Overview

| Area | Description |
| --- | --- |
| Landing page | Explains the copilot story, showcases capabilities, and funnels users into `/dashboard`. |
| `/dashboard` | Displays stat cards, funding radar table, market pulse narratives, action queue, and a highlight reel of upcoming playbooks. |
| `/strategies` | Full Strategy Studio with kanban-like grouping, status selector, inline delete, and a rich composer form. Data auto-syncs via `localStorage`. |
| `/intelligence` | Visualization board for funding vs. basis trends, positioning balance, and narrative alerts. |

## 🧠 Data Model

Strategies are stored locally with the following shape:

```ts
export interface StrategyPlan {
  id: string;
  title: string;
  market: string;
  direction: 'LONG' | 'SHORT' | 'NEUTRAL';
  timeframe: string;
  narrative: string;
  entryPlan: string;
  invalidation: string;
  targetPlan: string;
  conviction: number; // 1-5
  riskBps: number;    // desk-specific risk budget
  status: 'DRAFT' | 'READY' | 'LIVE' | 'ARCHIVED';
  tags: string[];
  createdAt: string;
}
```

Helpers in `src/lib/validation/strategy.ts` take care of bootstrapping seeds, loading from storage, and persisting updates.

## 🧭 Suggested Workflow

1. **Launch workspace** – land on `/dashboard` to review funding radar and market pulse.
2. **Capture idea** – open `/strategies`, document the narrative, and tag risk parameters.
3. **Promote status** – move a playbook to Ready/Live as conditions line up.
4. **Monitor intelligence** – keep the `/intelligence` board pinned for funding vs. basis context.
5. **Iterate** – archive completed plays and clone what worked using the Strategy Studio.

## 🧰 Customize It

- Swap out the seed strategies in `src/lib/validation/strategy.ts` with your own research backlog.
- Extend the `StrategyPlan` type to include venue-specific sizing, checklist confirmations, or PnL targets.
- Replace the local-storage store with an API or database if you need multi-user sync (the UI already handles optimistic updates).
- Inject real analytics into the funding radar and positioning charts by pulling from your data warehouse.

## 🛡️ Safety & Legal

FuturesPilot is research software only. It never connects to wallets, moves capital, or executes trades. Make sure your team complies with relevant regulations, handles personal data responsibly, and keeps proprietary research encrypted if you later add a backend.

## 📄 Documentation

- `PROJECT_OVERVIEW.md` – architectural summary and file tree.
- `API_DOCUMENTATION.md` – explains that data is stored locally and outlines how to extend the project with custom endpoints if desired.
- `START_HERE.md`, `INSTALLATION_SUMMARY.md`, `SETUP_COMPLETE.md` – quick reference guides for onboarding teammates.

## 🤝 Contributing

1. Fork the repo & `yarn install`
2. Make your changes (UI tweaks, new analytics modules, etc.)
3. Run `yarn lint && yarn build`
4. Open a pull request

---

Built for teams who want to explore trade ideas faster, without tying the experience to wallets or on-chain flows. Plug in your data sources, remix the UI, and ship a trader-facing copilot in hours instead of weeks.
