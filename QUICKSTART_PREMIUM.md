# 🚀 Quick Start Guide - Premium Multi-Chain Edition

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
yarn install
```

### 2. Generate Prisma Client
```bash
yarn prisma:generate
```

### 3. Set Up Environment Variables
Create `.env` file:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/usdc_investment"

# Arbitrum (Required)
ALCHEMY_API_KEY="your_alchemy_api_key"
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"
NEXT_PUBLIC_USDC_ADDRESS="0xFF970A61A04b1cA14834A43f5DE4533eBDDB5CC8"
ADMIN_WALLET_ADDRESS="0xYourAdminWalletAddress"
OPERATOR_WALLET_ADDRESS="0xYourOperatorWalletAddress"

# Solana (Optional - for multi-chain)
SOLANA_RPC_ENDPOINT="https://api.mainnet-beta.solana.com"

# Security
JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters_long"
NEXTAUTH_SECRET="your_nextauth_secret_key"
```

### 4. Run Database Migration
```bash
yarn prisma migrate dev --name add_multi_chain_support
```

### 5. Start Dev Server
```bash
yarn dev
```

### 6. Open in Browser
- Desktop: http://localhost:3000
- Mobile: Use your local IP (e.g., http://192.168.1.x:3000)

## 📱 Testing on Mobile

### iOS
1. Get your computer's local IP
2. Open Safari on iPhone
3. Navigate to `http://YOUR_IP:3000`

### Android
1. Get your computer's local IP
2. Open Chrome on Android
3. Navigate to `http://YOUR_IP:3000`

### Chrome DevTools
1. Open DevTools (F12)
2. Click device icon (Ctrl+Shift+M)
3. Select iPhone/Android device
4. Test responsiveness

## ⚙️ Configure Admin Settings

1. Connect with admin wallet
2. Navigate to `/admin`
3. Set:
   - Operator wallet (Arbitrum)
   - Solana wallet (optional)
   - Enable Solana deposits
   - Minimum deposit amount
   - Current NAV

## 🎨 Customize Design

### Change Colors
Edit `src/app/globals.css`:
```css
:root {
  --apple-blue: #007AFF;
  --apple-purple: #AF52DE;
  /* Change to your brand colors */
}
```

### Adjust Animations
```css
/* Speed up/slow down */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  /* Change 0.6s to your preference */
}
```

## 🔍 Verify Setup

### Checklist
- [ ] Dependencies installed
- [ ] Database connected
- [ ] Prisma client generated
- [ ] Migration run successfully
- [ ] Environment variables set
- [ ] Dev server running
- [ ] Can access landing page
- [ ] Wallet connects properly
- [ ] Mobile responsive
- [ ] Animations smooth

## 🐛 Troubleshooting

### "Module not found"
```bash
yarn install
yarn prisma:generate
```

### Database connection error
```bash
# Check DATABASE_URL
# Ensure PostgreSQL is running
yarn prisma migrate dev
```

### Wallet won't connect
```bash
# Verify NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# Clear browser cache
```

### Mobile not loading
```bash
# Use local IP instead of localhost
# Ensure same WiFi network
# Check firewall settings
```

## 🎯 Key Features to Test

### Mobile Experience
1. ✅ Smooth scrolling
2. ✅ Touch-friendly buttons (min 44px)
3. ✅ Bottom sheet modals
4. ✅ Haptic feedback (on supported devices)
5. ✅ Safe area support (notch devices)

### Multi-Chain
1. ✅ Chain selection in deposit modal
2. ✅ Arbitrum deposits
3. ✅ Solana deposits (if configured)
4. ✅ Chain badges in transaction list

### Design
1. ✅ Glass morphism cards
2. ✅ Smooth animations
3. ✅ Gradient buttons
4. ✅ Apple-style typography
5. ✅ Premium feel overall

## 📚 Next Steps

1. **Read full docs**: `PREMIUM_UPGRADE_COMPLETE.md`
2. **Test deposits**: Try both Arbitrum and Solana
3. **Customize branding**: Update colors and logo
4. **Deploy**: Use Vercel for production
5. **Monitor**: Set up analytics

## 💡 Pro Tips

### Performance
- Keep animations under 300ms
- Use `transform` and `opacity` for animations
- Enable GPU acceleration with `will-change`

### Mobile UX
- Test on real devices
- Use 16px minimum font size
- Keep CTAs above the fold
- Test landscape mode

### Accessibility
- Test with screen readers
- Verify keyboard navigation
- Check color contrast
- Support reduced motion

## 🎉 You're Ready!

Your premium, mobile-first, multi-chain investment platform is ready to go!

**Happy Building! 🚀**
