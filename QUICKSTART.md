# Quick Start Guide

Get your Drift Trading Bot running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment

```bash
cp .env.example .env
```

The defaults are already configured for devnet testing.

## 3. Initialize Database

```bash
npm run prisma:generate
npm run migrate
```

## 4. Start the App

```bash
npm run dev
```

Open http://localhost:3000

## 5. Connect Wallet & Create Bot

1. Click "Connect Wallet" (use Phantom on devnet)
2. Click "Create New Bot"
3. Accept the risk warnings
4. Click "Create Bot"
5. Click "Start" on your bot

## 6. (Optional) Enable Custodial Mode

**⚠️ DEVNET TESTING ONLY!**

```bash
# Generate keypair
solana-keygen new --outfile keeper-keypair.json

# Fund it
solana airdrop 2 --url devnet --keypair keeper-keypair.json

# Copy the key array from keeper-keypair.json to .env
# KEEPER_PRIVATE_KEY='[1,2,3,...]'
```

Restart the dev server and create a custodial bot.

## Next Steps

- Monitor the dashboard for signals
- Check trade logs
- Adjust strategy parameters
- Read the full README.md for detailed documentation

## Troubleshooting

**Bot not starting?**
- Check console for errors
- Verify database is initialized
- For custodial mode, ensure KEEPER_PRIVATE_KEY is set

**No wallet showing?**
- Install Phantom extension
- Switch to devnet in Phantom settings
- Refresh the page

**Trades not executing?**
- Custodial mode requires KEEPER_PRIVATE_KEY
- Non-custodial mode is not fully implemented (see README)
- Check that bot status is "running"

For more help, see README.md or open an issue.
