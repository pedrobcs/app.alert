# Quick Vercel Setup Guide - Fix "Twilio Configuration Missing" Error

## ✅ What I Fixed

I've updated your app to include the backend API directly in your Next.js application. Now everything runs on Vercel - no separate backend needed!

## 🚀 Changes Made

### 1. Added API Route
- **File**: `src/app/api/panic/route.ts`
- Handles emergency alerts and sends WhatsApp messages via Twilio
- Runs as a serverless function on Vercel

### 2. Updated Dependencies
- **File**: `package.json`
- Added `twilio` package for WhatsApp messaging

### 3. Updated API Client
- **File**: `src/lib/api.ts`
- Now uses local API route (`/api/panic`) if no external backend is configured
- Still supports external backends via `NEXT_PUBLIC_API_BASE_URL`

### 4. Updated Environment Configuration
- **Files**: `.env.local.example`, `.env.local`
- Clear documentation of required variables

## 📝 Next Steps for Vercel Deployment

### Step 1: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 2: Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

**Add these variables** (you already have them, but make sure they're correct):

| Variable | Value | Notes |
|----------|-------|-------|
| `TWILIO_ACCOUNT_SID` | Your Account SID | From Twilio Console |
| `TWILIO_AUTH_TOKEN` | Your Auth Token | From Twilio Console |
| `TWILIO_WHATSAPP_NUMBER` | `+14155238886` | Twilio Sandbox number |
| `NEXT_PUBLIC_CONTACT_1` | `+14155238886` | Your WhatsApp test number |

**Important**: 
- Make sure to set variables for **all environments**: Production, Preview, and Development
- Leave `NEXT_PUBLIC_API_BASE_URL` empty (or remove it) to use the local API route

### Step 3: Redeploy

After setting the variables, you MUST redeploy:

**Option A: Push a commit**
```bash
git add .
git commit -m "Add Twilio API route for emergency alerts"
git push
```

**Option B: Manual redeploy in Vercel**
1. Go to Deployments tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"

### Step 4: Test

1. Wait for deployment to complete
2. Visit your deployed URL
3. Click the emergency button
4. You should receive a WhatsApp message!

## 🔍 Troubleshooting

### Still seeing "Twilio configuration missing"?

**Checklist:**
- [ ] Did you set all 3 Twilio variables in Vercel?
- [ ] Did you set them for the correct environment (Production/Preview)?
- [ ] Did you redeploy after setting variables?
- [ ] Did you clear your browser cache?

**How to verify variables are set:**
1. Go to Vercel project settings
2. Click "Environment Variables"
3. You should see:
   - ✅ TWILIO_ACCOUNT_SID (Production, Preview, Development)
   - ✅ TWILIO_AUTH_TOKEN (Production, Preview, Development)
   - ✅ TWILIO_WHATSAPP_NUMBER (Production, Preview, Development)

### Error: "Failed to send WhatsApp message"

This means Twilio credentials are working, but message sending failed.

**Common causes:**
1. **Recipient hasn't joined WhatsApp Sandbox**
   - Send `join <your-sandbox-code>` to +1 (415) 523-8886 from your WhatsApp
   - Find your sandbox code at: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

2. **Invalid phone number format**
   - Must use E.164 format: `+14155238886` ✅
   - Not: `(415) 523-8886` ❌

3. **Sandbox expired**
   - WhatsApp sandbox expires after 3 days of inactivity
   - Re-send the join code to reactivate

### Error: "Invalid credentials" or "Authentication failed"

Your Twilio credentials are incorrect.

**Fix:**
1. Go to https://console.twilio.com
2. Copy your Account SID and Auth Token
3. Update them in Vercel environment variables
4. Redeploy

### Network error

**Check:**
1. Open browser console (F12)
2. Go to Network tab
3. Click emergency button
4. Look at the `/api/panic` request:
   - **404**: API route wasn't deployed → Redeploy
   - **500**: Check error message in response
   - **No request**: API URL might be wrong

## 🧪 Testing Locally

Before deploying to Vercel, test locally:

```bash
# 1. Copy environment variables
cp .env.local.example .env.local

# 2. Edit .env.local with your Twilio credentials
nano .env.local

# 3. Install dependencies
npm install

# 4. Run development server
npm run dev

# 5. Visit http://localhost:3000
# 6. Click emergency button
# 7. Check WhatsApp for message
```

## 📱 Twilio WhatsApp Sandbox Setup

If you haven't set up the Twilio WhatsApp Sandbox yet:

1. Go to https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Send the join code from your WhatsApp:
   ```
   join <your-sandbox-name>
   ```
   To: `+1 (415) 523-8886`
3. Wait for confirmation message
4. Now you can receive emergency alerts!

**Note**: The sandbox is free but requires users to join. For production, you'll need to apply for a WhatsApp Business Profile.

## 🎯 How It Works Now

### Before (Separate Backend):
```
Frontend (Vercel) → External Backend → Twilio → WhatsApp
```

### After (All-in-One):
```
Frontend (Vercel) → API Route (Vercel) → Twilio → WhatsApp
```

Everything runs on Vercel now! No separate backend needed.

## 📚 Additional Resources

- **Twilio Console**: https://console.twilio.com
- **Vercel Environment Variables**: https://vercel.com/docs/environment-variables
- **WhatsApp Sandbox**: https://www.twilio.com/docs/whatsapp/sandbox
- **Full Troubleshooting Guide**: See `VERCEL_DEPLOYMENT_FIX.md`

## 🆘 Still Need Help?

If you're still having issues:

1. Check Vercel deployment logs:
   - Go to your project
   - Click "Deployments"
   - Click on the latest deployment
   - Click "View Function Logs"

2. Check browser console for errors:
   - Press F12
   - Go to Console tab
   - Look for error messages

3. Test the API directly:
   ```bash
   curl -X POST https://your-app.vercel.app/api/panic \
     -H "Content-Type: application/json" \
     -d '{
       "contacts": ["+14155238886"],
       "message": "Test message",
       "location": {"lat": 37.7749, "lng": -122.4194}
     }'
   ```

---

**Summary**: 
1. ✅ Code is ready
2. ⚙️ Set environment variables in Vercel
3. 🚀 Redeploy
4. 🎉 Test your emergency button!
