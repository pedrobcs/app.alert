# Next.js TypeScript Backend - Quick Start

Get your integrated SafeAlert backend running in **5 minutes**!

## 📦 What You Have

✅ **TypeScript Backend** - Fully typed API routes  
✅ **Next.js Integration** - No separate server needed  
✅ **Twilio WhatsApp** - Emergency messaging  
✅ **SQLite Database** - Fast local storage  
✅ **Complete API** - All endpoints ready  

## 🚀 5-Minute Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Twilio Credentials

1. Sign up: [twilio.com/try-twilio](https://www.twilio.com/try-twilio) (free)
2. Copy your **Account SID** and **Auth Token**

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
TWILIO_ACCOUNT_SID=AC...your_account_sid_here
TWILIO_AUTH_TOKEN=...your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
NEXT_PUBLIC_CONTACT_1=+15085140864
```

### 4. Join WhatsApp Sandbox

From your WhatsApp:
- Send `join <code>` to `+1 415 523 8886`
- You'll see the code in Twilio Console > Messaging > WhatsApp Sandbox

### 5. Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Test It!

### Health Check
```bash
curl http://localhost:3000/api
```

### Send Test Alert
```bash
curl -X POST http://localhost:3000/api/panic \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": ["+15085140864"],
    "message": "Test!",
    "location": { "lat": 40.7128, "lng": -74.0060 }
  }'
```

You should receive a WhatsApp message! 🎉

## 📡 API Endpoints

All at `http://localhost:3000/api/`:

- `GET /api` - Health check
- `POST /api/panic` - Send emergency alert
- `POST /api/send-alert` - Send SMS alert
- `GET /POST /api/contacts` - Manage contacts
- `GET /api/panic-events` - View history
- `POST /api/webhook/incoming` - Twilio webhook

## 📚 Full Documentation

- **Complete Guide:** `NEXTJS_BACKEND_GUIDE.md`
- **API Contract:** `API_CONTRACT.md`
- **Types:** `src/types/api.ts`

## 🔧 Common Issues

**"Twilio not configured"**
- Check `.env.local` has correct credentials
- Restart: `npm run dev`

**WhatsApp not working**
- Join sandbox: Send "join <code>" to Twilio number
- Check phone format: `+15085140864` (must start with +)

**Database errors**
- Delete `data.db` file
- Restart server (auto-recreates)

## 🎓 Key Differences from Express

| Express (JS) | Next.js (TS) |
|--------------|--------------|
| `app.post('/panic', ...)` | `export async function POST(request)` |
| `res.json(...)` | `NextResponse.json(...)` |
| Port 3001 | Same as Next.js (3000) |
| Separate server | Integrated |
| No types | Full TypeScript |

## 📁 File Structure

```
src/
├── types/api.ts              # TypeScript types
├── lib/
│   ├── database.ts           # Database operations
│   ├── twilio.ts             # Twilio client
│   └── helpers.ts            # Utilities
└── app/api/
    ├── panic/route.ts        # Emergency alerts
    ├── contacts/route.ts     # Contact management
    └── ...                   # More routes
```

## 💡 Quick Tips

1. **TypeScript autocomplete** - Import types from `@/types/api`
2. **Check console** - Detailed logs in terminal
3. **Database location** - `data.db` in project root
4. **Environment variables** - Never commit `.env.local`
5. **Frontend integration** - Already configured!

## 🚀 Next Steps

- Read `NEXTJS_BACKEND_GUIDE.md` for details
- Test all endpoints
- Add more contacts
- Deploy to Vercel

---

**Ready to use!** Your Next.js app now has a fully integrated TypeScript backend. 🎉
