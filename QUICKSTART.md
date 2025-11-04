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
   NEXT_PUBLIC_API_BASE_URL=https://your-ngrok-url.ngrok.io
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
4. **Check Backend**: Verify the API receives the POST request

## Backend API Setup

Your backend needs to handle POST requests to `/panic` endpoint:

### Expected Request Format

```json
POST /panic
Content-Type: application/json

{
  "contacts": ["+15085140864"],
  "message": "🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: {address}",
  "location": {
    "lat": -23.550520,
    "lng": -46.633308
  }
}
```

### Example Response

```json
{
  "success": true,
  "message": "Alert sent successfully"
}
```

### Quick Backend with ngrok

If you have a backend running on port 3001:

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3001

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Add it to .env.local as NEXT_PUBLIC_API_BASE_URL
```

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
- ✓ Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- ✓ Check backend is running
- ✓ Verify CORS is enabled on backend
- ✓ Check network tab in browser DevTools

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
