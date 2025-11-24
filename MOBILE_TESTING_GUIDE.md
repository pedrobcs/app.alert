# Mobile Testing Guide 📱

## Quick Mobile Testing Setup

### Using Your Smartphone

#### 1. **Expose Local Development Server**

**Option A: Using Tailscale (Recommended)**
```bash
# Install Tailscale on your dev machine and phone
# Your dev server will be accessible at: http://100.x.x.x:3000
```

**Option B: Using ngrok**
```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
yarn dev

# In another terminal, expose it
ngrok http 3000

# Use the https URL provided by ngrok on your phone
```

**Option C: Same Network**
```bash
# Find your local IP
# Mac/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows:
ipconfig

# Access via: http://YOUR_IP:3000
```

#### 2. **Mobile Wallet Setup**

**For Testing Arbitrum:**
- Install MetaMask mobile app
- Import test wallet or create new one
- Add Arbitrum network
- Get test USDC from faucet

**For Testing Solana:**
- Install Phantom mobile app
- Create/import wallet
- Get devnet SOL and USDC for testing

### Browser DevTools Mobile Emulation

Chrome DevTools:
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device (iPhone 14 Pro, Pixel 7, etc.)
4. Test touch events
5. Throttle network to simulate 3G/4G

### Real Device Testing Checklist

#### Visual Design
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Buttons are at least 44x44px
- [ ] Safe area insets respected (iPhone notch)
- [ ] Landscape mode works correctly

#### Touch Interactions
- [ ] All buttons respond to touch
- [ ] No double-tap to zoom on buttons
- [ ] Swipe gestures work smoothly
- [ ] Modal slides up from bottom
- [ ] Pull-to-refresh disabled (if needed)

#### Performance
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts
- [ ] Fast initial load (<3s)
- [ ] Wallet connects quickly

#### Wallet Integration
- [ ] MetaMask opens correctly
- [ ] Phantom opens correctly
- [ ] WalletConnect QR code works
- [ ] Transaction signing works
- [ ] Network switching works

## Common Mobile Issues & Fixes

### Issue: Modal doesn't open on mobile
**Fix:** Check z-index and touch-action CSS properties

### Issue: Wallet doesn't connect
**Fix:** Ensure proper deep linking configured:
```typescript
// In your wallet config
enableMobileDeepLinks: true
```

### Issue: Animations are janky
**Fix:** Use transform and opacity only:
```css
/* Good */
transform: translateY(0);
opacity: 1;

/* Bad - causes repaints */
top: 0;
visibility: visible;
```

### Issue: Text too small
**Fix:** Use relative units:
```css
/* Good */
font-size: 1rem; /* 16px base */

/* Bad */
font-size: 12px;
```

## Testing Different Scenarios

### 1. Slow Network
```javascript
// In Chrome DevTools
// Network tab → Throttling → Slow 3G
```

### 2. Different Screen Sizes
```javascript
// Test these viewports:
- iPhone SE (375x667)
- iPhone 14 Pro (393x852)
- iPhone 14 Pro Max (430x932)
- Pixel 7 (412x915)
- iPad Air (820x1180)
```

### 3. Different Orientations
- Portrait
- Landscape
- Rotation during transaction

### 4. Interruptions
- Incoming call during transaction
- App switcher
- Background/foreground
- Screen lock

## Performance Metrics to Monitor

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Mobile-Specific
- **Time to Interactive**: < 3.8s on 4G
- **Touch responsiveness**: < 50ms
- **Scroll performance**: 60fps
- **Memory usage**: < 100MB

## Accessibility Testing

### Mobile Accessibility
- [ ] Screen reader support (VoiceOver/TalkBack)
- [ ] Text scaling (up to 200%)
- [ ] Color contrast (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] Tap targets properly labeled

## PWA Testing

### Installation
- [ ] Add to Home Screen works
- [ ] Icon appears correctly
- [ ] Splash screen shows
- [ ] Opens fullscreen

### Offline
- [ ] Graceful offline handling
- [ ] Service worker caching
- [ ] Offline indicator

## Browser Compatibility

### iOS Safari
- Version 15+
- WebKit issues
- Date picker behavior
- File upload

### Android Chrome
- Version 100+
- Chromium-based
- Web3 injection

### In-App Browsers
- Instagram
- Twitter/X
- Facebook
- Discord

## Tools & Resources

### Testing Tools
- [BrowserStack](https://browserstack.com) - Real device cloud
- [Sauce Labs](https://saucelabs.com) - Automated testing
- [LambdaTest](https://lambdatest.com) - Cross-browser testing

### Performance Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://webpagetest.org)
- [GTmetrix](https://gtmetrix.com)

### Debugging
- Safari Web Inspector (iOS)
- Chrome Remote Debugging (Android)
- [Eruda](https://github.com/liriliri/eruda) - Console on mobile

## Quick Test Script

Run this on your phone's browser console:

```javascript
// Test touch responsiveness
console.log('Touch support:', 'ontouchstart' in window);

// Test viewport
console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);

// Test Web3
console.log('Ethereum:', typeof window.ethereum);
console.log('Solana:', typeof window.solana);

// Test performance
console.log('Connection:', navigator.connection?.effectiveType);
console.log('Memory:', navigator.deviceMemory, 'GB');
```

## Deployment Notes

### Before Going Live
1. Test on multiple real devices
2. Check all wallet integrations
3. Verify RPC endpoints are accessible
4. Test with real (small) amounts
5. Monitor error rates
6. Set up analytics
7. Configure CSP headers
8. Enable HTTPS
9. Test deep links
10. Verify push notifications

---

**Happy Testing! 🧪**
