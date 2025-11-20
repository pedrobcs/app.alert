# USDC Investment Platform - Arbitrum Trading Bot

A production-ready Next.js SaaS platform that enables users to invest USDC on Arbitrum into an automated trading bot. Features include wallet authentication, on-chain deposit verification, real-time dashboard, and admin management.

## 🚀 Features

### User Features
- **Wallet Authentication**: Connect with MetaMask/WalletConnect using RainbowKit
- **USDC Deposits**: Send USDC directly from your wallet or via QR code
- **Real-Time Dashboard**: Track balance, performance, and transaction history
- **On-Chain Verification**: All deposits verified on Arbitrum blockchain
- **Performance Charts**: Visualize investment returns over time
- **Transaction History**: Complete audit trail of all activities

### Admin Features
- **Admin Dashboard**: Manage platform settings and deposits
- **Configurable Settings**: Set receiving wallet, token address, minimum deposits, etc.
- **Deposit Management**: View and manage all user deposits
- **Statistics**: Track total users, investments, and pending deposits
- **NAV Management**: Update Net Asset Value for share calculations

### Security Features
- **Wallet Signature Verification**: Prove ownership without exposing private keys
- **On-Chain Verification**: Server-side transaction validation via Alchemy/Infura
- **Legal Disclaimers**: Comprehensive risk warnings and terms
- **KYC/AML Support**: Optional identity verification
- **Rate Limiting**: Protect APIs from abuse

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Web3**: wagmi, ethers.js, RainbowKit, viem
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Arbitrum (via Alchemy/Infura RPC)
- **Charts**: Recharts
- **Authentication**: JWT, Wallet Signatures

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Alchemy or Infura API key
- WalletConnect Project ID (get from [cloud.walletconnect.com](https://cloud.walletconnect.com))

## ⚙️ Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
# or
yarn install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/usdc_investment"

# Blockchain RPC
ALCHEMY_API_KEY=your_alchemy_key
# OR
INFURA_API_KEY=your_infura_key

# Arbitrum Network
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=42161

# USDC Token (choose one)
# Bridged USDC.e:
NEXT_PUBLIC_USDC_ADDRESS=0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8
# Native USDC:
# NEXT_PUBLIC_USDC_ADDRESS=0xaf88d065e77c8cc2239327c5edb3a432268e5831

# Operator Wallet
NEXT_PUBLIC_OPERATOR_WALLET_ADDRESS=0xYourWalletAddress

# Security
JWT_SECRET=your_32_char_secret_here
NEXTAUTH_SECRET=your_nextauth_secret

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Admin
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed initial admin settings
npx prisma db seed
```

### 4. Initialize Admin Settings

You can create initial settings via the admin dashboard or directly in the database:

```sql
INSERT INTO "AdminSettings" (
  "receivingWalletAddress",
  "usdcTokenAddress",
  "tokenSymbol",
  "minimumDeposit",
  "requiredConfirmations",
  "currentNav"
) VALUES (
  '0xYourOperatorWalletAddress',
  '0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8',
  'USDC',
  '100',
  5,
  '1.0'
);
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repo to Vercel
   - Add all environment variables from `.env`
   - Deploy!

3. **Set Up Database**
   - Use Vercel Postgres, Supabase, or external PostgreSQL
   - Run migrations: `npx prisma migrate deploy`

### Background Worker Setup

The blockchain scanner needs to run continuously:

**Option 1: Vercel Cron Jobs**
```typescript
// app/api/cron/scan/route.ts
export async function GET() {
  // Import and run scanner logic
}
```

**Option 2: Separate Process (Railway/Render)**
```bash
npm run scanner
```

**Option 3: PM2 (VPS)**
```bash
pm2 start src/scripts/scanner.ts --name "blockchain-scanner"
```

## 📚 Usage Guide

### For Users

1. **Connect Wallet**: Click "Connect Wallet" and select your wallet
2. **Authenticate**: Sign the message to prove ownership (no gas fees)
3. **Deposit USDC**: 
   - Enter amount (minimum shown)
   - Send from connected wallet OR
   - Copy address and send manually
   - Submit transaction hash for tracking
4. **Track Performance**: View your balance, returns, and transaction history
5. **Monitor Deposits**: See pending/confirmed deposits with block confirmations

### For Admins

1. **Access Admin Panel**: Visit `/admin`
2. **Login**: Enter admin password
3. **Configure Settings**:
   - Set receiving wallet address
   - Choose USDC token address
   - Set minimum deposit and confirmations
   - Update NAV (Net Asset Value)
   - Toggle KYC requirements
4. **Monitor Deposits**: View all deposits with status
5. **Manage Users**: Track total investments and user activity

## 🔐 Security Best Practices

### Critical Security Measures

1. **Never expose private keys in code or environment variables**
   - Use hardware wallets or secure key management systems
   - Keep operator private key offline

2. **Verify all transactions server-side**
   - Don't trust client-provided data
   - Always verify on-chain before crediting

3. **Use strong secrets**
   ```bash
   # Generate secure JWT secret
   openssl rand -base64 32
   ```

4. **Enable rate limiting** in production
5. **Regular security audits** of smart contract interactions
6. **Monitor for suspicious activity** in admin dashboard

### Environment Variable Security

- **Never commit `.env` to git**
- Use Vercel/platform secrets for production
- Rotate secrets regularly
- Use different secrets for dev/staging/prod

## 🏗️ Architecture

### Frontend (Next.js)
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Investor dashboard
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── landing/          # Landing page sections
│   └── dashboard/        # Dashboard components
├── lib/                   # Core utilities
│   ├── prisma.ts         # Database client
│   ├── blockchain.ts     # Web3 utilities
│   ├── auth.ts           # Authentication
│   └── wagmi.ts          # Web3 config
└── hooks/                 # Custom React hooks
```

### Backend (API Routes)
- `/api/auth/*` - Wallet authentication
- `/api/deposits/*` - Deposit tracking
- `/api/transactions` - Transaction history
- `/api/settings` - Public settings
- `/api/admin/*` - Admin operations

### Database Schema
- **User**: Wallet address, KYC status, investment totals
- **Deposit**: On-chain deposits with verification
- **Transaction**: All financial activities
- **AdminSettings**: Platform configuration
- **PerformanceSnapshot**: Historical NAV data

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test blockchain interactions
npm run test:blockchain

# Manual testing checklist in TESTING.md
```

## 📖 API Documentation

### Public APIs

**GET `/api/settings`**
- Returns public platform settings
- No authentication required

**POST `/api/auth/nonce`**
```json
{
  "walletAddress": "0x..."
}
```

**POST `/api/auth/verify`**
```json
{
  "walletAddress": "0x...",
  "signature": "0x..."
}
```

**POST `/api/deposits/track`**
- Requires authentication
- Body: `{ "txHash": "0x..." }`

### Admin APIs

All admin APIs require admin authentication:
- **GET/POST `/api/admin/settings`**
- **GET `/api/admin/deposits`**
- **GET `/api/admin/stats`**

## 🐛 Troubleshooting

### Common Issues

1. **"Transaction not found"**
   - Wait for transaction to be mined
   - Check if using correct network (Arbitrum)

2. **"Invalid signature"**
   - Ensure wallet address matches
   - Try disconnecting and reconnecting wallet

3. **Database connection errors**
   - Check DATABASE_URL is correct
   - Ensure Prisma client is generated
   - Run `npx prisma generate`

4. **Deposits not showing**
   - Check blockchain scanner is running
   - Verify RPC provider is working
   - Check lastScanBlock in AdminSettings

## 🤝 Contributing

This is a private project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚖️ Legal & Compliance

**Important**: This platform handles financial transactions. Ensure compliance with:

- Securities regulations in your jurisdiction
- KYC/AML requirements
- Tax reporting obligations
- Consumer protection laws
- Terms of service and privacy policy

**Consult with legal counsel before launching.**

## 📝 License

Copyright © 2024. All rights reserved.

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Contact: admin@yourdomain.com

## 🎯 Roadmap

- [ ] Implement withdrawal functionality
- [ ] Add email notifications
- [ ] KYC provider integration
- [ ] Multi-token support
- [ ] Performance analytics
- [ ] Mobile app
- [ ] Referral program

## ⚠️ Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.**

Cryptocurrency trading involves substantial risk. This platform facilitates investment into trading strategies that may result in loss of capital. Past performance does not guarantee future results. Only invest funds you can afford to lose.

Users are responsible for understanding the risks and complying with applicable laws in their jurisdiction.

---

**Built with ❤️ using Next.js, TypeScript, and Arbitrum**
