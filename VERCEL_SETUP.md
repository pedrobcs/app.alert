# Vercel Environment Variables Setup Guide

## Quick Setup

Follow these steps to configure your Emergency Alert System on Vercel:

### Step 1: Add Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Production, Preview, Development |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Production, Preview, Development |
| `TWILIO_PHONE_NUMBER` | Your Twilio Phone Number (e.g., +15085140640) | Production, Preview, Development |

### Step 2: Get Your Twilio Credentials

1. Visit [Twilio Console](https://console.twilio.com/)
2. Sign up or log in
3. From the dashboard, copy:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click "View" to reveal)
4. Get a phone number:
   - Go to **Phone Numbers** → **Manage** → **Buy a number**
   - Or use your existing Twilio number
   - Format must be E.164: `+15085140640`

### Step 3: Configure in Vercel

#### Method 1: Using Vercel Dashboard (Recommended)

1. In your project's Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. For each variable:
   - Enter the **Key** (variable name)
   - Enter the **Value** (your credential)
   - Select environments: **Production**, **Preview**, and **Development**
   - Click **Save**

#### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_PHONE_NUMBER
```

### Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** in your Vercel dashboard
2. Find the latest deployment
3. Click the **⋯** menu → **Redeploy**
4. Ensure "Use existing Build Cache" is **unchecked**
5. Click **Redeploy**

Or push a new commit to trigger a deployment.

### Step 5: Test

1. Visit your deployed site
2. Add a contact (use your own phone number for testing)
3. Press the emergency button
4. You should receive an SMS!

## Troubleshooting

### Issue: "SMS service not configured"

**Solution**: Environment variables are not set or not loaded
- Double-check all three variables are added in Vercel
- Make sure they're set for "Production" environment
- Redeploy after adding variables

### Issue: Twilio API errors

**Solution**: Check your Twilio credentials
- Verify Account SID starts with "AC"
- Verify Auth Token is correct (no spaces)
- Phone number must be in E.164 format: `+1234567890`
- Ensure your Twilio account is active and funded

### Issue: Variables work locally but not on Vercel

**Solution**: Environment variable scope
- Local uses `.env.local` file
- Vercel uses dashboard settings
- Make sure to add them in both places

### Testing Twilio Credentials

You can test your credentials using curl:

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json" \
  --data-urlencode "To=+15085140640" \
  --data-urlencode "From=YOUR_TWILIO_NUMBER" \
  --data-urlencode "Body=Test message" \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN
```

## Production Checklist

Before going live:

- [ ] Added all three environment variables in Vercel
- [ ] Verified Twilio account is active
- [ ] Tested emergency button with your own number
- [ ] Added real emergency contacts
- [ ] Verified SMS delivery works
- [ ] Set up Twilio billing/credits if needed

## Security Notes

⚠️ **Important Security Tips:**

1. **Never commit credentials to Git**
   - Environment files (`.env.local`) are in `.gitignore`
   - Only use Vercel dashboard for production secrets

2. **Rotate credentials if exposed**
   - If accidentally committed, rotate immediately in Twilio console
   - Update in Vercel dashboard

3. **Use environment-specific values**
   - Use different Twilio accounts/numbers for dev/prod if needed

## Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Twilio API Documentation](https://www.twilio.com/docs/usage/api)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Support

If you're still having issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Twilio account status
4. Contact Twilio support if API issues persist
