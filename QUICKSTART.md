# SafeAlert - Quick Start Guide

Get your emergency alert system running in 5 minutes!

## Prerequisites

- Node.js 18+ or Yarn installed
- Twilio WhatsApp Sandbox credentials (and joined phone numbers)

## Step 1: Install Dependencies

```bash
yarn install
```

## Step 2: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your configuration:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   TWILIO_WHATSAPP_TO=whatsapp:+55XXXXXXXXXXX
   TWILIO_WHATSAPP_TEST_TO=whatsapp:+15085140864
   NEXT_PUBLIC_CONTACT_1=+15085140864
   ```

## Step 3: Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test the App

1. **Allow Location Access**: The browser will ask for location permission
2. **Wait for Location**: The status card will show your coordinates
3. **Test Emergency Button**: Click the red emergency button
4. **Check API Logs**: Inspect the browser network tab or Vercel function logs for `/api/panic`

## WhatsApp Sandbox Setup

1. Activate the Twilio WhatsApp Sandbox and note the join code.
2. From each test phone, send the join message (e.g., `join your-code`) to `+1 415 523 8886` on WhatsApp.
3. Confirm the numbers listed in `.env.local` have joined the sandbox.
4. Deploy to Vercel (or run locally) and click either emergency button to send WhatsApp messages via `/api/panic`.

## Building for Production

```bash
# Build the app
yarn build

# Start production server
yarn start
```

## Installing as PWA

### On Mobile (iOS)
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### On Mobile (Android)
1. Open in Chrome
2. Tap menu (three dots)
3. Select "Install app" or "Add to Home Screen"

### On Desktop
1. Look for install icon in address bar
2. Click to install
3. App opens in standalone window

## Testing Location Features

### Desktop Testing
- Chrome: Settings → Privacy and Security → Site Settings → Location
- Allow location access for localhost

### Mobile Testing
1. Access your local dev machine via LAN IP (e.g., http://192.168.x.x:3000) or use a deployed Vercel preview.
2. Open the URL on your mobile device.
3. HTTPS (or localhost) is required for location access on mobile.

## Troubleshooting

### Location Not Working?
- ✓ Check browser permissions
- ✓ Ensure HTTPS (or localhost)
- ✓ Check browser console for errors
- ✓ Try refreshing location manually

### API Errors?
- ✓ Verify Twilio credentials are set in `.env.local` or Vercel
- ✓ Confirm your phone numbers joined the Twilio Sandbox
- ✓ Check Twilio console logs for delivery errors
- ✓ Check network tab in browser DevTools and Vercel function logs

### PWA Not Installing?
- ✓ Must use HTTPS (production)
- ✓ Check manifest.json is accessible
- ✓ Verify icon files exist
- ✓ Clear cache and retry

## Next Steps

1. **Customize the UI**: Edit `src/app/page.tsx`
2. **Add More Contacts**: Update `.env.local`
3. **Change Message**: Edit `src/hooks/useEmergencyAlert.ts`
4. **Create Custom Icons**: Replace `public/icon-*.png`
5. **Deploy to Production**: See README.md for deployment options

## Security Checklist

- [ ] Configure HTTPS for production (Vercel handles automatically)
- [ ] Protect Twilio credentials via environment variables
- [ ] Test location permissions on all devices
- [ ] Verify `/api/panic` handles invalid input safely
- [ ] Test emergency flow end-to-end
- [ ] Add error monitoring (Sentry, etc.)

## Need Help?

- Check the full README.md for detailed documentation
- Review the code comments in each file
- Open an issue on the repository
- Test in browser DevTools console

---

**Ready to go!** Your emergency alert system is now set up and ready for testing.

Remember: This is a supplementary communication tool. Always call local emergency services for life-threatening situations.
