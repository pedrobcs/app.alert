# FuturesPilot — Crypto Futures Intelligence Workspace

FuturesPilot is a full-stack Next.js SaaS application that gives discretionary crypto futures desks a research copilot. It keeps wallet-gated workspaces, funding analytics, reusable trade playbooks, and execution guardrails in one place without ever taking custody of funds or triggering live trades.

## ✨ What’s inside

- **Story-driven landing page** with RainbowKit wallet onboarding and risk disclaimers tailored for a research-only experience.
- **Wallet authentication** (MetaMask, WalletConnect) using signature challenges, JWT sessions, and Prisma-backed session storage.
- **Investor Workspace** dashboard that surfaces funding radar, market pulse narratives, action queues, and playbooks queued for activation.
- **Strategy Studio** for creating, editing, and tracking structured trade plans (narrative, entry math, invalidation, risk, tags) backed by the new `StrategyPlan` model.
- **Intelligence board** featuring funding vs. basis visualizations, positioning heatmaps, and narrative alerts (Recharts + motion components).
- **Admin-ready Prisma schema** (Users, Sessions, StrategyPlans, historic deposit tables) plus API routes for auth, settings, workspace analytics, and playbook CRUD operations.

> ⚠️ FuturesPilot is **research software only**. It does not execute trades or custody assets. Use it to organize ideas, funding context, and risk—not to move capital.

## 🧱 Tech stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4, custom glassmorphism utility classes, Framer Motion micro-interactions
- **Wallet UX**: wagmi 2.x, RainbowKit 2.x, viem
- **Data + API**: Prisma ORM (PostgreSQL), Next.js Route Handlers, Zod validation
- **Charts & UI**: Recharts, Lucide icons, react-hot-toast

## ⚙️ Setup

```bash
# Install dependencies
yarn install

# Generate Prisma client
yarn prisma:generate

# (Optional) apply migrations
yarn prisma:migrate

# Run dev server
yarn dev
```

Create `.env` from the template and set the basics:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/futurespilot
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=42161
ADMIN_WALLET_ADDRESS=0xYourAdminWallet
JWT_SECRET=super_secure_32_characters
OPERATOR_WALLET_ADDRESS=0xResearchMultisig (placeholder for future features)
```

> The legacy deposit settings remain in the schema for forward compatibility, but the UI exposes only research workflows.

## 🔐 Authentication flow

1. User connects a wallet via RainbowKit.
2. `/api/auth/nonce` returns a unique string + message mentioning FuturesPilot.
3. User signs the message; `/api/auth/verify` issues a JWT session cookie.
4. Session data is persisted in the `sessions` table; server routes use `getSession()`.

## 🧠 Core API routes

| Route | Method | Description |
| --- | --- | --- |
| `/api/workspace` | GET | Dashboard summary (strategy stats, funding radar, market pulse, action queue). |
| `/api/strategies` | GET | List strategy playbooks for the authenticated wallet. |
| `/api/strategies` | POST | Create a new strategy plan (validated via Zod). |
| `/api/strategies/:id` | PATCH | Update the status of an existing playbook (Draft → Ready → Live → Archived). |
| `/api/strategies/:id` | DELETE | Remove a playbook from the workspace. |
| `/api/auth/nonce` | POST | Request a signature challenge. |
| `/api/auth/verify` | POST | Verify signature + issue session cookie. |
| `/api/auth/logout` | POST | Destroy the session. |
| `/api/settings` | GET | Returns public platform settings (currently used for backwards compatibility). |

## 🗂️ Database highlights

- `User`: wallet-first identity, optional email/KYC scaffolding, historical totals (carry-over from earlier investment version).
- `Session`: JWT tokens + expiration metadata for server verification.
- `StrategyPlan` *(new)*: title, market, direction, narrative, entry, invalidation, target, conviction, risk (bps), tags, status.
- `AppSettings`, `Deposit`, `Withdrawal`, `AdminLog`: retained for future capital flows and auditing but dormant in the current UX.

## 📊 Feature walkthrough

### 1. Landing page & disclaimer
- Rebranded hero (“Command crypto futures with a copilot”).
- Capabilities grid covering Strategy Playbooks, Funding Radar, Scenario Matrix, etc.
- Updated disclaimer emphasising “research-only, no execution.”

### 2. Workspace dashboard
- Stat cards for live/ready strategies, average conviction, and risk per play.
- Funding radar table (per-venue funding outlooks) + Market Pulse narratives.
- Action queue derived from curated heuristics.
- “Upcoming playbooks” timeline synced with `/api/strategies` data.

### 3. Strategy Studio (`/strategies`)
- Kanban-style sections for Draft, Ready, Live, Archived.
- Status selector hooked to the new PATCH endpoint.
- Rich composer form with narrative, entry, invalidation, target, conviction slider, and tags.

### 4. Intelligence board (`/intelligence`)
- Funding vs. basis chart (dual-axis), positioning area chart, and alert tape of qualitative insights.
- Purely observational—no execution instructions emitted.

## 🚀 Suggested workflow

1. **Connect wallet** → unlock personal workspace.
2. **Capture idea** → fill StrategyForm with narrative + risk.
3. **Monitor dashboard** → watch funding radar & action queue.
4. **Promote status** → move playbook to Ready/Live when conditions align.
5. **Review intelligence board** → validate funding/basis context before executing off-platform.

## ✅ Testing checklist

- Wallet connect, nonce signing, and session issuance.
- Creating, listing, and updating strategy plans (CRUD endpoints).
- Dashboard rendering with zero plans (empty states) and multiple plans (cards, stats, funding table).
- Intelligence page chart rendering.
- Responsive layouts (mobile → desktop) across landing, dashboard, strategies, intelligence pages.

## 📄 Legal + safety reminder

FuturesPilot is provided “as is” for educational and operational research purposes. You are fully responsible for regulatory compliance, capital deployment, custody, and risk decisions executed outside this tool.

## 🙌 Credits

- Next.js & Vercel
- Prisma ORM
- RainbowKit + wagmi
- Recharts
- Tailwind CSS
- Framer Motion

---

Questions or ideas? Open an issue or extend the StrategyPlan model to suit your desk’s playbook workflow.
