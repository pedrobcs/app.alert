# Environment Variables Guide

## Overview

This document explains how to properly configure and use environment variables in the SafeAlert application, with a focus on security best practices.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your values** in `.env.local`

3. **Never commit** `.env.local` (it's already in `.gitignore`)

## Environment Variable Types

### 🌐 Client-Side Variables (Public)

Variables prefixed with `NEXT_PUBLIC_` are embedded into the browser bundle and accessible on both client and server.

**✅ Safe to use for:**
- API endpoints (if public)
- Public configuration
- Feature flags
- Non-sensitive settings

**Example:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_CONTACT_1=+15551234567
```

**Usage in code:**
```typescript
// Can be used anywhere (client or server components)
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### 🔒 Server-Side Variables (Private)

Variables **WITHOUT** the `NEXT_PUBLIC_` prefix are **ONLY** available on the server and never exposed to the browser.

**✅ Use for:**
- API keys and secrets
- Database credentials
- Authentication tokens
- Any sensitive information

**❌ Never use for:**
- Client-side configuration
- Public settings

**Example:**
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

**Usage in code:**
```typescript
// ⚠️ ONLY use in API routes, Server Components, or Server Actions
import { getTwilioConfig } from '@/lib/env';

export async function POST(request: NextRequest) {
  // This is safe - we're in an API route (server-side)
  const config = getTwilioConfig();
  // Use config.accountSid, config.authToken, etc.
}
```

## Security Best Practices

### ✅ DO

1. **Prefix public variables** with `NEXT_PUBLIC_`
   ```bash
   NEXT_PUBLIC_API_URL=https://api.example.com  # ✅ Good
   ```

2. **Keep sensitive data server-side only**
   ```bash
   TWILIO_AUTH_TOKEN=secret123  # ✅ Good - no NEXT_PUBLIC_ prefix
   ```

3. **Use type-safe environment utilities**
   ```typescript
   import { getTwilioConfig } from '@/lib/env';  // ✅ Good
   ```

4. **Validate environment variables on startup**
   ```typescript
   import { validateEnv } from '@/lib/env';
   const validation = validateEnv();
   if (!validation.isValid) {
     console.error('Environment errors:', validation.errors);
   }
   ```

5. **Use API routes as a proxy** for sensitive operations
   ```typescript
   // Client-side code
   const response = await fetch('/api/send-whatsapp', {
     method: 'POST',
     body: JSON.stringify({ to: '+1234567890', message: 'Alert!' })
   });
   // API route handles Twilio credentials server-side
   ```

### ❌ DON'T

1. **Never prefix sensitive credentials**
   ```bash
   NEXT_PUBLIC_TWILIO_AUTH_TOKEN=secret123  # ❌ EXPOSED TO BROWSER!
   ```

2. **Don't access server variables in client components**
   ```typescript
   // ❌ BAD - This won't work and may expose secrets
   'use client';
   const token = process.env.TWILIO_AUTH_TOKEN;
   ```

3. **Don't commit `.env.local`** files
   ```bash
   # ❌ Never do this
   git add .env.local
   ```

4. **Don't hardcode sensitive values**
   ```typescript
   // ❌ BAD
   const apiKey = 'sk-1234567890abcdef';
   
   // ✅ GOOD
   const apiKey = process.env.TWILIO_AUTH_TOKEN;
   ```

## Configuration Files

### `.env.local` (gitignored)
Your actual environment variables with real values. **Never commit this file.**

### `.env.local.example`
Template file with example values and documentation. **Safe to commit.**

### `.env`
Default values for all environments. **Can be committed** if it contains no secrets.

### `.env.production`
Production-specific values. **Should be set in your hosting platform**, not committed.

## Usage Examples

### Example 1: Client-Side API Call

```typescript
// src/components/EmergencyButton.tsx
'use client';

export function EmergencyButton() {
  const handleEmergency = async () => {
    // ✅ Using NEXT_PUBLIC_ variable (safe in browser)
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    await fetch(`${apiUrl}/panic`, {
      method: 'POST',
      body: JSON.stringify({ message: 'Help!' })
    });
  };

  return <button onClick={handleEmergency}>Alert</button>;
}
```

### Example 2: Server-Side API Route

```typescript
// src/app/api/send-alert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTwilioConfig } from '@/lib/env';

export async function POST(request: NextRequest) {
  // ✅ Safe - this is server-side only
  const twilio = getTwilioConfig();
  
  // Use twilio.accountSid, twilio.authToken securely
  // Send message via Twilio API
  
  return NextResponse.json({ success: true });
}
```

### Example 3: Server Component

```typescript
// src/app/dashboard/page.tsx
import { getTwilioConfig } from '@/lib/env';

// ✅ This is a Server Component (default in Next.js 15)
export default async function DashboardPage() {
  // Safe to access server-side variables
  const config = getTwilioConfig();
  const isConfigured = !!config.accountSid;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Twilio: {isConfigured ? 'Configured' : 'Not configured'}</p>
    </div>
  );
}
```

## Environment Variables Reference

### Client-Side (Public)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_CONTACT_1` | No | First emergency contact |
| `NEXT_PUBLIC_CONTACT_2` | No | Second emergency contact |
| `NEXT_PUBLIC_CONTACT_3` | No | Third emergency contact |

### Server-Side (Private)

| Variable | Required | Description |
|----------|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Yes* | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Yes* | Twilio Auth Token |
| `TWILIO_WHATSAPP_NUMBER` | Yes* | Twilio WhatsApp number |

*Required if using WhatsApp notifications

## Deployment

### Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable (without quotes)
3. Select appropriate environments (Production/Preview/Development)
4. Deploy!

### Other Platforms

Most hosting platforms provide environment variable configuration:
- **Netlify**: Site settings → Environment variables
- **Railway**: Project → Variables
- **Heroku**: Settings → Config Vars
- **AWS**: Systems Manager Parameter Store or Secrets Manager

## Troubleshooting

### "Environment variable not defined"

**Problem:** Variable is undefined when accessed.

**Solutions:**
1. Check if variable is in `.env.local`
2. Restart dev server after adding variables
3. Ensure client variables have `NEXT_PUBLIC_` prefix
4. Verify no typos in variable names

### "SECURITY ERROR: Called on client-side"

**Problem:** Trying to access server-only function from browser.

**Solution:** Move the code to an API route or Server Component.

```typescript
// ❌ BAD - Client Component
'use client';
export function MyComponent() {
  const config = getTwilioConfig(); // Error!
}

// ✅ GOOD - Use API Route
'use client';
export function MyComponent() {
  const sendAlert = async () => {
    await fetch('/api/send-whatsapp', { /* ... */ });
  };
}
```

### Variables not updating

**Problem:** Changed `.env.local` but values don't update.

**Solution:** Restart your development server:
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
# or
yarn dev
```

## Additional Resources

- [Next.js Environment Variables Docs](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [The Twelve-Factor App: Config](https://12factor.net/config)

## Need Help?

If you're unsure whether a variable should be public or private, **default to private** (no `NEXT_PUBLIC_` prefix) and expose it through an API route if needed.

When in doubt, ask: "Would it be dangerous if users could see this value in their browser's developer tools?" If yes, keep it server-side only.
