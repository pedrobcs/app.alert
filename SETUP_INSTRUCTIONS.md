# SafeAlert - Complete Setup Instructions

Your Twilio WhatsApp backend is now fully integrated! Follow these steps to get it working.

## 🎉 What's Been Built

✅ **Backend API Endpoint**: `/api/panic` - Fully integrated Next.js API route  
✅ **Twilio Integration**: Complete WhatsApp messaging via Twilio SDK  
✅ **Frontend Connection**: Button click triggers WhatsApp message  
✅ **Error Handling**: Comprehensive validation and error messages  
✅ **Environment Configuration**: Secure credential management  

## 📋 Quick Start (5 Minutes)

### Step 1: Get Twilio Credentials

1. **Sign up for Twilio** (if you haven't already):
   - Go to: https://www.twilio.com/try-twilio
   - Create a free account
   - Verify your email and phone

2. **Get your credentials**:
   - Open: https://console.twilio.com/
   - Find your **Account SID** (starts with `AC...`)
   - Click to reveal your **Auth Token**
   - Copy both values

### Step 2: Join WhatsApp Sandbox

The sandbox lets you test WhatsApp without business verification.

1. **Find your sandbox**:
   - In Twilio Console: **Messaging** → **Try it out** → **Send a WhatsApp message**
   - You'll see a sandbox number like `+1 415 523 8886`
   - You'll see a join code like `join abc-xyz`

2. **Join on WhatsApp**:
   - Open WhatsApp on your phone (+15085140864)
   - Send a message to the Twilio sandbox number: `join your-code-here`
   - Wait for confirmation (you should receive a welcome message)

### Step 3: Configure Environment Variables

1. **Edit `.env.local`** in the project root:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_CONTACT_1=+15085140864
```

2. **Replace the values**:
   - `TWILIO_ACCOUNT_SID`: Your Account SID from Step 1
   - `TWILIO_AUTH_TOKEN`: Your Auth Token from Step 1
   - `TWILIO_WHATSAPP_NUMBER`: Keep as `whatsapp:+14155238886` (sandbox)
   - `NEXT_PUBLIC_CONTACT_1`: Keep as `+15085140864` (or change to your number)

### Step 4: Run the Application

1. **Start the dev server**:
   ```bash
   yarn dev
   ```

2. **Open in browser**:
   - Navigate to: http://localhost:3000
   - Allow location permissions when prompted

3. **Test the emergency button**:
   - Wait for location to load (shows green status)
   - Click the big red **EMERGENCY** button
   - Check your WhatsApp (+15085140864) for the message!

## ✅ Expected Result

When you click the emergency button, you should receive a WhatsApp message like:

```
🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: 
123 Main Street, City, State, Country

or

🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: 
42.360100, -71.058900
```

## 🔧 Technical Details

### API Endpoint

**URL**: `http://localhost:3000/api/panic` (or your production domain)

**Method**: POST

**Request Body**:
```json
{
  "contacts": ["+15085140864"],
  "message": "🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: [location]",
  "location": {
    "lat": 42.3601,
    "lng": -71.0589
  }
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "sentTo": ["+15085140864"]
}
```

### File Structure

```
/workspace/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── panic/
│   │   │       └── route.ts          # ← Twilio backend API
│   │   ├── page.tsx                   # ← Frontend with button
│   │   └── ...
│   ├── lib/
│   │   └── api.ts                     # ← API client
│   └── hooks/
│       └── useEmergencyAlert.ts       # ← Alert hook
├── .env.local                          # ← Your Twilio credentials
└── package.json                        # ← Includes twilio SDK
```

## 🐛 Troubleshooting

### "Twilio credentials not configured"
- **Fix**: Update `.env.local` with your actual credentials
- **Restart**: Stop and restart the dev server (`Ctrl+C`, then `yarn dev`)

### "Failed to send messages"
- **Check**: Did you join the sandbox on WhatsApp?
- **Verify**: Are credentials correct in `.env.local`?
- **Test**: Try the API directly with curl (see below)

### No WhatsApp message received
1. Confirm you sent "join your-code" to Twilio sandbox
2. Check Twilio Console logs: https://console.twilio.com/us1/monitor/logs/messaging
3. Verify phone number format: `+15085140864` (with + and country code)

### Location not working
- **Grant permissions**: Allow location access in browser settings
- **Try refresh**: Click the "Refresh" button in the status card
- **Check console**: Open browser DevTools for error messages

## 🧪 Testing the API Directly

Test the backend without the frontend:

```bash
curl -X POST http://localhost:3000/api/panic \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": ["+15085140864"],
    "message": "🚨 TEST ALERT from curl",
    "location": {
      "lat": 42.3601,
      "lng": -71.0589
    }
  }'
```

Expected output:
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "sentTo": ["+15085140864"]
}
```

## 📱 Adding More Contacts

Edit `.env.local` to add more emergency contacts:

```env
NEXT_PUBLIC_CONTACT_1=+15085140864
NEXT_PUBLIC_CONTACT_2=+15551234567
NEXT_PUBLIC_CONTACT_3=+15559876543
```

Then update `src/app/page.tsx`:

```typescript
const EMERGENCY_CONTACTS = [
  process.env.NEXT_PUBLIC_CONTACT_1 || "+15085140864",
  process.env.NEXT_PUBLIC_CONTACT_2,
  process.env.NEXT_PUBLIC_CONTACT_3,
].filter(Boolean); // Remove undefined values
```

## 🚀 Production Deployment

For production use:

1. **Get WhatsApp Business Profile** (optional but recommended):
   - Requires Facebook Business Verification
   - Can take several days to approve
   - Follow: https://www.twilio.com/docs/whatsapp/tutorial/connect-number-business-profile

2. **Set environment variables** on your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Add: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, etc.

3. **Deploy**:
   ```bash
   yarn build
   yarn start
   ```

## 📚 Additional Resources

- **Twilio Setup Guide**: See `TWILIO_SETUP.md`
- **API Contract**: See `API_CONTRACT.md`
- **Main README**: See `README.md`
- **Twilio Docs**: https://www.twilio.com/docs/whatsapp

## 🔐 Security Notes

- ✅ `.env.local` is in `.gitignore` (credentials won't be committed)
- ✅ API validates all inputs (phone numbers, coordinates, message)
- ✅ Error messages don't expose sensitive data
- ⚠️ For production, consider adding authentication
- ⚠️ Consider rate limiting for production use

## ✨ You're All Set!

Your backend is ready! When you click the emergency button:

1. Frontend gets your GPS location
2. Sends request to `/api/panic`
3. Backend validates the request
4. Twilio sends WhatsApp message
5. You receive alert at +15085140864

**Next Step**: Update your Twilio credentials in `.env.local` and test it! 🚀
