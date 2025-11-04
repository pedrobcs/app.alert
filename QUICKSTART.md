# SafeAlert - Quick Start Guide

Get your emergency alert system running in 5 minutes!

## Prerequisites

- Node.js 18+ or Yarn installed
- A backend API endpoint (see Backend Setup below)

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
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
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
4. **Check Twilio**: Confirm the WhatsApp message is delivered via the Twilio console

## Twilio WhatsApp Setup

To deliver alerts you need a WhatsApp-enabled Twilio number (sandbox or production):

1. Sign in to the [Twilio Console](https://www.twilio.com/console)
2. Open the **Messaging → Try it out → WhatsApp Sandbox** page
3. Copy your **Account SID**, **Auth Token**, and the **WhatsApp sandbox number**
4. Paste them into `.env.local` (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`)
5. On each test device, join the sandbox by sending the provided keyword to the Twilio sandbox number

> For production senders, replace the sandbox number with your approved WhatsApp-enabled Twilio number.

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
1. Use ngrok to expose your dev server:
   ```bash
   ngrok http 3000
   ```
2. Open the ngrok URL on your mobile device
3. HTTPS is required for location access on mobile

## Troubleshooting

### Location Not Working?
- ✓ Check browser permissions
- ✓ Ensure HTTPS (or localhost)
- ✓ Check browser console for errors
- ✓ Try refreshing location manually

### API Errors?
- ✓ Verify Twilio credentials (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`)
- ✓ Ensure contacts are WhatsApp-enabled in your sandbox or approved list
- ✓ Confirm phone numbers use E.164 format (e.g., `+15551234567`)
- ✓ Check the Network tab for `/api/panic` and Twilio console logs

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

- [ ] Configure HTTPS for production
- [ ] Set up CORS properly on backend
- [ ] Test location permissions on all devices
- [ ] Verify API endpoints are secure
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
