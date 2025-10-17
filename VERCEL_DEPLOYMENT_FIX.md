# Vercel Deployment Error Fix - Twilio Configuration Missing

## Problem

When clicking the emergency button, you see this error:
```
Twilio configuration missing. Please set TWILIO_ACCOUNT_SID, 
TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER environment variables.
```

Even though you've already set these variables in Vercel.

## Why This Happens

SafeAlert has **TWO separate parts**:

1. **Frontend (Next.js)** - The app you're deploying on Vercel
   - Shows the emergency button
   - Gets your location
   - Sends data to the backend

2. **Backend (API Server)** - A separate service
   - Receives emergency alerts
   - Sends WhatsApp messages via Twilio
   - **This is where Twilio credentials are needed**

The error is coming from your **backend**, not the frontend!

## The Solution

You have **3 options**:

### Option 1: Add API Routes to Frontend (Recommended for Vercel)

Add the backend functionality directly to your Next.js app using API routes. This way everything runs on Vercel.

**Step 1: Install Twilio SDK**
```bash
npm install twilio
# or
yarn add twilio
```

**Step 2: Create API Route**
Create file: `src/app/api/panic/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

export async function POST(request: NextRequest) {
  try {
    // Check if Twilio is configured
    if (!accountSid || !authToken || !whatsappNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Twilio configuration missing. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER environment variables.'
        },
        { status: 500 }
      );
    }

    // Parse request body
    const { contacts, message, location } = await request.json();

    // Validate input
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid contacts array' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid message' },
        { status: 400 }
      );
    }

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid location' },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Send WhatsApp messages to all contacts
    const promises = contacts.map((contact: string) =>
      client.messages.create({
        from: `whatsapp:${whatsappNumber}`,
        to: `whatsapp:${contact}`,
        body: message
      })
    );

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully'
    });
  } catch (error) {
    console.error('Error sending alert:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send emergency alert'
      },
      { status: 500 }
    );
  }
}
```

**Step 3: Update Environment Variables in Vercel**

Keep the Twilio variables you already set:
- ✅ `TWILIO_ACCOUNT_SID`
- ✅ `TWILIO_AUTH_TOKEN`
- ✅ `TWILIO_WHATSAPP_NUMBER`

Add or update:
- `NEXT_PUBLIC_API_BASE_URL` = (leave empty or set to your Vercel domain)

**Step 4: Update API Client**

Update `src/lib/api.ts` to use relative URL:

```typescript
const getApiBaseUrl = (): string => {
  // Use relative URL for API routes in same app
  // Or use environment variable for external backend
  return process.env.NEXT_PUBLIC_API_BASE_URL || '';
};
```

**Step 5: Redeploy**

```bash
git add .
git commit -m "Add Twilio API route for Vercel deployment"
git push
```

Vercel will automatically redeploy.

---

### Option 2: Deploy Backend Separately on Vercel

If you have a separate backend codebase:

**Step 1: Deploy Backend to Vercel**
1. Create a new Vercel project for your backend
2. Set environment variables on the **backend project**:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`

**Step 2: Update Frontend Environment Variables**
1. Go to your **frontend** Vercel project settings
2. Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.vercel.app
   ```

**Step 3: Redeploy Frontend**

---

### Option 3: Use External Backend (ngrok/Render/Railway)

If your backend is running elsewhere:

**Step 1: Set Twilio Variables on Your Backend Host**

Set these environment variables where your backend is running:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`

**Step 2: Update Frontend Environment Variable**

In Vercel, set:
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
```

**Step 3: Restart Backend and Redeploy Frontend**

---

## Important Notes

### Environment Variable Scoping

Vercel has 3 environment scopes:
- **Production** - Used for production deployments (main branch)
- **Preview** - Used for pull request previews
- **Development** - Used locally with `vercel dev`

Make sure your variables are set for the correct scope! Check all three:
- ✅ Production
- ✅ Preview  
- ✅ Development

### After Setting Variables

**Always redeploy** after adding/changing environment variables:

1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

Or push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Vercel Environment Variables Don't Auto-Redeploy

This is a common gotcha! Setting variables in Vercel **doesn't** automatically redeploy. You must:
- Trigger a manual redeploy, OR
- Push a new commit

### Testing Locally

Test before deploying:

```bash
# Create .env.local
cat > .env.local << EOF
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=+14155238886
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_CONTACT_1=+15085140864
EOF

# Run locally
npm run dev
```

Visit http://localhost:3000 and test.

---

## Verification Checklist

After implementing the solution:

- [ ] Twilio variables set in correct project (backend or frontend with API routes)
- [ ] Variables set for all environments (Production, Preview, Development)
- [ ] `NEXT_PUBLIC_API_BASE_URL` points to correct backend (or empty for API routes)
- [ ] Redeployed after setting variables
- [ ] Tested emergency button - no "configuration missing" error
- [ ] Received test WhatsApp message

---

## Quick Diagnosis

Run this test to see what's happening:

1. Open browser console (F12)
2. Go to Network tab
3. Click emergency button
4. Look at the `/panic` request:
   - **404 Not Found**: API route doesn't exist → Use Option 1
   - **500 with "Twilio configuration missing"**: Variables not set → Redeploy
   - **CORS error**: Backend CORS not configured → Fix backend
   - **Network error**: Backend URL wrong → Check `NEXT_PUBLIC_API_BASE_URL`

---

## Need More Help?

If you're still having issues:

1. **Check browser console** for specific error messages
2. **Check Vercel logs**: Go to your project → Deployments → Click deployment → View logs
3. **Verify environment variables**: Settings → Environment Variables
4. **Try Option 1**: It's the simplest - everything runs on Vercel

---

**Recommendation**: Use **Option 1** (API Routes) - it's the easiest and everything runs together on Vercel.
