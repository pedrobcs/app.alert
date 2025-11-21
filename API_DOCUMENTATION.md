# API Documentation - ArbiBot Invest

Complete API reference for the USDC Investment SaaS platform.

## Base URL

```
Development: http://localhost:3000
Production: https://yourdomain.com
```

## Authentication

Most endpoints require authentication via JWT session cookies. The session cookie is set automatically after successful wallet authentication.

### Authentication Flow

1. Request a nonce
2. Sign the nonce with wallet
3. Verify signature to create session
4. Session cookie is automatically included in subsequent requests

---

## Public Endpoints

### Get Platform Settings

Get public platform configuration.

**Endpoint:** `GET /api/settings`

**Response:**
```json
{
  "operatorWallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "tokenAddress": "0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8",
  "tokenSymbol": "USDC",
  "minimumDeposit": 100,
  "requiredConfirmations": 5,
  "currentNAV": 1.0523,
  "totalAUM": 2500000,
  "enableKYC": false,
  "enableDeposits": true,
  "enableWithdrawals": false,
  "performanceYTD": 24.3
}
```

---

## Authentication Endpoints

### Request Nonce

Request a nonce for wallet signature authentication.

**Endpoint:** `POST /api/auth/nonce`

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "nonce": "abc123def456...",
  "message": "Sign this message to authenticate with ArbiBot:\n\nNonce: abc123def456...\nWallet: 0x742d35cc..."
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid wallet address
- `500` - Server error

---

### Verify Signature

Verify wallet signature and create session.

**Endpoint:** `POST /api/auth/verify`

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0xabc123...",
  "message": "Sign this message to authenticate..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clx123...",
    "walletAddress": "0x742d35cc...",
    "totalInvested": 1000,
    "isKycVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing fields
- `401` - Invalid signature
- `404` - User not found
- `500` - Server error

**Notes:**
- Session cookie is set automatically
- Token is also returned for manual cookie management

---

### Logout

End current session.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## User Endpoints

### Get User Profile

Get authenticated user's profile and stats.

**Endpoint:** `GET /api/user`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "user": {
    "id": "clx123...",
    "walletAddress": "0x742d35cc...",
    "email": null,
    "totalInvested": 1000,
    "totalShares": 950.23,
    "currentValue": 1052.3,
    "returns": 52.3,
    "returnsPercentage": 5.23,
    "isKycVerified": false,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "recentDeposits": [
    {
      "id": "dep123...",
      "amount": 500,
      "status": "CREDITED",
      "createdAt": "2024-01-15T10:30:00Z",
      "txHash": "0xabc..."
    }
  ],
  "settings": {
    "operatorWallet": "0x742d35Cc...",
    "tokenAddress": "0xFF970A61...",
    "tokenSymbol": "USDC",
    "minimumDeposit": 100,
    "currentNAV": 1.0523,
    "performanceYTD": 24.3
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

### Get User Deposits

Get all deposits for authenticated user.

**Endpoint:** `GET /api/deposits`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "deposits": [
    {
      "id": "dep123...",
      "txHash": "0xabc123...",
      "amount": 500,
      "status": "CREDITED",
      "confirmations": 10,
      "createdAt": "2024-01-15T10:30:00Z",
      "creditedAt": "2024-01-15T10:35:00Z",
      "shares": 475.11
    }
  ],
  "totalInvested": 1000,
  "totalShares": 950.23
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found
- `500` - Server error

---

## Deposit Endpoints

### Track Deposit

Submit and verify a USDC deposit transaction.

**Endpoint:** `POST /api/deposits/track`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**
```json
{
  "txHash": "0xabc123def456...",
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "success": true,
  "deposit": {
    "id": "dep123...",
    "amount": 500,
    "status": "CONFIRMED",
    "confirmations": 5,
    "txHash": "0xabc123..."
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid transaction or verification failed
- `401` - Unauthorized
- `404` - User not found
- `409` - Transaction already tracked
- `500` - Server error

**Notes:**
- Transaction is verified on-chain before being accepted
- Must be a USDC transfer to the operator wallet
- Minimum deposit amount is enforced
- Duplicate transactions are rejected

---

## Admin Endpoints

All admin endpoints require authentication with the admin wallet address.

### Get Admin Settings

Get all platform settings (admin only).

**Endpoint:** `GET /api/admin/settings`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "id": "settings123",
  "operatorWalletAddress": "0x742d35Cc...",
  "acceptedTokenAddress": "0xFF970A61...",
  "tokenSymbol": "USDC",
  "minimumDeposit": 100,
  "requiredConfirmations": 5,
  "currentNAV": 1.0523,
  "totalAUM": 2500000,
  "enableKYC": false,
  "enableDeposits": true,
  "enableWithdrawals": false,
  "performanceYTD": 24.3,
  "lastNAVUpdate": "2024-01-20T15:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-20T15:00:00Z"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not admin)
- `404` - Settings not found
- `500` - Server error

---

### Update Admin Settings

Update platform settings (admin only).

**Endpoint:** `POST /api/admin/settings`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

**Request Body:**
```json
{
  "operatorWalletAddress": "0x742d35Cc...",
  "acceptedTokenAddress": "0xFF970A61...",
  "tokenSymbol": "USDC",
  "minimumDeposit": 100,
  "requiredConfirmations": 5,
  "currentNAV": 1.0600,
  "totalAUM": 2600000,
  "enableKYC": false,
  "enableDeposits": true,
  "enableWithdrawals": false,
  "performanceYTD": 25.5
}
```

**Response:**
```json
{
  "id": "settings123",
  "operatorWalletAddress": "0x742d35Cc...",
  "currentNAV": 1.0600,
  "performanceYTD": 25.5,
  "updatedAt": "2024-01-21T10:00:00Z"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not admin)
- `500` - Server error

---

### Get All Deposits (Admin)

Get all deposits from all users (admin only).

**Endpoint:** `GET /api/admin/deposits`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "deposits": [
    {
      "id": "dep123...",
      "txHash": "0xabc123...",
      "amount": 500,
      "status": "CREDITED",
      "confirmations": 10,
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "walletAddress": "0x742d35cc...",
        "email": null
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not admin)
- `500` - Server error

---

### Get Platform Statistics

Get platform-wide statistics (admin only).

**Endpoint:** `GET /api/admin/stats`

**Headers:**
```
Cookie: session_token=eyJhbGciOiJIUzI1NiIs...
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalDeposits": 2500000,
  "pendingDeposits": 3,
  "depositCount": 450
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (not admin)
- `500` - Server error

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (not authenticated or not admin)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Rate Limiting

To prevent abuse, consider implementing rate limiting in production:

- Authentication endpoints: 5 requests per minute
- Deposit tracking: 10 requests per minute
- Read endpoints: 60 requests per minute

---

## Webhooks (Future Enhancement)

For real-time deposit notifications, implement webhooks:

```
POST /api/webhooks/deposit
{
  "event": "deposit.confirmed",
  "depositId": "dep123...",
  "userId": "user123...",
  "amount": 500,
  "txHash": "0xabc..."
}
```

---

## SDK / Client Libraries

Example JavaScript/TypeScript client:

```typescript
class ArbiBotClient {
  constructor(private baseUrl: string) {}

  async getNonce(walletAddress: string) {
    const res = await fetch(`${this.baseUrl}/api/auth/nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    });
    return res.json();
  }

  async verifySignature(walletAddress: string, signature: string, message: string) {
    const res = await fetch(`${this.baseUrl}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ walletAddress, signature, message }),
    });
    return res.json();
  }

  async getUserProfile() {
    const res = await fetch(`${this.baseUrl}/api/user`, {
      credentials: 'include',
    });
    return res.json();
  }

  async trackDeposit(txHash: string, userAddress: string) {
    const res = await fetch(`${this.baseUrl}/api/deposits/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ txHash, userAddress }),
    });
    return res.json();
  }
}
```

---

## Testing

### cURL Examples

**Get Settings:**
```bash
curl https://yourdomain.com/api/settings
```

**Request Nonce:**
```bash
curl -X POST https://yourdomain.com/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

**Get User Profile:**
```bash
curl https://yourdomain.com/api/user \
  -H "Cookie: session_token=eyJhbGciOiJIUzI1NiIs..."
```

**Track Deposit:**
```bash
curl -X POST https://yourdomain.com/api/deposits/track \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "txHash": "0xabc123...",
    "userAddress": "0x742d35Cc..."
  }'
```

---

## Support

For API support or questions:
- Email: api-support@arbibot.com
- Documentation: See README.md
- GitHub Issues: Report bugs

---

**API Version:** 1.0  
**Last Updated:** 2024-01-21
