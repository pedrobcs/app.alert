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

2. Edit `.env.local` and add your UltraMsg configuration:
   ```env
   # Get these from https://ultramsg.com
   ULTRAMSG_TOKEN=your_token_here
   ULTRAMSG_INSTANCE_ID=your_instance_id_here
   ```

   The default values will work for testing, but for production use, get your own credentials from UltraMsg.

## Step 3: Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Test the App

1. **Allow Location Access**: The browser will ask for location permission
2. **Wait for Location**: The status card will show your coordinates
3. **Enter WhatsApp Number**: Add a WhatsApp number (with country code) in the input field
4. **Test Emergency Button**: Click the red emergency button
5. **Check WhatsApp**: The alert message should be sent to the entered WhatsApp number

## How It Works

The app now uses **UltraMsg API** to send WhatsApp messages directly:

1. User enters their WhatsApp number
2. Location is retrieved using GPS
3. When the emergency button is clicked, the app:
   - Gets the current address from coordinates
   - Sends a message via UltraMsg API to the entered WhatsApp number
   - Includes the location in the message

No external backend is required! The Next.js API route handles everything internally.

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
- ✓ Verify UltraMsg credentials are correct in `.env.local`
- ✓ Check WhatsApp number format (include country code)
- ✓ Ensure you have a valid UltraMsg account
- ✓ Check network tab in browser DevTools

### PWA Not Installing?
- ✓ Must use HTTPS (production)
- ✓ Check manifest.json is accessible
- ✓ Verify icon files exist
- ✓ Clear cache and retry

## Next Steps

1. **Get UltraMsg Account**: Sign up at https://ultramsg.com for your own credentials
2. **Customize the UI**: Edit `src/app/page.tsx`
3. **Change Message Template**: Edit `src/hooks/useEmergencyAlert.ts`
4. **Create Custom Icons**: Replace `public/icon-*.png`
5. **Deploy to Production**: See DEPLOYMENT.md for deployment options

## Security Checklist

- [ ] Configure HTTPS for production
- [ ] Get your own UltraMsg credentials (don't use defaults)
- [ ] Test location permissions on all devices
- [ ] Verify WhatsApp number format
- [ ] Test emergency flow end-to-end
- [ ] Add error monitoring (Sentry, etc.)
- [ ] Keep UltraMsg credentials secure (never commit to git)

## Need Help?

- Check the full README.md for detailed documentation
- Review the code comments in each file
- Open an issue on the repository
- Test in browser DevTools console

---

**Ready to go!** Your emergency alert system is now set up and ready for testing.

Remember: This is a supplementary communication tool. Always call local emergency services for life-threatening situations.
