# Twilio WhatsApp Integration Setup Guide

This guide explains how to set up and use the Twilio WhatsApp messaging integration that has been added to your Next.js application.

## What's Been Implemented

Your application now includes:

1. **Two API Routes:**
   - `/api/send-message` - Send WhatsApp messages to a single recipient
   - `/api/panic` - Send emergency alerts to multiple contacts (used by the main app)

2. **Two Frontend Pages:**
   - `/` - Main emergency alert system (existing, now uses Twilio)
   - `/whatsapp-test` - Test page for sending individual WhatsApp messages

## Setup Instructions

### Step 1: Configure Twilio Credentials

1. Get your Twilio credentials from [Twilio Console](https://www.twilio.com/console):
   - Account SID
   - Auth Token
   - WhatsApp-enabled phone number

2. Open the `.env.local` file in the root of your project and update it with your credentials:

```env
TWILIO_ACCOUNT_SID=your_actual_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Important:** 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- For production deployment (Vercel), add these as Environment Variables in your dashboard

### Step 2: WhatsApp Sandbox Setup (for Testing)

If you're using Twilio's WhatsApp Sandbox:

1. Go to [Twilio Console > Messaging > Try it out > Send a WhatsApp message](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. Send a message with the join code to the sandbox number from your WhatsApp
3. Recipients must do the same to receive messages

Example: Send `join <your-sandbox-keyword>` to `+1 415 523 8886`

### Step 3: Test Locally

1. Install dependencies (already done):
```bash
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Test the integration:
   - Visit `http://localhost:3000/whatsapp-test` to send a test message
   - Visit `http://localhost:3000` to use the main emergency alert system

### Step 4: Deploy to Vercel

1. Push your code to GitHub

2. Import your repository in [Vercel](https://vercel.com)

3. Add Environment Variables in Vercel dashboard:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`

4. Deploy! Your app will be live with serverless API routes handling the backend.

## API Endpoints

### POST /api/send-message

Send a single WhatsApp message.

**Request Body:**
```json
{
  "toNumber": "+1234567890",
  "message": "Hello from Next.js!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "sid": "SM...",
  "status": "queued"
}
```

**Response (Error):**
```json
{
  "error": "Failed to send message",
  "details": "Error message here"
}
```

### POST /api/panic

Send emergency alert to multiple contacts (used by the main app).

**Request Body:**
```json
{
  "contacts": ["+1234567890", "+0987654321"],
  "message": "🚨 EMERGENCY ALERT! I need help immediately!",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Emergency alert sent successfully to 2 contacts",
  "sentCount": 2,
  "totalCount": 2
}
```

## Production Setup

For production use with WhatsApp:

1. **Apply for WhatsApp Business Account:**
   - Go to [Twilio Console > Messaging > Senders > WhatsApp senders](https://console.twilio.com/us1/develop/sms/senders/whatsapp)
   - Follow the process to get a WhatsApp-approved Business Profile
   - This is required for production use (sandbox is for testing only)

2. **Update your `.env.local` with your production number:**
```env
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

3. **Configure Emergency Contacts:**
   - Edit `src/app/page.tsx`
   - Update the `EMERGENCY_CONTACTS` array
   - Or set via environment variable: `NEXT_PUBLIC_CONTACT_1`

## File Structure

```
/workspace/
├── .env.local                          # Twilio credentials (not in git)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── send-message/
│   │   │   │   └── route.ts           # Single message API
│   │   │   └── panic/
│   │   │       └── route.ts           # Emergency alert API
│   │   ├── whatsapp-test/
│   │   │   └── page.tsx               # Test page for WhatsApp
│   │   └── page.tsx                   # Main emergency alert page
│   └── lib/
│       └── api.ts                     # Updated to use local API
└── TWILIO_SETUP.md                    # This file
```

## Troubleshooting

### "Server configuration error"
- Check that your `.env.local` file exists and contains all required variables
- Restart your dev server after updating environment variables

### "Failed to send message"
- Verify your Twilio credentials are correct
- Check that your Twilio account has sufficient balance
- For sandbox: Ensure recipient has joined your sandbox
- Check browser console and terminal for detailed error messages

### Messages not received
- Verify the recipient's phone number format (must include country code)
- Check Twilio Console > Messaging > Logs for delivery status
- For sandbox: Recipient must opt-in first by sending the join code

## Security Notes

- ✅ Secrets are stored server-side only (never exposed to frontend)
- ✅ `.env.local` is in `.gitignore`
- ✅ API routes run serverless (no exposed server to maintain)
- ✅ All API calls are validated for required parameters

## Next Steps

1. **Update Emergency Contacts:** Edit `src/app/page.tsx` to set your real emergency contacts
2. **Customize Messages:** Modify the emergency message template in `src/hooks/useEmergencyAlert.ts`
3. **Add Rate Limiting:** Consider adding rate limiting to prevent abuse
4. **Add Authentication:** For production, consider adding user authentication
5. **Monitor Usage:** Check your Twilio usage in the console to avoid unexpected charges

## Support

- [Twilio WhatsApp Documentation](https://www.twilio.com/docs/whatsapp)
- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Deployment Documentation](https://vercel.com/docs)
