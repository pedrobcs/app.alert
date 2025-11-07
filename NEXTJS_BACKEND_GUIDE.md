# Next.js TypeScript Backend - Complete Guide

Your SafeAlert app now has a **fully integrated TypeScript backend** using Next.js API routes! No separate Express server needed.

## 🎉 What Was Created

### TypeScript Backend Structure

```
/workspace/src/
├── types/
│   └── api.ts                    # Complete TypeScript types
├── lib/
│   ├── database.ts               # SQLite database utilities
│   ├── twilio.ts                 # Twilio client & helpers
│   └── helpers.ts                # Geocoding & validation
└── app/api/
    ├── route.ts                  # GET /api (health check)
    ├── panic/
    │   └── route.ts              # POST /api/panic (emergency alert)
    ├── send-alert/
    │   └── route.ts              # POST /api/send-alert (SMS)
    ├── contacts/
    │   ├── route.ts              # GET/POST /api/contacts
    │   └── [id]/
    │       └── route.ts          # GET/PUT/DELETE /api/contacts/:id
    ├── panic-events/
    │   ├── route.ts              # GET /api/panic-events
    │   └── [id]/
    │       └── route.ts          # GET /api/panic-events/:id
    └── webhook/
        └── incoming/
            └── route.ts          # POST /api/webhook/incoming
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

This will install:
- `twilio` - WhatsApp & SMS messaging
- `better-sqlite3` - Fast SQLite database
- `@types/better-sqlite3` - TypeScript types

### 2. Configure Environment

Create `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Twilio Credentials (required)
TWILIO_ACCOUNT_SID=AC...your_account_sid
TWILIO_AUTH_TOKEN=...your_auth_token

# WhatsApp Sender (Twilio Sandbox)
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# SMS Sender (Optional - if you have Twilio phone number)
# TWILIO_FROM=+15085140864

# Emergency Contacts
NEXT_PUBLIC_CONTACT_1=+15085140864
```

**Get Twilio credentials:**
1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Copy Account SID and Auth Token from dashboard
3. Set up WhatsApp Sandbox (see below)

### 3. Start the App

```bash
npm run dev
```

The app runs on `http://localhost:3000` with backend API at `http://localhost:3000/api`

### 4. Test the Backend

**Health Check:**
```bash
curl http://localhost:3000/api
```

**Create Contact:**
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Contact",
    "phone": "+15085140864",
    "opt_in": true
  }'
```

**Send Panic Alert:**
```bash
curl -X POST http://localhost:3000/api/panic \
  -H "Content-Type: application/json" \
  -d '{
    "contacts": ["+15085140864"],
    "message": "Test alert",
    "location": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  }'
```

## 📡 API Endpoints

### Health Check
```typescript
GET /api
Response: { ok: true, service: "SafeAlert Backend", version: "1.0.0", ... }
```

### Emergency Panic Alert
```typescript
POST /api/panic
Body: {
  contacts?: string[];      // Phone numbers in E.164 format
  contactIds?: number[];    // Contact IDs from database
  message?: string;         // Custom message
  location?: { lat: number; lng: number; };
}
Response: {
  success: boolean;
  panicEventId: number;
  message: string;
  results: Array<{ phone, status, sid?, error? }>;
  summary: { total, sent, failed };
}
```

### SMS Alert (PWA)
```typescript
POST /api/send-alert
Body: {
  contacts: Array<{ name?, phone, message? }>;
  lat: number;
  lon: number;
}
Response: {
  ok: boolean;
  results: Array<{ to, status, sid?, error? }>;
  address: string;
  lat: number;
  lon: number;
}
```

### Contacts Management

**List Contacts:**
```typescript
GET /api/contacts
Response: { contacts: Contact[] }
```

**Create Contact:**
```typescript
POST /api/contacts
Body: { name?: string; phone: string; opt_in?: boolean; }
Response: { contact: Contact }
```

**Get Contact:**
```typescript
GET /api/contacts/:id
Response: { contact: Contact }
```

**Update Contact:**
```typescript
PUT /api/contacts/:id
Body: { name?: string; phone?: string; opt_in?: boolean; }
Response: { contact: Contact }
```

**Delete Contact:**
```typescript
DELETE /api/contacts/:id
Response: { ok: true }
```

### Event History

**List Events:**
```typescript
GET /api/panic-events
Response: { events: PanicEvent[] }
```

**Event Details:**
```typescript
GET /api/panic-events/:id
Response: { event: PanicEvent; results: PanicEventResult[] }
```

### Webhook

**Incoming Messages:**
```typescript
POST /api/webhook/incoming
Body: Twilio form data (From, Body, MessageSid, ...)
Response: { ok: true }
```

## 🗄️ Database

The app uses **better-sqlite3** (synchronous SQLite) for better performance in Next.js.

**Database location:** `/workspace/data.db`

**Tables:**
- `contacts` - Emergency contacts
- `panic_events` - Alert history
- `panic_results` - Message delivery status

**Auto-initialization:** Tables are created automatically on first run.

## 📱 WhatsApp Setup

### Sandbox (Testing)

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** > **Try it out** > **Send a WhatsApp message**
3. You'll see: "Send 'join <code>' to +1 415 523 8886"
4. From your WhatsApp, send that join message
5. You'll receive a confirmation
6. Now you can receive test messages!

### Production

For production, request WhatsApp Business Profile approval:
1. Go to Twilio Console > Messaging > Senders
2. Request WhatsApp sender approval
3. Follow Twilio's approval process

## 🔧 TypeScript Types

All types are defined in `src/types/api.ts`:

```typescript
import type {
  Contact,
  PanicRequest,
  PanicResponse,
  SendAlertRequest,
  // ... more types
} from '@/types/api';
```

**Key types:**
- `Contact` - Contact database model
- `PanicRequest/Response` - Panic alert payloads
- `SendAlertRequest/Response` - SMS alert payloads
- `PanicEvent/Result` - Event history models
- `ApiError` - Error responses
- `HealthResponse` - Health check response

## 🛠️ Development

### Database Operations

```typescript
import {
  getDatabase,
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  createPanicEvent,
  createPanicResult,
} from '@/lib/database';

// Create contact
const contact = createContact('John Doe', '+15085140864', true);

// Get all contacts
const contacts = getAllContacts();

// Create panic event
const eventId = createPanicEvent(
  'Emergency message',
  40.7128,
  -74.0060,
  null
);
```

### Twilio Operations

```typescript
import {
  sendWhatsAppMessage,
  sendSMSMessage,
  twilioConfig,
} from '@/lib/twilio';

// Check if configured
if (twilioConfig.isConfigured) {
  // Send WhatsApp
  const { sid } = await sendWhatsAppMessage('+15085140864', 'Hello!');
  
  // Send SMS (requires TWILIO_FROM)
  const { sid } = await sendSMSMessage('+15085140864', 'Hello!');
}
```

### Helper Functions

```typescript
import {
  normalizePhone,
  reverseGeocode,
  isValidE164Phone,
  isValidLatitude,
  isValidLongitude,
} from '@/lib/helpers';

// Normalize phone
const phone = normalizePhone('(508) 514-0864');
// Result: '+15085140864'

// Reverse geocode
const { full, short } = await reverseGeocode(40.7128, -74.0060);
// Result: { full: 'Full address...', short: 'NYC, NY' }

// Validate phone
const valid = isValidE164Phone('+15085140864'); // true
```

## 🔍 Troubleshooting

### "Twilio not configured" Error

**Problem:** Twilio credentials not set.

**Solution:**
1. Check `.env.local` file exists
2. Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set
3. Restart dev server: `npm run dev`

### Database Errors

**Problem:** "Database locked" or "unable to open database"

**Solution:**
1. Stop all Next.js processes
2. Delete `data.db` (it will be recreated)
3. Restart: `npm run dev`

### TypeScript Errors

**Problem:** Type errors in IDE

**Solution:**
1. Restart TypeScript server in your IDE
2. Run `npm install` to ensure all types are installed
3. Check `tsconfig.json` includes paths mapping

### WhatsApp Messages Not Sent

**Problem:** Messages fail to send

**Solutions:**
1. Ensure you joined WhatsApp sandbox
2. Check phone number format: `+15085140864` (E.164)
3. Verify Twilio account has credit
4. Check console logs for detailed errors

## 📊 Database Inspection

View database contents:

```bash
# Install sqlite3 CLI (if needed)
brew install sqlite3  # macOS
apt install sqlite3   # Linux

# Open database
sqlite3 data.db

# List tables
.tables

# View contacts
SELECT * FROM contacts;

# View panic events
SELECT * FROM panic_events;

# View results
SELECT * FROM panic_results;

# Exit
.exit
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Environment Variables:**
Set in Vercel dashboard:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `TWILIO_FROM` (optional)

**Database:**
- SQLite file will be created in deployment
- For persistence, consider PostgreSQL or external storage

### Other Platforms

- **Netlify:** Supports Next.js with serverless functions
- **Railway:** Easy deployment with persistent storage
- **AWS Amplify:** Full serverless deployment
- **Self-hosted:** Use `npm run build && npm start`

## 🔐 Security

### Environment Variables
- ✅ All secrets in `.env.local` (never committed)
- ✅ `.env.local` in `.gitignore`
- ✅ Use environment variables in production

### API Security
- ✅ Input validation on all endpoints
- ✅ Phone number format validation (E.164)
- ✅ Coordinate range validation
- ⚠️ Consider adding rate limiting
- ⚠️ Consider adding authentication for production

### Database Security
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input sanitization
- ⚠️ Consider encryption for sensitive data

## 📈 Monitoring

Add logging:

```typescript
// In API routes
console.log('📤 Sending alert to:', phone);
console.log('✅ Success:', sid);
console.error('❌ Error:', error);
```

View logs:
```bash
# Development
npm run dev  # Logs appear in terminal

# Production (Vercel)
vercel logs
```

## 🧪 Testing

Create test scripts:

```typescript
// scripts/test-api.ts
async function testPanicAlert() {
  const response = await fetch('http://localhost:3000/api/panic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contacts: ['+15085140864'],
      message: 'Test alert',
      location: { lat: 40.7128, lng: -74.0060 },
    }),
  });
  
  const data = await response.json();
  console.log(data);
}

testPanicAlert();
```

Run:
```bash
npx tsx scripts/test-api.ts
```

## 🎓 Learning Resources

- **Next.js API Routes:** [nextjs.org/docs/app/building-your-application/routing/route-handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **TypeScript:** [typescriptlang.org](https://www.typescriptlang.org/)
- **Twilio:** [twilio.com/docs](https://www.twilio.com/docs)
- **better-sqlite3:** [github.com/WiseLibs/better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

## 💡 Tips

1. **Use TypeScript types** - Get autocomplete and type safety
2. **Check logs** - Console logs show detailed error messages
3. **Test locally first** - Use curl or Postman before deploying
4. **Use WhatsApp sandbox** - Free testing before production approval
5. **Monitor database** - Check `data.db` for stored data
6. **Handle errors** - All routes have try-catch error handling

## 🤝 Support

- **Types reference:** `src/types/api.ts`
- **Database functions:** `src/lib/database.ts`
- **Helper functions:** `src/lib/helpers.ts`
- **Twilio client:** `src/lib/twilio.ts`
- **API routes:** `src/app/api/*/route.ts`

---

**Made with ❤️ using Next.js + TypeScript + Twilio**
