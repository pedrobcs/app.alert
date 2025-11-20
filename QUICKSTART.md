# Quick Start Guide

Get the USDC Investment Platform running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Alchemy or Infura account
- WalletConnect Project ID

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# REQUIRED
DATABASE_URL="postgresql://user:password@localhost:5432/usdc_investment"
ALCHEMY_API_KEY="your_alchemy_key"
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_project_id"
JWT_SECRET="generate_a_32_char_random_string"

# IMPORTANT: Set these to your actual addresses
NEXT_PUBLIC_OPERATOR_WALLET_ADDRESS="0xYourWalletAddress"
NEXT_PUBLIC_USDC_ADDRESS="0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Open Prisma Studio to view data (optional)
npx prisma studio
```

### 4. Initialize Admin Settings

Option A: Use Prisma Studio
1. Run `npx prisma studio`
2. Go to AdminSettings table
3. Add a new record with your settings

Option B: Use SQL
```sql
INSERT INTO "AdminSettings" (
  "id",
  "receivingWalletAddress",
  "usdcTokenAddress",
  "tokenSymbol",
  "minimumDeposit",
  "requiredConfirmations",
  "currentNav",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-settings-1',
  '0xYourOperatorWalletAddress',
  '0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8',
  'USDC',
  '100',
  5,
  '1.0',
  NOW(),
  NOW()
);
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Start Blockchain Scanner (Optional for Development)

In a separate terminal:

```bash
npm run scanner
```

This will continuously scan for deposits.

## Test the Platform

### Test on Arbitrum Sepolia (Testnet)

1. **Get testnet tokens**
   - Get Sepolia ETH from [faucet](https://sepoliafaucet.com/)
   - Bridge to Arbitrum Sepolia
   - Get testnet USDC

2. **Update .env for testnet**
   ```env
   NEXT_PUBLIC_ARBITRUM_CHAIN_ID=421614
   NEXT_PUBLIC_USDC_ADDRESS="0x..."  # Sepolia USDC address
   ```

3. **Test deposit flow**
   - Connect wallet
   - Sign authentication message
   - Make test deposit
   - Verify in dashboard

### Access Admin Dashboard

1. Visit [http://localhost:3000/admin](http://localhost:3000/admin)
2. Enter password (from `ADMIN_PASSWORD` env var, or default: `admin123`)
3. Configure platform settings

## Common Issues

### "Database connection error"

```bash
# Check PostgreSQL is running
psql -U postgres

# Test connection
npx prisma db pull
```

### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Prisma Client not generated"

```bash
npx prisma generate
```

## Next Steps

1. **Configure Admin Settings**
   - Set your receiving wallet address
   - Choose USDC token address
   - Set minimum deposit and confirmations

2. **Customize Branding**
   - Update app name in `.env`
   - Modify colors in `tailwind.config.ts`
   - Update metadata in `app/layout.tsx`

3. **Add Legal Pages**
   - Create `/app/terms/page.tsx`
   - Create `/app/privacy/page.tsx`
   - Create `/app/risks/page.tsx`

4. **Deploy to Production**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Set up monitoring
   - Test thoroughly

## Development Tips

### Useful Commands

```bash
# View database
npm run db:studio

# Create migration
npm run db:migrate

# Format code
npx prettier --write .

# Type check
npx tsc --noEmit
```

### Hot Reload

Next.js supports hot module reloading. Changes will appear automatically.

### Debug Mode

```typescript
// Enable debug logging
console.log('[DEBUG]', yourVariable);
```

## Architecture Overview

```
User Flow:
1. Connect Wallet → RainbowKit
2. Sign Message → Wallet Signature
3. Deposit USDC → Blockchain Transaction
4. Track Deposit → API Call
5. Verify On-Chain → Ethers.js
6. Credit Account → Database Update

Admin Flow:
1. Login → Password Auth
2. View Stats → Database Query
3. Update Settings → API Call
4. Manage Deposits → Database Query
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [RainbowKit Docs](https://www.rainbowkit.com/docs/introduction)
- [Arbitrum Docs](https://docs.arbitrum.io/)
- [Ethers.js Docs](https://docs.ethers.org/)

## Getting Help

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT_GUIDE.md` for production setup
- Open an issue on GitHub
- Contact: support@yourdomain.com

## Security Reminder

⚠️ **Before going to production:**
- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Set up proper admin authentication
- [ ] Review all security settings
- [ ] Conduct security audit
- [ ] Test on testnet thoroughly

---

**Happy Building! 🚀**
