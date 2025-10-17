# How to Set Environment Variables in Vercel

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
- Open: https://vercel.com/dashboard
- Click on your project

### 2. Navigate to Environment Variables
- Click "Settings" in the top menu
- Click "Environment Variables" in the left sidebar

### 3. Add Each Variable

You need to add **3 environment variables**. For each one:

#### Variable 1: TWILIO_ACCOUNT_SID
- Click "Add New"
- **Key**: `TWILIO_ACCOUNT_SID`
- **Value**: Your Account SID from Twilio (starts with "AC")
  - Get it from: https://console.twilio.com (main dashboard)
- **Environment**: Select all (Production, Preview, Development)
- Click "Save"

#### Variable 2: TWILIO_AUTH_TOKEN
- Click "Add New"
- **Key**: `TWILIO_AUTH_TOKEN`
- **Value**: Your Auth Token from Twilio
  - Get it from: https://console.twilio.com (main dashboard, click "Show" to reveal)
- **Environment**: Select all (Production, Preview, Development)
- Click "Save"

#### Variable 3: TWILIO_WHATSAPP_NUMBER
- Click "Add New"
- **Key**: `TWILIO_WHATSAPP_NUMBER`
- **Value**: `+14155238886`
  - For Sandbox, this is always +14155238886
  - For Production, use your approved WhatsApp Business number
- **Environment**: Select all (Production, Preview, Development)
- Click "Save"

### 4. IMPORTANT: Redeploy After Adding Variables

⚠️ **Environment variables are NOT applied to existing deployments!**

You MUST redeploy:
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Click the "..." menu (three dots)
4. Click "Redeploy"
5. Wait for the new deployment to finish

### 5. Test the Debug Endpoint

After redeploying, visit:
```
https://your-app.vercel.app/api/debug
```

You should see:
```json
{
  "environment": "production",
  "variables": {
    "TWILIO_ACCOUNT_SID": "AC12...5678",
    "TWILIO_AUTH_TOKEN": "✅ SET (hidden)",
    "TWILIO_WHATSAPP_NUMBER": "+14155238886"
  }
}
```

If you see "❌ NOT SET" for any variable, it means the variable wasn't loaded. Make sure you redeployed!

## Common Mistakes

### ❌ Wrong Key Names
Make sure you type the keys EXACTLY as shown (case-sensitive):
- `TWILIO_ACCOUNT_SID` (not Twilio_Account_Sid or twilio_account_sid)
- `TWILIO_AUTH_TOKEN` (not Twilio_Auth_Token)
- `TWILIO_WHATSAPP_NUMBER` (not Twilio_WhatsApp_Number)

### ❌ Wrong Phone Number Format
- ✅ Correct: `+14155238886`
- ❌ Wrong: `whatsapp:+14155238886`
- ❌ Wrong: `14155238886`

### ❌ Not Redeploying
Environment variables are ONLY applied to NEW deployments. You MUST redeploy after adding/changing variables!

### ❌ Wrong Environment Selected
Make sure you select all three environments (Production, Preview, Development) when adding each variable.

## Verification Checklist

- [ ] All 3 variables added in Vercel
- [ ] All variables have correct key names (case-sensitive)
- [ ] All variables set for Production environment
- [ ] Redeployed after adding variables
- [ ] Tested `/api/debug` endpoint - shows all variables as SET
- [ ] Tested the emergency button

## Where to Get Your Twilio Credentials

### Account SID & Auth Token:
1. Go to: https://console.twilio.com
2. Look at the main dashboard
3. You'll see "Account SID" and "Auth Token"
4. Click "Show" to reveal the Auth Token

### WhatsApp Sandbox Number:
- For testing: Always use `+14155238886`
- This is Twilio's WhatsApp Sandbox number

## Still Getting "Messaging service not configured"?

If you followed all steps and still get this error:

1. **Check the debug endpoint**: https://your-app.vercel.app/api/debug
2. **Take a screenshot** of the Vercel Environment Variables page
3. **Check Vercel function logs**:
   - Go to Deployments → Click latest → View Function Logs
   - Look for the "Environment check" log entry
4. **Share the specific error message** you're seeing now (it should tell you which variable is missing)

The error message now tells you EXACTLY which variable is missing!
