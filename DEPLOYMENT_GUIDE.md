# Deployment Guide - ArbiBot Invest

Complete guide for deploying the USDC Investment SaaS to production.

## Pre-Deployment Checklist

### 1. Security Review
- [ ] All environment variables use strong, unique values
- [ ] Private keys are NOT in code or environment variables
- [ ] Admin wallet address is set correctly
- [ ] JWT secret is at least 32 characters
- [ ] Database uses secure credentials
- [ ] HTTPS is enforced on production domain

### 2. Configuration
- [ ] `.env` file created with all required variables
- [ ] Database connection string is for production database
- [ ] Alchemy/Infura API key is for production
- [ ] WalletConnect Project ID is configured
- [ ] Operator wallet address is set and secure
- [ ] Minimum deposit amount is configured
- [ ] Confirmation requirements are set (recommended: 5)

### 3. Database
- [ ] PostgreSQL database provisioned
- [ ] Database is accessible from hosting platform
- [ ] Prisma schema is up to date
- [ ] Migrations are ready to run

### 4. Testing
- [ ] All features tested on testnet
- [ ] Wallet connection works
- [ ] Deposits are tracked correctly
- [ ] Admin panel is accessible
- [ ] Legal disclaimers display properly

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Step 1: Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: USDC Investment SaaS"

# Create a repository on GitHub and push
git remote add origin https://github.com/yourusername/arbibot-invest.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `yarn build`
   - **Output Directory**: .next

#### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://...
ALCHEMY_API_KEY=your_key
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=42161
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_USDC_ADDRESS=0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8
ADMIN_WALLET_ADDRESS=0x...
OPERATOR_WALLET_ADDRESS=0x...
JWT_SECRET=your_secret_key_min_32_chars
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com
MINIMUM_DEPOSIT_USDC=100
REQUIRED_CONFIRMATIONS=5
```

#### Step 4: Set Up Database

**Option A: Vercel Postgres**
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel postgres create

# Run migrations
vercel env pull .env.local
yarn prisma:generate
yarn prisma:migrate deploy
```

**Option B: External Database (Supabase, Railway, etc.)**
1. Create database on your provider
2. Get connection string
3. Add as `DATABASE_URL` in Vercel
4. Run migrations locally or via CI/CD

#### Step 5: Deploy

```bash
# Trigger deployment
git push origin main

# Or manual deployment
vercel --prod
```

#### Step 6: Configure Domain

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your domain

### Option 2: Railway

Railway provides easy deployment with integrated PostgreSQL.

#### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add PostgreSQL database plugin
4. Configure environment variables (same as Vercel)
5. Deploy

### Option 3: Self-Hosted (VPS/AWS/DigitalOcean)

#### Requirements
- Node.js 18+ installed
- PostgreSQL database
- Nginx or Apache web server
- SSL certificate (Let's Encrypt)
- PM2 or similar process manager

#### Deployment Steps

```bash
# On your server
git clone https://github.com/yourusername/arbibot-invest.git
cd arbibot-invest

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
nano .env  # Edit with your values

# Generate Prisma client
yarn prisma:generate

# Run migrations
yarn prisma:migrate deploy

# Build application
yarn build

# Start with PM2
pm2 start yarn --name "arbibot" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Visit your domain
- [ ] Landing page loads correctly
- [ ] Connect wallet works
- [ ] Dashboard accessible after connecting
- [ ] Admin panel works (connect with admin wallet)

### 2. Configure Admin Settings

1. Connect with admin wallet
2. Go to `/admin`
3. Set:
   - Operator wallet address
   - Token address
   - Minimum deposit
   - Required confirmations
   - Initial NAV (usually 1.0)
   - Performance metrics

### 3. Test Deposit Flow

1. Make a small test deposit (with real wallet)
2. Verify transaction is tracked
3. Check that deposit appears in dashboard
4. Confirm deposit is credited after confirmations

### 4. Set Up Monitoring

#### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor performance and errors

#### Database Monitoring
- Set up alerts for database issues
- Monitor connection pool usage
- Enable query logging

#### Error Tracking (Optional)
Install Sentry or similar:

```bash
yarn add @sentry/nextjs
```

Configure in `sentry.client.config.ts` and `sentry.server.config.ts`

### 5. Backup Strategy

#### Database Backups
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Upload to S3 or similar
aws s3 cp backup_*.sql s3://your-backup-bucket/
```

#### Automated Backups
- Vercel Postgres: Automatic backups included
- Supabase: Automatic backups in paid plan
- Self-hosted: Set up cron job for backups

### 6. Security Hardening

#### Rate Limiting
Add rate limiting to API routes:

```bash
yarn add express-rate-limit
```

#### CORS Configuration
Update `next.config.ts`:

```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
        ],
      },
    ];
  },
};
```

#### Environment Security
- Enable 2FA on all service accounts
- Use secrets manager for sensitive values
- Rotate API keys regularly
- Monitor access logs

## Monitoring & Maintenance

### Regular Tasks

**Daily:**
- Check pending deposits
- Monitor error logs
- Verify system health

**Weekly:**
- Update NAV in admin panel
- Review deposit approvals
- Check user support tickets

**Monthly:**
- Database backups verification
- Security updates
- Performance optimization
- User analytics review

### Update NAV

```bash
# Access admin panel
1. Connect with admin wallet
2. Go to /admin
3. Update "Current NAV" field
4. Save settings

# Or via API
curl -X POST https://yourdomain.com/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=..." \
  -d '{"currentNAV": 1.0523, "performanceYTD": 24.3}'
```

### Handle Deposits

Monitor deposits that need manual review:
1. Check `/admin` for pending deposits
2. Verify on Arbiscan
3. Credit or reject as needed

### Scaling Considerations

**When to Scale:**
- More than 1000 active users
- More than 100 deposits per day
- Database queries getting slow

**Scaling Options:**
- Upgrade database plan (more connections, faster CPU)
- Enable Redis caching
- Use CDN for static assets
- Implement background job queue
- Separate read replicas for reporting

## Troubleshooting

### Deployment Fails

**Build Error:**
```bash
# Check logs
vercel logs

# Common fixes
rm -rf .next node_modules
yarn install
yarn build
```

**Database Connection Error:**
- Verify `DATABASE_URL` format
- Check database is accessible from hosting platform
- Ensure SSL mode is correct (`?sslmode=require`)

### Production Issues

**Slow Performance:**
- Enable Next.js caching
- Add database indexes
- Optimize images
- Use CDN

**High Database Usage:**
- Add connection pooling
- Optimize queries
- Add caching layer

**Transaction Verification Fails:**
- Check RPC provider status (Alchemy/Infura)
- Verify API key limits not exceeded
- Ensure correct network (Arbitrum mainnet)

## Rollback Procedure

If you need to rollback:

### Vercel
1. Go to project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Self-Hosted
```bash
git revert HEAD
yarn build
pm2 restart arbibot
```

### Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup_20241120.sql
```

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Arbitrum Docs**: https://docs.arbitrum.io/

## Emergency Contacts

Keep these handy:
- Database provider support
- Hosting platform support
- Your dev team contact
- Security incident response team

---

**Deployment Complete!** 🚀

Your USDC Investment SaaS is now live. Monitor closely for the first 24-48 hours and be ready to address any issues quickly.
