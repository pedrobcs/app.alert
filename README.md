# ArbiBot Invest - USDC Investment SaaS Platform

A production-ready Next.js SaaS application that enables users to invest USDC on Arbitrum into an automated trading bot. Features wallet authentication, on-chain deposit verification, and a comprehensive investor dashboard.

## 🚀 Features

### 🌐 Public Landing Page
- Modern, responsive design with Tailwind CSS
- Value proposition and feature showcase
- FAQ section and trust indicators
- One-click wallet connection with RainbowKit

### 🔐 Wallet Authentication
- MetaMask and WalletConnect support via wagmi
- Signature-based authentication (no passwords)
- Session management with JWT
- Automatic account creation on first connect

### 💼 Investor Dashboard
- Real-time portfolio overview
- Total invested, current value, and returns
- Recent deposits and transaction history
- Performance tracking with YTD returns
- Interactive charts with Recharts

### 💰 USDC Deposit Flow
- In-browser USDC transfer using wallet
- Support for both USDC.e and native USDC on Arbitrum
- QR code for mobile wallet scanning
- Manual transaction hash submission
- Real-time transaction tracking

### ✅ Server-Side Verification
- On-chain transaction verification via Alchemy/Infura
- Automatic deposit detection and attribution
- Configurable confirmation requirements
- Share calculation based on NAV
- Duplicate transaction prevention

### 👨‍💼 Admin Dashboard
- Platform settings management
- Operator wallet configuration
- NAV and performance updates
- Deposit monitoring and approval
- User statistics and analytics

### ⚖️ Legal & Compliance
- Comprehensive risk disclosure modal
- KYC/AML capability (configurable)
- Terms of service acceptance
- Jurisdiction warnings
- Investment disclaimers

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Blockchain**: wagmi 2.x, viem, ethers.js 6
- **Wallet**: RainbowKit 2.x
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with jose
- **Charts**: Recharts
- **UI Components**: Lucide React icons, react-hot-toast
- **QR Codes**: qrcode.react

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Alchemy or Infura API key
- WalletConnect Project ID
- Operator wallet address on Arbitrum

## 🏗️ Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
yarn install

# or with npm
npm install
```

### 2. Database Setup

```bash
# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate

# (Optional) Open Prisma Studio to view data
yarn prisma:studio
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/usdc_investment"

# Blockchain RPC (choose one or both)
ALCHEMY_API_KEY="your_alchemy_api_key"
INFURA_URL="https://arbitrum-mainnet.infura.io/v3/your_project_id"
ETHERSCAN_API_KEY="your_arbiscan_api_key"

# Chain Configuration
NEXT_PUBLIC_ARBITRUM_CHAIN_ID=42161
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"

# USDC Token (choose one)
# Bridged USDC (USDC.e)
NEXT_PUBLIC_USDC_ADDRESS="0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8"
# OR Native USDC
# NEXT_PUBLIC_USDC_ADDRESS="0xaf88d065e77c8cC2239327C5EDb3A432268e5831"

# Admin & Operator Wallets
ADMIN_WALLET_ADDRESS="0xYourAdminWalletAddress"
OPERATOR_WALLET_ADDRESS="0xYourOperatorWalletAddress"

# Security
JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters_long"
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
MINIMUM_DEPOSIT_USDC=100
REQUIRED_CONFIRMATIONS=5

# Feature Flags
ENABLE_KYC_REQUIREMENT=false
ENABLE_EMAIL_NOTIFICATIONS=false
```

### 4. Get Required API Keys

**WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID

**Alchemy API Key:**
1. Go to https://www.alchemy.com/
2. Create a free account
3. Create a new app for "Arbitrum" network
4. Copy the API key

**Arbiscan API Key (optional):**
1. Go to https://arbiscan.io/
2. Create an account
3. Generate an API key

### 5. Run Development Server

```bash
yarn dev

# or with npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variables from `.env`
- Deploy

3. **Database Setup**
- Use Vercel Postgres, Supabase, or Railway for production database
- Update `DATABASE_URL` in Vercel environment variables
- Run migrations: `yarn prisma:migrate`

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:
- All variables from `.env.example`
- Use production RPC endpoints (Alchemy/Infura)
- Set strong, unique `JWT_SECRET` and `NEXTAUTH_SECRET`
- Update `NEXTAUTH_URL` to your production domain

## 📖 Usage Guide

### For Investors

1. **Connect Wallet**
   - Visit the landing page
   - Click "Connect Wallet"
   - Approve the connection in your wallet

2. **Make a Deposit**
   - Go to Dashboard → "Make a Deposit"
   - Enter the amount (minimum $100 USDC)
   - Approve and send the transaction
   - Wait for confirmation (usually 1-2 minutes)

3. **Track Your Investment**
   - View your balance in the Dashboard
   - Check transaction history in the Deposits page
   - Monitor performance in the Performance page

### For Administrators

1. **Access Admin Panel**
   - Connect with the admin wallet address
   - Navigate to `/admin`

2. **Configure Settings**
   - Set operator wallet address
   - Configure token address (USDC.e or native USDC)
   - Adjust minimum deposit and confirmations
   - Update NAV and performance metrics

3. **Monitor Deposits**
   - View all deposits in the admin dashboard
   - Check pending transactions
   - Review user statistics

## 🏗️ Architecture

### Database Schema

- **Users**: Wallet address, KYC status, total invested/shares
- **Deposits**: Transaction tracking, status, confirmations
- **Sessions**: JWT session management
- **AppSettings**: Platform configuration
- **AdminLogs**: Audit trail for admin actions

### API Routes

**Authentication:**
- `POST /api/auth/nonce` - Get nonce for wallet signature
- `POST /api/auth/verify` - Verify signature and create session
- `POST /api/auth/logout` - End session

**User:**
- `GET /api/user` - Get user profile and stats
- `GET /api/deposits` - Get user's deposits

**Deposits:**
- `POST /api/deposits/track` - Track and verify a deposit
- `GET /api/settings` - Get public settings

**Admin:**
- `GET /api/admin/settings` - Get admin settings
- `POST /api/admin/settings` - Update settings
- `GET /api/admin/deposits` - List all deposits
- `GET /api/admin/stats` - Get platform statistics

### Security Considerations

1. **Private Keys**: Never expose operator private keys in the frontend
2. **Transaction Verification**: All deposits are verified on-chain before crediting
3. **Admin Access**: Restricted to configured admin wallet address
4. **Rate Limiting**: Implement rate limiting on API routes in production
5. **Input Validation**: All inputs are validated using Zod schemas
6. **Session Security**: JWT tokens with httpOnly cookies

## 🔧 Configuration

### Supported USDC Tokens

**Arbitrum Bridged USDC (USDC.e):**
- Address: `0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8`
- Most commonly used
- Bridged from Ethereum

**Arbitrum Native USDC:**
- Address: `0xaf88d065e77c8cC2239327C5EDb3A432268e5831`
- Native Circle USDC
- Newer standard

Choose one in your `.env` file via `NEXT_PUBLIC_USDC_ADDRESS`.

### Confirmation Settings

Adjust `REQUIRED_CONFIRMATIONS` based on your security needs:
- 1-3 confirmations: Fast (1-2 minutes)
- 5 confirmations: Balanced (recommended)
- 10+ confirmations: Very secure (slower)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Wallet connection works
- [ ] User can view dashboard after connecting
- [ ] Deposit modal displays correct operator address
- [ ] USDC transfer initiates from wallet
- [ ] Transaction is tracked and appears in deposits
- [ ] Admin can access admin panel
- [ ] Settings can be updated
- [ ] Disclaimer modal appears on first visit

### Test on Arbitrum Testnet

To test without real funds:
1. Change chain configuration to Arbitrum Sepolia (testnet)
2. Get testnet USDC from faucets
3. Test full deposit flow

## 📝 Important Notes

### Legal Compliance

- **Disclaimers**: The app includes comprehensive risk disclosures
- **KYC/AML**: Platform supports KYC requirement (configure via admin)
- **Regulations**: Ensure compliance with local securities laws
- **Licensing**: May require licensing depending on jurisdiction

### Security Best Practices

1. **Never commit** `.env` file to version control
2. **Use hardware wallet** for operator/admin wallets
3. **Enable 2FA** on all service accounts (Alchemy, Vercel, etc.)
4. **Regular backups** of database
5. **Monitor** transaction logs for suspicious activity
6. **Implement** withdrawal approval workflow
7. **Add** rate limiting and DDoS protection

### Operational Considerations

- **NAV Updates**: Update NAV regularly via admin panel
- **Withdrawals**: Implement manual withdrawal approval process
- **Customer Support**: Set up support email/chat
- **Performance Reporting**: Provide regular performance updates
- **Liquidity**: Ensure sufficient liquidity for withdrawals

## 🐛 Troubleshooting

### Common Issues

**"Transaction verification failed"**
- Ensure transaction is on Arbitrum network
- Check that USDC token address is correct
- Verify minimum deposit amount is met
- Wait for sufficient confirmations

**"Access denied: Admin only"**
- Verify `ADMIN_WALLET_ADDRESS` in `.env` matches connected wallet
- Ensure wallet address is lowercase in environment variable

**Database connection error**
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Run `yarn prisma:generate` and `yarn prisma:migrate`

**Wallet connection issues**
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check that you're on Arbitrum network in your wallet
- Clear browser cache and reconnect

## 📦 Project Structure

```
/workspace
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── deposit/           # Deposit page
│   │   ├── deposits/          # Transaction history
│   │   ├── performance/       # Performance charts
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── providers.tsx      # Context providers
│   ├── components/            # React components
│   │   ├── DepositModal.tsx
│   │   ├── DisclaimerModal.tsx
│   │   └── Navbar.tsx
│   └── lib/                   # Utilities
│       ├── auth.ts            # Authentication
│       ├── blockchain.ts      # Blockchain interactions
│       ├── config.ts          # Configuration
│       ├── prisma.ts          # Prisma client
│       ├── utils.ts           # Helper functions
│       └── wagmi.ts           # Wagmi configuration
├── .env.example               # Environment template
├── package.json
└── README.md
```

## 🤝 Support

For issues or questions:
- Email: support@arbibot.com
- GitHub Issues: [Create an issue]
- Documentation: This README

## ⚠️ Disclaimer

This is a financial application that handles real user funds. Use at your own risk. The creators and contributors are not responsible for any financial losses. Always:

- Test thoroughly before deploying to production
- Implement proper security measures
- Comply with all applicable laws and regulations
- Provide clear risk disclosures to users
- Only accept funds you can properly manage and secure

## 📄 License

This project is provided as-is for educational and commercial purposes.

---

**Built with ❤️ using Next.js, TypeScript, and Arbitrum**
