# Twilio WhatsApp Setup Guide

This guide will help you set up Twilio WhatsApp messaging for the SafeAlert emergency alert system.

## Prerequisites

- A Twilio account (sign up at https://www.twilio.com/try-twilio)
- A phone number that can receive WhatsApp messages

## Step 1: Create a Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free account
3. Verify your email and phone number

## Step 2: Get Your Twilio Credentials

1. Log in to the Twilio Console: https://console.twilio.com/
2. On the dashboard, you'll find:
   - **Account SID** (looks like: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** (click to reveal)
3. Copy both values - you'll need them for the `.env.local` file

## Step 3: Set Up WhatsApp Sandbox (For Testing)

The Twilio WhatsApp Sandbox allows you to test WhatsApp messaging without business verification.

1. In the Twilio Console, navigate to:
   **Messaging** → **Try it out** → **Send a WhatsApp message**

2. You'll see a sandbox number (e.g., `+1 415 523 8886`) and a join code (e.g., `join abc-xyz`)

3. **On the phone that will receive alerts (+15085140864)**:
   - Open WhatsApp
   - Send a message to the sandbox number: `join your-code-here`
   - You should receive a confirmation message

4. The sandbox number is: `whatsapp:+14155238886` (this is the default in `.env.local`)

## Step 4: Configure Environment Variables

1. Open the `.env.local` file in your project root

2. Replace the placeholder values with your actual Twilio credentials:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_CONTACT_1=+15085140864
```

3. Save the file

## Step 5: Test the Integration

1. Start the development server:
   ```bash
   yarn dev
   ```

2. Open http://localhost:3000 in your browser

3. Wait for location permission to be granted

4. Click the red "EMERGENCY" button

5. You should receive a WhatsApp message at +15085140864 with:
   - 🚨 Emergency alert
   - Your current location (address or coordinates)

## Troubleshooting

### Error: "Twilio credentials not configured"
- Make sure `.env.local` exists and has valid credentials
- Restart the dev server after updating `.env.local`

### Error: "Failed to send messages"
- Verify your Twilio Account SID and Auth Token are correct
- Check that you've joined the sandbox on WhatsApp
- Make sure the phone number is in E.164 format (+15085140864)

### No message received
- Confirm you sent "join your-code" to the sandbox number
- Check the Twilio Console logs: https://console.twilio.com/us1/monitor/logs/messaging
- Verify the contact number in `.env.local` is correct

### Location not found
- Make sure you've granted location permissions to your browser
- Try refreshing the location using the "Refresh" button
- Check browser console for errors

## Production Setup (Optional)

For production use, you'll need a Twilio WhatsApp Business Profile:

1. In Twilio Console, go to **Messaging** → **Senders** → **WhatsApp senders**
2. Click **Create new WhatsApp sender**
3. Follow the Facebook Business Verification process
4. Once approved, update `TWILIO_WHATSAPP_NUMBER` in `.env.local` with your business number

**Note**: Production setup requires business verification and can take several days.

## Testing the API Directly

You can test the API endpoint with curl:

```bash
curl -X POST http://localhost:3000/api/panic \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": ["+15085140864"],
    "message": "🚨 EMERGÊNCIA! Preciso de ajuda! Estou em: Test Location",
    "location": {
      "lat": 42.3601,
      "lng": -71.0589
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "sentTo": ["+15085140864"]
}
```

## Rate Limits

Twilio free tier includes:
- Trial accounts can only send to verified numbers
- Upgrade to a paid account for production use

## Support

- Twilio Documentation: https://www.twilio.com/docs/whatsapp
- Twilio Support: https://support.twilio.com/
- SafeAlert Issues: Create an issue in the repository

---

**Important**: Never commit your `.env.local` file to git. It contains sensitive credentials.
