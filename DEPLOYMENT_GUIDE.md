# Deployment Guide

Complete guide for deploying the USDC Investment Platform to production.

## Pre-Deployment Checklist

- [ ] Database set up and accessible
- [ ] All environment variables configured
- [ ] Admin settings initialized
- [ ] Blockchain RPC provider configured (Alchemy/Infura)
- [ ] WalletConnect Project ID obtained
- [ ] Domain name configured (optional but recommended)
- [ ] Legal documents reviewed (Terms, Privacy Policy, Risk Disclosure)
- [ ] Security audit completed
- [ ] Test deposits on testnet

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Step 1: Prepare Repository

```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 3: Add Environment Variables

Add all variables from `.env.example` in Vercel dashboard:

```
DATABASE_URL=postgresql://...
ALCHEMY_API_KEY=...
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=42161
NEXT_PUBLIC_USDC_ADDRESS=0x...
NEXT_PUBLIC_OPERATOR_WALLET_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
JWT_SECRET=...
NEXTAUTH_SECRET=...
```

#### Step 4: Deploy

Click "Deploy" - Vercel will build and deploy your app.

#### Step 5: Run Database Migrations

After first deployment:

```bash
# Connect to production database
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Option 2: Railway

1. Create account on [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Railway will auto-deploy

### Option 3: Self-Hosted (VPS)

#### Requirements
- Ubuntu 22.04 or similar
- Node.js 18+
- PostgreSQL 14+
- Nginx (for reverse proxy)
- PM2 (process manager)

#### Setup

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Set up environment
cp .env.example .env
nano .env  # Edit with your values

# Build
npm run build

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start npm --name "usdc-investment" -- start
pm2 startup
pm2 save
```

## Database Setup

### PostgreSQL on Vercel

1. Add Vercel Postgres from Integrations
2. Copy connection string to `DATABASE_URL`
3. Run migrations

### Supabase (Alternative)

1. Create project on [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Update `DATABASE_URL`
4. Run migrations

### External PostgreSQL

Providers: AWS RDS, DigitalOcean, Render

1. Create PostgreSQL instance
2. Get connection string
3. Whitelist Vercel IPs if needed
4. Run migrations

## Blockchain Scanner Setup

The scanner MUST run continuously to detect deposits.

### Option 1: Vercel Cron Job

Create `/app/api/cron/scan/route.ts`:

```typescript
export const maxDuration = 60;

export async function GET() {
  // Run scanner logic
  return Response.json({ success: true });
}
```

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/scan",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### Option 2: Separate Service (Railway/Render)

Deploy scanner as separate service:

```bash
# In separate Railway/Render service
npm install
node src/scripts/scanner.js
```

### Option 3: PM2 on VPS

```bash
pm2 start src/scripts/scanner.ts --name "scanner" --interpreter ts-node
pm2 save
```

## Environment-Specific Configuration

### Development

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Domain & SSL

### With Vercel

1. Add domain in Vercel dashboard
2. Configure DNS:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
3. SSL auto-configured

### With Custom Server

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Post-Deployment Steps

### 1. Initialize Admin Settings

Access `/admin` and configure:
- Receiving wallet address
- USDC token address
- Minimum deposit
- Required confirmations
- NAV (start with 1.0)

### 2. Test Deposit Flow

1. Connect wallet on testnet
2. Make small test deposit
3. Verify transaction tracking
4. Check deposit appears in dashboard
5. Verify scanner detects it

### 3. Monitor Logs

```bash
# Vercel
vercel logs

# Railway
railway logs

# PM2
pm2 logs usdc-investment
pm2 logs scanner
```

### 4. Set Up Monitoring

Recommended services:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: APM
- **UptimeRobot**: Uptime monitoring

## Security Hardening

### 1. Environment Variables

- Use platform secrets (never hardcode)
- Rotate JWT secrets regularly
- Keep RPC API keys secure

### 2. Database

```sql
-- Create read-only user for analytics
CREATE USER analytics WITH PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics;
```

### 3. Rate Limiting

Add middleware or use Vercel's built-in:

```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit';
```

### 4. CORS

```typescript
// next.config.ts
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'yourdomain.com' },
    ],
  },
]
```

### 5. CSP Headers

```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline'"
}
```

## Backup Strategy

### Database Backups

```bash
# Automated daily backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240101.sql
```

### Code Backups

- Use Git with remote repository
- Tag releases: `git tag v1.0.0`
- Keep production branch separate

## Monitoring & Alerts

### Application Monitoring

```typescript
// Add to critical operations
try {
  // operation
} catch (error) {
  console.error('[CRITICAL]', error);
  // Send alert (email, Slack, etc.)
}
```

### Database Monitoring

- Monitor connection pool
- Track slow queries
- Alert on high load

### Blockchain Monitoring

- Scanner uptime
- Block sync status
- Failed transaction rate

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next
npm run build
```

### Database Connection

```bash
# Test connection
npx prisma db pull

# Reset (dev only!)
npx prisma migrate reset
```

### Scanner Not Running

```bash
# Check logs
pm2 logs scanner

# Restart
pm2 restart scanner
```

## Performance Optimization

### 1. Database Indexes

Already included in schema:
- User.walletAddress
- Deposit.txHash
- Transaction.userId

### 2. Caching

Add Redis for caching:
- User balances
- Platform settings
- Recent transactions

### 3. CDN

Use Vercel Edge Network or Cloudflare for static assets.

### 4. Image Optimization

```typescript
// next.config.ts
images: {
  domains: ['yourdomain.com'],
  formats: ['image/avif', 'image/webp'],
}
```

## Scaling Considerations

### Horizontal Scaling

- Multiple scanner instances
- Load balancer for API
- Database read replicas

### Vertical Scaling

- Upgrade database tier
- Increase function memory
- Add more workers

## Legal & Compliance

### Required Pages

Create these pages before launch:
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy
- `/risks` - Risk Disclosure

### KYC Integration

If required, integrate:
- Jumio
- Onfido
- Sumsub

### Compliance Monitoring

- Log all deposits
- Track user locations
- Monitor for suspicious activity
- Implement transaction limits

## Launch Checklist

- [ ] All tests passing
- [ ] Production environment configured
- [ ] Database backed up
- [ ] Scanner running
- [ ] Admin dashboard accessible
- [ ] Test deposit successful
- [ ] Legal pages published
- [ ] Monitoring enabled
- [ ] Alerts configured
- [ ] Domain SSL active
- [ ] Performance tested
- [ ] Security audit completed

## Support & Maintenance

### Daily Tasks
- Check scanner logs
- Monitor pending deposits
- Review error logs

### Weekly Tasks
- Backup database
- Update NAV
- Review user activity

### Monthly Tasks
- Security updates
- Performance optimization
- User feedback review

---

**Need help? Contact: devops@yourdomain.com**
