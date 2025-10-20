# Hyperliquid Trading Bot - Complete Setup Guide

This guide will walk you through setting up your Hyperliquid trading bot from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Get Hyperliquid Wallet Ready](#get-hyperliquid-wallet-ready)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Testing Your Setup](#testing-your-setup)
6. [Going Live](#going-live)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- Node.js 18 or higher ([Download](https://nodejs.org/))
- npm or yarn package manager
- MetaMask or another EVM wallet extension
- Basic understanding of trading concepts

### Recommended
- Git for version control
- Code editor (VS Code recommended)
- Terminal/command line knowledge

## Get Hyperliquid Wallet Ready

### Step 1: Install MetaMask
1. Install [MetaMask browser extension](https://metamask.io/)
2. Create a new wallet or import existing one
3. **Save your seed phrase securely** - you'll need this!

### Step 2: Add Arbitrum Network
Hyperliquid runs on Arbitrum. Add it to MetaMask:

**For Testnet (Arbitrum Sepolia):**
- Network Name: Arbitrum Sepolia
- RPC URL: https://sepolia-rollup.arbitrum.io/rpc
- Chain ID: 421614
- Currency Symbol: ETH
- Block Explorer: https://sepolia.arbiscan.io

**For Mainnet (Arbitrum One):**
- Network Name: Arbitrum One
- RPC URL: https://arb1.arbitrum.io/rpc
- Chain ID: 42161
- Currency Symbol: ETH
- Block Explorer: https://arbiscan.io

### Step 3: Fund Your Wallet

**For Testnet:**
1. Get testnet ETH from [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)
2. Get testnet USDC (may need to bridge or use testnet faucets)

**For Mainnet:**
1. Bridge USDC to Arbitrum using [Arbitrum Bridge](https://bridge.arbitrum.io/)
2. You'll need USDC for trading collateral
3. Keep some ETH for gas fees

### Step 4: Access Hyperliquid
1. Go to [Hyperliquid Testnet](https://app.hyperliquid-testnet.xyz/) or [Hyperliquid Mainnet](https://app.hyperliquid.xyz/)
2. Connect your MetaMask wallet
3. Deposit USDC into your Hyperliquid account
4. Familiarize yourself with the interface

## Installation

### Step 1: Clone or Download the Repository

```bash
# If using git
git clone <your-repo-url>
cd hyperliquid-trading-bot

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install all required packages including:
- `hyperliquid` - SDK for Hyperliquid API
- `ethers` - Ethereum library
- `wagmi` - React hooks for Ethereum
- `next` - Next.js framework
- And more...

### Step 3: Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database and run migrations
npm run migrate
```

This creates a SQLite database (`dev.db`) to store your bot configurations and trade history.

## Configuration

### Step 1: Create Environment File

```bash
# Copy the example env file
cp .env.example .env
```

### Step 2: Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up / Log in
3. Create a new project
4. Copy your Project ID
5. Add to `.env`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Step 3: Configure Environment Variables

Edit `.env` file:

```bash
# Hyperliquid Environment
NEXT_PUBLIC_HYPERLIQUID_ENV=testnet  # or 'mainnet'
HYPERLIQUID_ENV=testnet

# WalletConnect (from Step 2)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Database
DATABASE_URL=file:./dev.db

# Safety Settings
NODE_ENV=development
ALLOW_LIVE_TRADES=false  # IMPORTANT: Keep false until ready!

# Bot Configuration
KEEPER_POLL_INTERVAL_MS=300000  # 5 minutes
KEEPER_MAX_RETRIES=3
```

### Step 4: (Optional) Set Up Custodial Mode

**⚠️ WARNING: Only use custodial mode for testing with small amounts!**

Custodial mode allows the bot to trade automatically without requiring you to sign each transaction.

1. Generate a new Ethereum private key:
   ```bash
   # On Linux/Mac:
   openssl rand -hex 32
   
   # Or use an existing wallet's private key (export from MetaMask)
   ```

2. Add to `.env`:
   ```bash
   KEEPER_PRIVATE_KEY=0x<your_64_character_hex_private_key>
   ```

3. Fund this wallet with USDC on Arbitrum

4. **CRITICAL**: 
   - Never commit `.env` to git
   - Never share your private key
   - Only use for testing initially
   - Use hardware wallets for production

## Testing Your Setup

### Step 1: Start Development Server

```bash
npm run dev
```

Open your browser to [http://localhost:3000](http://localhost:3000)

### Step 2: Connect Your Wallet

1. Click "Connect Wallet" button
2. Choose MetaMask (or your preferred wallet)
3. Approve the connection
4. Verify your address appears in the UI

### Step 3: Create Your First Bot

1. Click "Create New Bot"
2. Fill in the form:
   - **Name**: "Test Bot 1"
   - **Market**: "BTC" (or "ETH", "SOL")
   - **Mode**: "Non-Custodial" (to start)
   - Use default parameters initially
3. Click "Create Bot"

### Step 4: Test Non-Custodial Mode

1. Start your bot from the dashboard
2. Wait for the first signal (may take 5-10 minutes)
3. If a signal triggers, you'll be prompted to sign the transaction
4. Review carefully before signing

### Step 5: Test Custodial Mode (Optional)

**Only after testing non-custodial mode!**

1. Ensure `KEEPER_PRIVATE_KEY` is set in `.env`
2. Create a new bot in "Custodial" mode
3. Start the bot
4. Monitor it closely for the first few hours
5. Check that trades execute automatically

## Going Live

### ⚠️ Before Trading on Mainnet

**Complete this checklist:**

- [ ] Successfully tested on testnet for at least 1 week
- [ ] Reviewed all trade executions and verified strategy works
- [ ] Tested stop-loss and take-profit mechanisms
- [ ] Calculated expected drawdown and acceptable risk
- [ ] Funded mainnet wallet with ONLY amount you can afford to lose
- [ ] Set conservative position sizes (start with 1-5% of capital)
- [ ] Enabled `ALLOW_LIVE_TRADES=true` in `.env`
- [ ] Set up monitoring/alerts (Discord, Telegram, email)
- [ ] Have a plan for emergency shutdown

### Step 1: Switch to Mainnet

Edit `.env`:

```bash
NEXT_PUBLIC_HYPERLIQUID_ENV=mainnet
HYPERLIQUID_ENV=mainnet
```

### Step 2: Enable Live Trades

```bash
NODE_ENV=production
ALLOW_LIVE_TRADES=true
```

### Step 3: Start Small

1. Create a bot with minimal position size (1-2%)
2. Use conservative leverage (2-3x max)
3. Set tight stop-losses (5-10%)
4. Monitor continuously for first 24 hours

### Step 4: Scale Gradually

- Week 1: 1-2% position sizes
- Week 2-4: 3-5% if profitable
- Month 2+: Up to 10% if consistently profitable
- Never exceed 20% of capital per position

## Troubleshooting

### Common Issues

**Problem: "Cannot connect wallet"**
- Solution: Make sure MetaMask is installed and unlocked
- Check that you're on the correct network (Arbitrum)
- Try refreshing the page

**Problem: "Insufficient balance"**
- Solution: Deposit more USDC to your Hyperliquid account
- Ensure you have ETH for gas fees

**Problem: "Bot won't start"**
- Solution: Check console for errors
- Verify `KEEPER_PRIVATE_KEY` is set correctly (for custodial mode)
- Ensure database migrations ran successfully

**Problem: "No trading signals"**
- Solution: Signals may take time (up to 30+ minutes)
- Market must show volume and price action for Wyckoff detection
- Try different markets (BTC, ETH typically more active)

**Problem: "Trade execution failed"**
- Solution: Check Hyperliquid account has sufficient USDC
- Verify leverage settings aren't too high
- Check for API rate limits

### Debug Mode

Enable verbose logging:

```bash
# In terminal where you run the bot
npm run dev

# Watch for console output
# Check Network tab in browser DevTools
```

### Get Help

- Check [Hyperliquid Docs](https://hyperliquid.gitbook.io/hyperliquid-docs)
- Review [SDK Examples](https://github.com/nktkas/hyperliquid)
- Open an issue on GitHub
- Join Hyperliquid Discord

## Next Steps

### Optimize Your Strategy

1. **Backtest Parameters**: Use historical data to find optimal settings
2. **Adjust Lookback Period**: Try 5, 12, 20, 24 bars
3. **Tune Volume Threshold**: Test 1.2x, 1.5x, 2.0x
4. **Add Filters**: Consider RSI, MACD for confirmation
5. **Test Multiple Markets**: Different assets behave differently

### Monitor Performance

Track these metrics:
- Win rate (aim for >50%)
- Average win vs average loss (aim for >1.5)
- Maximum drawdown (keep under 20%)
- Sharpe ratio (aim for >1.0)
- Total P&L over time

### Risk Management

- Never risk more than 1-2% per trade
- Use position sizing based on volatility
- Set account-level stop-loss (e.g., -10% daily)
- Diversify across multiple markets if scaling
- Keep 50%+ of capital as reserve

## Security Reminders

🔐 **Critical Security Rules:**

1. **NEVER** commit `.env` file to git
2. **NEVER** share your private keys
3. **NEVER** screenshot/share your `.env` file
4. Use hardware wallets for large amounts
5. Enable 2FA on all accounts
6. Keep software updated
7. Use dedicated trading wallet (separate from main funds)
8. Test on testnet first, always
9. Start with small amounts
10. Have emergency stop procedures

---

**You're now ready to start trading with Hyperliquid! Remember: Start small, test thoroughly, and never risk more than you can afford to lose. 📈⚠️**
