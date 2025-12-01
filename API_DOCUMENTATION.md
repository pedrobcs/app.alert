# API Documentation – FuturesPilot

Authoritative reference for the FuturesPilot research workspace. All authenticated routes require the wallet-signature session cookie.

## Base URLs

```
Development: http://localhost:3000
Production: https://your-deployment.com
```

## Authentication Flow

1. `POST /api/auth/nonce` with the wallet address
2. User signs the returned message in their wallet
3. `POST /api/auth/verify` with wallet, signature, and message
4. Server stores a session in Prisma and sets the `session_token` cookie

### Request Nonce

`POST /api/auth/nonce`

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

```json
{
  "nonce": "3ab7ae91...",
  "message": "Sign this message to access your FuturesPilot workspace.\n\nNonce: 3ab7ae91...\nWallet: 0x742d35cc..."
}
```

### Verify Signature

`POST /api/auth/verify`

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0xabc123...",
  "message": "Sign this message to access your FuturesPilot workspace..."
}
```

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Logout

`POST /api/auth/logout`

Clears the session both in Prisma and via httpOnly cookie removal.

---

## Workspace & Intelligence

### Get Workspace Snapshot

`GET /api/workspace`

Returns the dashboard payload used on `/dashboard`.

```json
{
  "profile": {
    "walletAddress": "0x742d35cc...",
    "onboardedAt": "2025-01-01T10:00:00.000Z",
    "totalPlans": 4
  },
  "strategySummary": {
    "livePlans": 1,
    "readyPlans": 2,
    "drafts": 1,
    "avgConviction": "3.5",
    "avgRiskBps": 60,
    "activeMarkets": 3
  },
  "upcoming": [ { "id": "plan_123", "title": "BTC sweep" } ],
  "fundingRadar": [ { "pair": "BTC-PERP", "venue": "Binance", "fundingBps": -6.2 } ],
  "marketPulse": [ { "title": "Open interest expansion", "change": "+8.3%" } ],
  "actionItems": [ { "label": "Journal update", "description": "Document ETH shift" } ],
  "lastUpdated": "2025-01-21T08:15:00.000Z"
}
```

Status codes: `200`, `401`, `404`, `500`.

---

## Strategy Playbooks

All strategy routes require an authenticated session.

### List Strategies

`GET /api/strategies`

```json
{
  "plans": [
    {
      "id": "plan_123",
      "title": "BTC Asia open long",
      "market": "BTC",
      "direction": "LONG",
      "timeframe": "1D",
      "narrative": "Funding has stayed negative...",
      "entryPlan": "Scale between 63.1k-62.6k",
      "invalidation": "Funding flips positive + lose 61.8k",
      "targetPlan": "First TP 65.4k, trail above 66k",
      "conviction": 4,
      "riskBps": 50,
      "status": "READY",
      "tags": ["funding", "breakout"],
      "createdAt": "2025-01-21T06:00:00.000Z"
    }
  ],
  "summary": {
    "total": 3,
    "statusCounts": { "READY": 2, "LIVE": 1, "DRAFT": 0, "ARCHIVED": 0 },
    "avgRiskBps": 42,
    "avgConviction": "3.7",
    "activeMarkets": 2,
    "nextUp": [ { "id": "plan_123", "title": "BTC Asia open long" } ]
  }
}
```

### Create Strategy

`POST /api/strategies`

```json
{
  "title": "ETH mean reversion short",
  "market": "ETH",
  "direction": "SHORT",
  "timeframe": "4H",
  "narrative": "Funding flipped positive while basis keeps compressing...",
  "entryPlan": "Size in between 3.1k-3.15k",
  "invalidation": "Close above 3.22k + funding > 8bps",
  "targetPlan": "Cover at 2.95k then trail",
  "conviction": 3,
  "riskBps": 40,
  "tags": ["funding", "mean-reversion"]
}
```

Returns `201` with `{ "plan": { ... } }` on success. Validation errors return `400` with Zod details.

### Update Status

`PATCH /api/strategies/:id`

```json
{
  "status": "LIVE"
}
```

Returns the updated plan. Status values: `DRAFT`, `READY`, `LIVE`, `ARCHIVED`.

### Delete Strategy

`DELETE /api/strategies/:id`

Removes a playbook. Returns `{ "success": true }` on success.

---

## Settings (Legacy)

`GET /api/settings` still returns operator/token config from the original investment product. Useful if you plan to re-enable capital flows; otherwise safe to ignore.

---

## Client Helper Example

```ts
class FuturesPilotClient {
  constructor(private baseUrl: string) {}

  async requestNonce(walletAddress: string) {
    return fetch(`${this.baseUrl}/api/auth/nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    }).then((res) => res.json());
  }

  async verifySignature(payload: { walletAddress: string; signature: string; message: string }) {
    return fetch(`${this.baseUrl}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }

  async getWorkspace() {
    return fetch(`${this.baseUrl}/api/workspace`, {
      credentials: 'include',
    }).then((res) => res.json());
  }

  async createStrategy(plan: Record<string, unknown>) {
    return fetch(`${this.baseUrl}/api/strategies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(plan),
    }).then((res) => res.json());
  }
}
```

---

## Error Format

All errors follow:

```json
{ "error": "Description" }
```

Common status codes: `200`, `201`, `400`, `401`, `404`, `409`, `500`.

## Support

- Email: support@futurespilot.app (example)
- Issues: submit via repository issues tab

_Last updated: 2025-01-21_
