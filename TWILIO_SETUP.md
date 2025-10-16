# Twilio WhatsApp Setup Guide

This guide will help you configure WhatsApp messaging via Twilio for the SafeAlert app.

## Prerequisites

- A Twilio account (free trial available at [twilio.com/try-twilio](https://www.twilio.com/try-twilio))
- Vercel account for deployment

## Step 1: Get Twilio Credentials

1. Sign up or log in to [Twilio Console](https://console.twilio.com/)
2. On the dashboard, find your credentials:
   - **Account SID** (e.g., `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Auth Token** (click "Show" to reveal)
3. Keep these values handy for the next step

## Step 2: Set Up WhatsApp Messaging

### For Development/Testing (Sandbox)

1. Go to [Twilio Console → Messaging](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. Click "Try it Out" → "Send a WhatsApp message"
3. You'll see a number like `+1 415 523 8886` and a join code like `join <word>`
4. **Important**: Send the join code from your WhatsApp to activate the sandbox
5. Use this number as your `TWILIO_WHATSAPP_FROM` value

### For Production

1. Request WhatsApp Business approval from Twilio
2. Follow Twilio's WhatsApp Business setup process
3. Use your approved WhatsApp Business number

## Step 3: Configure Environment Variables in Vercel

1. Go to your project on [Vercel](https://vercel.com)
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:

   | Variable Name | Value | Example |
   |--------------|-------|---------|
   | `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
   | `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
   | `TWILIO_WHATSAPP_FROM` | Your WhatsApp number | `+14155238886` |
   | `NEXT_PUBLIC_CONTACT_1` | Emergency contact number | `+15085140864` |

4. **Important**: For each variable:
   - Select all environments: Production, Preview, and Development
   - Click "Save"

5. After adding all variables, go to "Deployments"
6. Click "..." on your latest deployment → "Redeploy"
7. Wait for the redeployment to complete

## Step 4: Test the Integration

1. Visit your deployed app URL
2. Click the emergency button
3. The WhatsApp message should be sent to `+15085140864`
4. The message will say: "HELP AND MY LOCATION" with the address and Google Maps link

## Troubleshooting

### "Twilio credentials not configured" Error

This means Vercel environment variables are not set properly:

1. Check that all three Twilio variables are added in Vercel
2. Make sure they're set for all environments (Production, Preview, Development)
3. Redeploy your app after adding variables

### WhatsApp Message Not Received

1. **Sandbox Users**: Make sure you joined the sandbox by sending the join code
2. **Number Format**: Ensure contact number is in E.164 format (e.g., `+15085140864`)
3. **Twilio Balance**: Check your Twilio account has credit (free trial includes credits)

### API Route Not Found

If you get a 404 error:

1. Make sure you deployed the latest code with the `/api/panic` route
2. Clear your browser cache
3. Redeploy on Vercel

## How It Works

When you click the emergency button:

1. App gets your GPS coordinates
2. Converts coordinates to a human-readable address
3. Sends a POST request to `/api/panic` with:
   - Message: "HELP AND MY LOCATION"
   - Address from reverse geocoding
   - Google Maps link with coordinates
4. API route uses Twilio to send WhatsApp message to configured contacts

## Message Format

The WhatsApp message will look like:

```
HELP AND MY LOCATION

Address: 123 Main St, City, State, ZIP

Location: https://www.google.com/maps?q=42.123456,-71.123456
```

## Support

- **Twilio Docs**: https://www.twilio.com/docs/whatsapp
- **Twilio Support**: https://support.twilio.com/
- **Vercel Docs**: https://vercel.com/docs
