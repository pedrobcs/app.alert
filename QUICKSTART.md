# Quick Start Guide - ArbiBot Invest

Get up and running in 15 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Alchemy/Infura account for RPC
- WalletConnect Project ID
- Wallet with some Arbitrum ETH for testing

## Step 1: Install Dependencies (2 minutes)

```bash
# Install packages
yarn install

# or with npm
npm install
```

## Step 2: Set Up Database (3 minutes)

### Option A: Local PostgreSQL

```bash
# Start PostgreSQL
brew services start postgresql@14  # macOS
# or
sudo systemctl start postgresql    # Linux

# Create database
createdb usdc_investment
```

### Option B: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database

## Step 3: Configure Environment (5 minutes)

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env
```

**Minimum required variables:**

```env
# Database (use your actual connection string)
DATABASE_URL="postgresql://postgres:password@localhost:5432/usdc_investment"

# Get from alchemy.com
ALCHEMY_API_KEY="your_alchemy_key"

# Get from cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_project_id"

# Your wallet addresses (will be admin)
ADMIN_WALLET_ADDRESS="0xYourWalletAddress"
OPERATOR_WALLET_ADDRESS="0xYourWalletAddress"

# Generate a random secret (min 32 chars)
JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters_long"
NEXTAUTH_SECRET="another_secret_key_for_nextauth"

# USDC token (bridged USDC.e on Arbitrum)
NEXT_PUBLIC_USDC_ADDRESS="0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8"
```

**Quick way to generate secrets:**

```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Initialize Database (2 minutes)

```bash
# Generate Prisma client
yarn prisma:generate

# Run migrations
yarn prisma:migrate deploy

# (Optional) Seed initial data
yarn prisma db seed
```

## Step 5: Start Development Server (1 minute)

```bash
# Start Next.js dev server
yarn dev

# Open browser
open http://localhost:3000
```

## Step 6: Configure Admin Settings (2 minutes)

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Connect with your admin wallet (from ADMIN_WALLET_ADDRESS)
4. Navigate to http://localhost:3000/admin
5. Configure:
   - Operator wallet address (where USDC will be sent)
   - Token address (already set from env)
   - Minimum deposit: 100
   - Required confirmations: 5
   - Click "Save Settings"

## Step 7: Test Deposit Flow (Optional)

### On Arbitrum Testnet (Sepolia)

1. Change chain ID to testnet in `.env`:
```env
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=421614
```

2. Get testnet ETH and USDC from faucets
3. Make a test deposit through the UI

### On Arbitrum Mainnet

1. Ensure you have USDC on Arbitrum
2. Make a small test deposit (e.g., $100)
3. Verify it appears in deposits page

## Verification Checklist

- [ ] App loads at http://localhost:3000
- [ ] Can connect wallet
- [ ] Dashboard loads after connecting
- [ ] Admin panel accessible at /admin
- [ ] Settings can be saved
- [ ] Deposit modal opens and shows operator address

## Common Issues

### "Failed to connect to database"
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### "Cannot find module '@prisma/client'"
```bash
yarn prisma:generate
```

### "Invalid WalletConnect project ID"
```bash
# Get a new one from cloud.walletconnect.com
# Update NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env
```

### Port 3000 already in use
```bash
# Find and kill process
lsof -ti:3000 | xargs kill

# Or use different port
yarn dev -p 3001
```

## Next Steps

1. **Read the full README.md** for detailed documentation
2. **Review DEPLOYMENT_GUIDE.md** before going to production
3. **Check API_DOCUMENTATION.md** for API reference
4. **Test all features** thoroughly before accepting real deposits
5. **Set up monitoring** and backups

## Production Deployment

When ready for production:

```bash
# Build for production
yarn build

# Test production build locally
yarn start

# Deploy to Vercel
vercel --prod
```

See **DEPLOYMENT_GUIDE.md** for complete deployment instructions.

## Getting Help

- Check README.md for detailed docs
- Review troubleshooting section
- Open GitHub issue for bugs
- Email: support@arbibot.com

## Important Security Notes

⚠️ **Before Production:**

1. Never commit `.env` file
2. Use strong, unique secrets
3. Enable 2FA on all accounts
4. Test thoroughly on testnet first
5. Start with small amounts
6. Monitor closely for first 24 hours

---

**You're all set!** 🎉

Your USDC Investment SaaS is running locally. Start building and testing your platform.
