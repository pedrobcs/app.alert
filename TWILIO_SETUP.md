# Twilio Backend Server Setup Guide

Complete guide to setting up and running the SafeAlert Twilio backend server.

## Overview

The SafeAlert backend is a Node.js/Express server that integrates with Twilio to send emergency WhatsApp messages and SMS alerts. It includes:

- Emergency panic alert system
- Contact management
- SQLite database for tracking
- WhatsApp and SMS support
- Incoming message webhooks
- Reverse geocoding

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Twilio account ([Sign up free](https://www.twilio.com/try-twilio))

## Step 1: Install Dependencies

Navigate to the server directory and run the setup script:

```bash
cd server
./setup.sh
```

Or manually:

```bash
cd server
npm install
```

## Step 2: Get Twilio Credentials

### 2.1 Create Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email and phone number

### 2.2 Get Account Credentials

1. Log in to [Twilio Console](https://console.twilio.com/)
2. On the Dashboard, you'll see:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click to reveal)
3. Copy both values

### 2.3 Set Up WhatsApp Sandbox (For Testing)

1. In Twilio Console, go to **Messaging** > **Try it out** > **Send a WhatsApp message**
2. You'll see:
   - Sandbox number (e.g., `+1 415 523 8886`)
   - Your unique code (e.g., `join orange-dog`)
3. From your WhatsApp, send the join message to the sandbox number
4. You'll receive a confirmation

**Example:**
```
To: +1 415 523 8886
Message: join orange-dog
```

### 2.4 (Optional) Set Up SMS

For SMS functionality:

1. In Twilio Console, go to **Phone Numbers** > **Buy a Number**
2. Purchase a phone number (trial accounts get $15 credit)
3. Copy the phone number (e.g., `+15085140864`)

## Step 3: Configure Environment

Create `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Twilio Configuration
TWILIO_ACCOUNT_SID=AC...your_account_sid_here
TWILIO_AUTH_TOKEN=...your_auth_token_here

# For WhatsApp (Sandbox or Production)
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# For SMS (Optional - if you have a Twilio phone number)
TWILIO_FROM=+15085140864

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Replace `AC...your_account_sid_here` with your actual Account SID
- Replace `...your_auth_token_here` with your actual Auth Token
- For `TWILIO_WHATSAPP_FROM`, use the sandbox number from Step 2.3
- `TWILIO_FROM` is only needed if you want SMS functionality

## Step 4: Start the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

You should see:

```
╔════════════════════════════════════════════════════════╗
║  🚨 SafeAlert Backend Server                          ║
╚════════════════════════════════════════════════════════╝

✅ Server running on port 3001
🌐 Environment: development
📱 WhatsApp From: whatsapp:+14155238886
🔗 Frontend URL: http://localhost:3000

Available endpoints:
  GET    http://localhost:3001/
  POST   http://localhost:3001/panic
  ...
```

## Step 5: Test the Connection

### 5.1 Health Check

Test if the server is running:

```bash
curl http://localhost:3001/
```

Expected response:
```json
{
  "ok": true,
  "service": "SafeAlert Backend",
  "version": "1.0.0",
  "env": "development",
  "timestamp": "2024-..."
}
```

### 5.2 Test WhatsApp Message

Edit `panic-test.js` and add your phone number:

```javascript
const contacts = [
  'whatsapp:+15085140864', // Replace with your number
];
```

Run the test:

```bash
npm test
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║  🧪 Testing Panic Alert System                        ║
╚════════════════════════════════════════════════════════╝

📤 Sending to 1 contact(s)...

📱 Sending to whatsapp:+15085140864...
✅ SUCCESS - Message sent to whatsapp:+15085140864
   SID: SM...
   Status: queued

╔════════════════════════════════════════════════════════╗
║  📊 Test Summary                                      ║
╚════════════════════════════════════════════════════════╝

Total contacts: 1
✅ Successful: 1
❌ Failed: 0
```

### 5.3 Test Full Panic Alert

Send a full panic alert with location:

```bash
curl -X POST http://localhost:3001/panic \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": ["+15085140864"],
    "message": "Test alert!",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "panicEventId": 1,
  "message": "🚨 ALERTA! O ICE ACABOU DE ME PEGAR. Test alert!\n\n📍 Localização: https://maps.google.com/?q=40.7128,-74.0060",
  "results": [
    {
      "phone": "+15085140864",
      "status": "sent",
      "sid": "SM..."
    }
  ],
  "summary": {
    "total": 1,
    "sent": 1,
    "failed": 0
  }
}
```

## Step 6: Connect to Frontend

Update your frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Restart your Next.js frontend:

```bash
# In the main project directory (not /server)
npm run dev
```

Now the frontend can send panic alerts through the backend!

## Step 7: (Optional) Set Up Webhooks

To handle incoming messages (opt-in/opt-out), you need to expose your server publicly.

### Using ngrok (Recommended for Testing)

1. Install ngrok: [https://ngrok.com/download](https://ngrok.com/download)

2. Start your server:
   ```bash
   npm start
   ```

3. In a new terminal, run ngrok:
   ```bash
   ngrok http 3001
   ```

4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

5. Configure in Twilio Console:
   - Go to **Messaging** > **Try it out** > **Send a WhatsApp message**
   - Click **Sandbox settings**
   - Set **"WHEN A MESSAGE COMES IN"** to:
     ```
     https://abc123.ngrok.io/webhook/incoming
     ```
   - Save

6. Test by sending "join" to your WhatsApp sandbox number
   - You should receive an opt-in confirmation message

### Using a Production Server

For production, deploy to:
- Heroku
- Railway
- DigitalOcean
- AWS
- Your own VPS

Then use your production URL in the Twilio webhook configuration.

## Troubleshooting

### Error: "Invalid credentials"

**Problem:** Twilio credentials are incorrect or not set.

**Solution:**
1. Check `.env` file
2. Verify Account SID starts with `AC`
3. Verify Auth Token is correct (no extra spaces)
4. Restart the server after changing `.env`

### Error: "Message not sent"

**Problem:** Recipient can't receive messages.

**Solutions:**
1. **For WhatsApp:**
   - Make sure recipient sent "join <code>" to sandbox
   - Check phone number format: `+15085140864` (E.164)
   - Verify sandbox is still active

2. **For SMS:**
   - Make sure you have a Twilio phone number
   - Check `TWILIO_FROM` in `.env`
   - Verify recipient number is verified (trial accounts)

### Error: "CORS blocked"

**Problem:** Frontend can't connect to backend.

**Solution:**
1. Check `FRONTEND_URL` in `.env` matches your frontend URL
2. Restart backend server
3. Clear browser cache

### Error: "EADDRINUSE: address already in use"

**Problem:** Port 3001 is already in use.

**Solution:**
1. Stop the other process using the port:
   ```bash
   # On Mac/Linux
   lsof -ti:3001 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3001
   taskkill /PID <pid> /F
   ```

2. Or change the port in `.env`:
   ```env
   PORT=3002
   ```

### Database Issues

**Problem:** "Database locked" or "unable to open database file"

**Solution:**
1. Close all connections to `data.db`
2. Delete `data.db` (it will be recreated):
   ```bash
   rm data.db
   ```
3. Restart the server

## Phone Number Format

All phone numbers must be in **E.164 format**:

✅ **Correct:**
- `+15085140864` (USA)
- `+5511987654321` (Brazil)
- `+442071234567` (UK)

❌ **Incorrect:**
- `(508) 514-0864`
- `+1 508-514-0864`
- `15085140864` (missing +)

## Production Checklist

Before deploying to production:

- [ ] Use production WhatsApp number (not sandbox)
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use HTTPS for all endpoints
- [ ] Set up proper CORS with production frontend URL
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Back up database regularly
- [ ] Use environment variables for all secrets
- [ ] Test webhook configuration
- [ ] Verify all contacts can receive messages

## API Documentation

See `server/README.md` for complete API documentation.

## Support

- **Twilio Documentation:** [https://www.twilio.com/docs](https://www.twilio.com/docs)
- **Twilio Console:** [https://console.twilio.com](https://console.twilio.com)
- **Project Issues:** [GitHub Issues](https://github.com/yourusername/safealert/issues)

## Next Steps

1. ✅ Server is running
2. ✅ Twilio is connected
3. ✅ Test messages work
4. 📱 Connect your frontend
5. 👥 Add emergency contacts
6. 🚀 Deploy to production

---

**Questions?** Check the `server/README.md` or open an issue on GitHub.
