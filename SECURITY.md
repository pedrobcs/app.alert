# Security Best Practices

## 🚨 Critical Security Rules

### 1. Private Key Management

**NEVER:**
- Commit private keys to source control
- Store private keys in plaintext
- Share private keys via email/chat
- Use mainnet keys for testing
- Store keys in browser localStorage

**ALWAYS:**
- Use environment variables for development
- Use KMS/Vault for production
- Encrypt keys at rest
- Rotate keys regularly
- Use hardware wallets when possible

### 2. Production Key Storage

#### AWS KMS (Recommended)

```typescript
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';

async function getPrivateKey() {
  const client = new KMSClient({ region: 'us-east-1' });
  const command = new DecryptCommand({
    CiphertextBlob: Buffer.from(process.env.ENCRYPTED_KEY!, 'base64'),
    KeyId: process.env.KMS_KEY_ID!,
  });
  const response = await client.send(command);
  return response.Plaintext;
}
```

#### HashiCorp Vault

```typescript
import * as vault from 'node-vault';

async function getPrivateKey() {
  const client = vault({
    endpoint: process.env.VAULT_ADDR,
    token: process.env.VAULT_TOKEN,
  });
  const secret = await client.read('secret/drift-bot/keeper-key');
  return secret.data.privateKey;
}
```

### 3. RPC Security

**Use Private RPC Endpoints:**
- Avoid public RPCs in production
- Use Alchemy, QuickNode, or Helius
- Implement rate limiting
- Monitor RPC usage and costs

```typescript
// ✅ Good: Private RPC with auth
const connection = new Connection(
  process.env.RPC_URL!, 
  {
    commitment: 'confirmed',
    httpHeaders: {
      'Authorization': `Bearer ${process.env.RPC_API_KEY}`
    }
  }
);

// ❌ Bad: Public RPC
const connection = new Connection('https://api.mainnet-beta.solana.com');
```

### 4. API Security

**Implement Authentication:**

```typescript
// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

export function authenticateRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

**Rate Limiting:**

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export default limiter;
```

### 5. Database Security

**Encrypt Sensitive Data:**

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, 'salt', 32);

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decrypt(text: string): string {
  const [ivHex, authTagHex, encrypted] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 6. Transaction Security

**Implement Transaction Limits:**

```typescript
const MAX_POSITION_SIZE = 1000; // USDC
const MAX_DAILY_TRADES = 50;
const MAX_DAILY_LOSS = 100; // USDC

function validateTrade(trade: TradeInstruction, stats: DailyStats) {
  if (trade.size > MAX_POSITION_SIZE) {
    throw new Error('Position size exceeds limit');
  }
  
  if (stats.tradesCount >= MAX_DAILY_TRADES) {
    throw new Error('Daily trade limit reached');
  }
  
  if (stats.dailyLoss >= MAX_DAILY_LOSS) {
    throw new Error('Daily loss limit reached');
  }
}
```

**Simulate Before Executing:**

```typescript
async function executeTradeWithSimulation(instruction: TradeInstruction) {
  // Simulate first
  const simulation = await connection.simulateTransaction(transaction);
  
  if (simulation.value.err) {
    throw new Error(`Simulation failed: ${simulation.value.err}`);
  }
  
  // Check for unexpected account changes
  validateSimulationResult(simulation);
  
  // Execute
  const signature = await connection.sendTransaction(transaction);
  return signature;
}
```

### 7. Monitoring & Alerts

**Set Up Alerts:**

```typescript
import { AlertService } from './alerts';

async function monitorBot(botId: string) {
  const status = await getBotStatus(botId);
  
  // Alert on errors
  if (status.errorCount > 3) {
    await AlertService.send({
      level: 'critical',
      message: `Bot ${botId} has ${status.errorCount} consecutive errors`,
    });
  }
  
  // Alert on large losses
  if (status.dailyPnl < -100) {
    await AlertService.send({
      level: 'warning',
      message: `Bot ${botId} daily loss: $${status.dailyPnl}`,
    });
  }
  
  // Alert on unusual activity
  if (status.tradesLastHour > 20) {
    await AlertService.send({
      level: 'info',
      message: `Bot ${botId} unusual activity: ${status.tradesLastHour} trades/hour`,
    });
  }
}
```

### 8. Incident Response

**Emergency Stop Mechanism:**

```typescript
// Emergency stop endpoint (protected)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify emergency admin credentials
  if (!verifyEmergencyAuth(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Stop all bots
  const bots = await prisma.bot.findMany({ where: { status: 'running' } });
  
  for (const bot of bots) {
    await stopKeeper(bot.id);
    await prisma.bot.update({
      where: { id: bot.id },
      data: { status: 'stopped', errorMessage: 'Emergency stop triggered' }
    });
  }
  
  // Close all positions (if needed)
  // await closeAllPositions();
  
  return res.json({ stopped: bots.length });
}
```

### 9. Audit Logging

**Log All Critical Actions:**

```typescript
interface AuditLog {
  timestamp: Date;
  action: string;
  userId: string;
  botId?: string;
  details: any;
  ipAddress: string;
}

async function logAudit(log: AuditLog) {
  await prisma.auditLog.create({ data: log });
  
  // Also send to external logging service
  await loggingService.log(log);
}

// Usage
await logAudit({
  timestamp: new Date(),
  action: 'BOT_STARTED',
  userId: user.id,
  botId: bot.id,
  details: { mode: bot.mode, market: bot.market },
  ipAddress: req.socket.remoteAddress,
});
```

### 10. Regular Security Audits

**Checklist:**

- [ ] Review all API endpoints for authorization
- [ ] Check for exposed environment variables
- [ ] Audit database access patterns
- [ ] Review transaction signing logic
- [ ] Test emergency stop procedures
- [ ] Validate RPC endpoint security
- [ ] Check dependency vulnerabilities (`npm audit`)
- [ ] Review logs for suspicious activity
- [ ] Test backup/recovery procedures
- [ ] Update dependencies regularly

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Solana Security Best Practices](https://docs.solana.com/developing/programming-model/security)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Web3 Security Guide](https://github.com/crytic/building-secure-contracts)

## Reporting Security Issues

If you discover a security vulnerability, please email [your-email] instead of opening a public issue.

---

**Remember: Security is an ongoing process, not a one-time setup!**
