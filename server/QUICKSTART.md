# Quick Start Guide - SafeAlert Backend

Get your Twilio backend running in 5 minutes!

## 1. Install Dependencies

```bash
cd server
npm install
```

## 2. Get Twilio Credentials

1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Copy your **Account SID** and **Auth Token** from the dashboard

## 3. Set Up WhatsApp Sandbox

1. In Twilio Console: **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Send the join code to the sandbox number from your WhatsApp
   - Example: Send `join orange-dog` to `+1 415 523 8886`

## 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
TWILIO_ACCOUNT_SID=AC...your_account_sid
TWILIO_AUTH_TOKEN=...your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## 5. Start the Server

```bash
npm run dev
```

## 6. Test It!

Edit `panic-test.js` with your phone number:

```javascript
const contacts = [
  'whatsapp:+15085140864', // Your number
];
```

Run the test:

```bash
npm test
```

You should receive a WhatsApp message! 🎉

## 7. Connect to Frontend

In your main project `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

Restart your Next.js app:

```bash
npm run dev
```

## Done! ✅

Your panic alert system is now ready to use!

### Next Steps

- Read `README.md` for full API documentation
- See `TWILIO_SETUP.md` for detailed setup guide
- Check `server.js` to customize the server

### Common Issues

**Message not sent?**
- Make sure you joined the WhatsApp sandbox
- Check phone number format: `+15085140864` (with +)
- Verify Twilio credentials are correct

**Port already in use?**
- Change `PORT=3002` in `.env`
- Or kill the process: `lsof -ti:3001 | xargs kill -9`

**CORS error?**
- Check `FRONTEND_URL` matches your frontend URL
- Restart both frontend and backend

---

**Need help?** See the full documentation in `README.md`
