# Hyperliquid Trading Bot

A full-stack Next.js TypeScript dApp for automated futures trading on Hyperliquid using Wyckoff strategy.

## 🚀 Features

- **EVM Wallet Integration**: Connect with MetaMask, WalletConnect, Coinbase Wallet, and more
- **Hyperliquid L1**: Automated perpetual futures trading on Hyperliquid's native blockchain
- **Wyckoff Strategy**: Accumulation/distribution detection on 5-minute timeframe
- **Dual Operating Modes**:
  - **Non-Custodial**: User signs each trade (requires user presence)
  - **Custodial**: Automated 24/7 trading (testing only - use with caution)
- **Risk Management**: Configurable stop-loss, take-profit, position sizing, and leverage
- **Real-time Dashboard**: Monitor positions, P&L, signals, and trade history
- **SQLite Database**: Persistent bot configurations and trade logs

## ⚠️ Security Warnings

**🚨 CRITICAL - READ BEFORE USING:**

1. **This is for TESTING and EDUCATIONAL purposes only**
2. **Automated trading involves significant financial risk**
3. **NEVER use custodial mode with real funds on mainnet**
4. **ALWAYS test on devnet first with small amounts**
5. **NEVER commit private keys to source control**
6. **Use encrypted storage (AWS KMS, HashiCorp Vault) in production**
7. **You could lose all your funds - only risk what you can afford to lose**

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- EVM wallet (MetaMask recommended)
- USDC on Arbitrum (for trading)
- Basic understanding of trading and risk management

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
# or
yarn install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Hyperliquid Configuration
NEXT_PUBLIC_HYPERLIQUID_ENV=testnet
HYPERLIQUID_ENV=testnet

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Keeper Private Key (for custodial mode - NEVER commit this!)
# This is an Ethereum private key (0x...)
KEEPER_PRIVATE_KEY=

# Database
DATABASE_URL=file:./dev.db

# Safety Settings
NODE_ENV=development
ALLOW_LIVE_TRADES=false

# Keeper Configuration
KEEPER_POLL_INTERVAL_MS=300000
KEEPER_MAX_RETRIES=3
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run migrate
```

### 4. (Optional) Set Up Custodial Mode

**⚠️ Only for testing on devnet!**

```bash
# Generate a new keypair
solana-keygen new --outfile keeper-keypair.json

# Fund the wallet on devnet
solana airdrop 2 --url devnet --keypair keeper-keypair.json

# Copy the private key array from keeper-keypair.json
cat keeper-keypair.json

# Add to .env
KEEPER_PRIVATE_KEY='[1,2,3,...]'

# NEVER commit keeper-keypair.json or .env!
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Creating a Bot

1. **Connect Your Wallet**: Click "Connect Wallet" and approve the connection (MetaMask, WalletConnect, etc.)
2. **Navigate to Create Bot**: Click "Create New Bot"
3. **Configure Bot**:
   - **Name**: Give your bot a descriptive name
   - **Market**: Select trading pair (BTC, ETH, SOL, etc.)
   - **Mode**: Choose Non-Custodial or Custodial
   - **Strategy Parameters**:
     - Lookback Bars: 12 (1 hour of 5-min bars)
     - Volume Threshold: 1.5x average
     - Accumulation/Distribution Sensitivity: 0.7
   - **Risk Management**:
     - Position Size: 10% of equity
     - Max Leverage: 5x
     - Stop Loss: 10%
     - Take Profit: 40%
4. **Accept Risks**: Read and accept all warnings
5. **Create Bot**: Click "Create Bot"

### Starting a Bot

1. From the dashboard, find your bot
2. Click "Start" button
3. The keeper will begin polling every 5 minutes
4. Monitor signals and trades in real-time

### Monitoring

The dashboard shows:
- **Bot Status**: Running, Stopped, Error
- **Current Position**: Side, size, entry price, unrealized P&L
- **Last Signal**: Wyckoff signal with confidence and reasoning
- **Performance Stats**: Total trades, win rate, total P&L
- **Trade History**: All executed trades with details

### Stopping a Bot

1. Click "Stop" button on your bot
2. The keeper will stop polling
3. **Note**: Open positions remain open - close manually if needed

## 🧪 Testing Workflow

### Recommended Testing Sequence:

1. **Test on Devnet**
   ```bash
   # Set in .env
   NEXT_PUBLIC_DRIFT_ENV=devnet
   DRIFT_ENV=devnet
   NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
   ```

2. **Start with Non-Custodial Mode**
   - Create a bot in non-custodial mode
   - Observe signals and behavior
   - Manually review each trade before signing

3. **Test Custodial Mode on Testnet**
   - Create a custodial bot with small test amounts
   - Monitor for 24 hours
   - Check trade execution and risk management

4. **Backtest Strategy**
   - Use historical data to validate Wyckoff parameters
   - Optimize lookback window, volume threshold, sensitivity
   - Calculate Sharpe ratio, max drawdown, win rate

5. **Paper Trade on Mainnet**
   - Connect to mainnet but don't enable live trades
   - Monitor signals without execution
   - Validate strategy in live market conditions

6. **Go Live (If Comfortable)**
   ```bash
   # Enable live trades
   NODE_ENV=production
   ALLOW_LIVE_TRADES=true
   ```
   - Start with VERY small position sizes
   - Monitor closely for first week
   - Gradually increase allocation if successful

## 🏗️ Project Structure

```
├── components/           # React components
│   ├── WalletConnector.tsx
│   ├── BotConfigForm.tsx
│   ├── BotStatus.tsx
│   └── TradeLog.tsx
├── lib/                  # Core logic
│   ├── wyckoff.ts        # Wyckoff strategy implementation
│   ├── driftClient.ts    # Drift Protocol integration
│   ├── keeper.ts         # Bot keeper/execution loop
│   └── prisma.ts         # Database client
├── pages/                # Next.js pages
│   ├── index.tsx         # Dashboard
│   ├── bots/new.tsx      # Create bot form
│   └── api/              # API routes
│       ├── bots/
│       │   ├── create.ts
│       │   ├── list.ts
│       │   ├── start.ts
│       │   ├── stop.ts
│       │   ├── status.ts
│       │   └── trades.ts
│       └── trade/
│           └── execute.ts
├── prisma/
│   └── schema.prisma     # Database schema
├── types/
│   └── index.ts          # TypeScript types
└── styles/
    └── globals.css       # Global styles
```

## 🎯 Wyckoff Strategy Explained

The Wyckoff Method analyzes price and volume to identify market phases:

### Phases:

1. **Accumulation**: Smart money accumulates positions
   - Sideways price action
   - Increasing volume on up moves
   - **Signal**: Breakout above resistance on high volume = LONG

2. **Markup**: Uptrend after accumulation
   - Strong upward momentum
   - Strategy: Wait for pullback

3. **Distribution**: Smart money distributes positions
   - Sideways price action
   - Increasing volume on down moves
   - **Signal**: Breakdown below support on high volume = SHORT

4. **Markdown**: Downtrend after distribution
   - Strong downward momentum
   - Strategy: Wait for bounce

### Parameters:

- **Lookback Bars**: Number of bars to analyze (default: 12 = 1 hour)
- **Volume Threshold**: Multiplier for volume spike detection (default: 1.5x)
- **Accumulation Sensitivity**: How aggressive to enter longs (0-1)
- **Distribution Sensitivity**: How aggressive to enter shorts (0-1)

### TODO: Fine-tuning

The strategy needs optimization through backtesting:
- Test different lookback periods (5, 12, 24 bars)
- Test volume thresholds (1.2x, 1.5x, 2.0x)
- Add momentum indicators (RSI, MACD) for confirmation
- Implement position scaling based on confidence
- Add regime filters (trending vs ranging markets)

## 🔧 Development

### Run Tests

```bash
npm test
```

### Run Keeper Manually

```bash
npm run keeper:start
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 📚 References

### Hyperliquid
- [Hyperliquid Documentation](https://hyperliquid.gitbook.io/hyperliquid-docs)
- [Hyperliquid API Docs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api)
- [Hyperliquid SDK (nktkas)](https://github.com/nktkas/hyperliquid)
- [Hyperliquid SDK (nomeida)](https://github.com/nomeida/hyperliquid)

### Wallet Integration
- [Wagmi Documentation](https://wagmi.sh/)
- [Web3Modal](https://docs.walletconnect.com/web3modal/about)
- [WalletConnect](https://walletconnect.com/)

### Wyckoff Method
- [Wyckoff Method Guide](https://school.stockcharts.com/doku.php?id=market_analysis:the_wyckoff_method)
- [Volume Spread Analysis](https://www.investopedia.com/articles/trading/07/volumespreadanalysis.asp)

## 🔐 Production Deployment Checklist

Before deploying to production:

- [ ] **Never** store private keys in environment variables
- [ ] Use AWS KMS or HashiCorp Vault for key management
- [ ] Enable transaction signing via hardware wallet or MPC
- [ ] Implement rate limiting on API routes
- [ ] Add authentication/authorization
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up monitoring and alerting (Datadog, Sentry)
- [ ] Implement circuit breakers for API failures
- [ ] Add transaction retry logic with exponential backoff
- [ ] Set up proper logging (CloudWatch, LogRocket)
- [ ] Use dedicated RPC endpoint (not public)
- [ ] Enable HTTPS and security headers
- [ ] Implement IP whitelisting for admin routes
- [ ] Add 2FA for sensitive operations
- [ ] Set up automated backups
- [ ] Test disaster recovery procedures
- [ ] Have manual emergency stop mechanism
- [ ] Comply with financial regulations in your jurisdiction
- [ ] Consider insurance for smart contract risks
- [ ] Document incident response procedures

## ⚖️ Disclaimer

This software is provided "as is" without warranty of any kind, express or implied. The authors are not responsible for any losses incurred from using this software. Trading cryptocurrencies and derivatives involves substantial risk of loss and is not suitable for every investor. You should carefully consider whether trading is suitable for you in light of your circumstances, knowledge, and financial resources.

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 💬 Support

For issues and questions:
- Open an issue on GitHub
- Check Hyperliquid Discord
- Review Hyperliquid documentation

---

**Happy Trading! 📈 (but be careful! ⚠️)**
)**
