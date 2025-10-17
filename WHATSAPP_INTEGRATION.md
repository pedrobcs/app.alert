# WhatsApp Integration Guide

## Overview

This guide explains how to integrate Twilio WhatsApp messaging into the SafeAlert application for sending emergency notifications.

## Prerequisites

1. **Twilio Account**: Sign up at [twilio.com](https://www.twilio.com/)
2. **WhatsApp Sandbox** (for testing) or **Approved WhatsApp Business** (for production)
3. **Environment Variables**: Configured in `.env.local`

## Setup

### 1. Get Twilio Credentials

1. Log in to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Account Info** on the dashboard
3. Copy your **Account SID** and **Auth Token**

### 2. Set Up WhatsApp

#### For Testing (WhatsApp Sandbox)

1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow instructions to join the sandbox by sending a WhatsApp message
3. Your sandbox number will be displayed (e.g., `+14155238886`)

#### For Production

1. Apply for a [Twilio WhatsApp Business Profile](https://www.twilio.com/whatsapp/request-access)
2. Complete the approval process
3. Configure your WhatsApp sender number

### 3. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
```

⚠️ **IMPORTANT**: These are server-side variables. Never prefix them with `NEXT_PUBLIC_`!

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

The `dotenv` package is already included in dependencies.

## Usage

### Basic Example: Send Single Message

```typescript
import { sendWhatsAppMessage } from '@/lib/whatsapp';

async function sendAlert() {
  const result = await sendWhatsAppMessage(
    '+15551234567',
    'Emergency! I need help immediately!'
  );

  if (result.success) {
    console.log('Message sent successfully!', result.messageId);
  } else {
    console.error('Failed to send:', result.error);
  }
}
```

### Emergency Alert to Multiple Contacts

```typescript
import { sendEmergencyAlerts } from '@/lib/whatsapp';
import { getEmergencyContacts } from '@/lib/env';

async function triggerEmergencyAlert(location: { lat: number; lng: number }) {
  // Get configured emergency contacts
  const contacts = getEmergencyContacts();
  
  // Create emergency message with location
  const message = `🚨 EMERGENCY ALERT 🚨

I need immediate help!

Location: https://maps.google.com/?q=${location.lat},${location.lng}

This is an automated emergency notification from SafeAlert.`;

  // Send to all contacts
  const results = await sendEmergencyAlerts(contacts, message);
  
  // Check results
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  
  console.log(`Sent to ${successful}/${results.length} contacts`);
  
  if (failed > 0) {
    console.warn(`${failed} messages failed to send`);
  }
  
  return { successful, failed, total: results.length };
}
```

### Integration with React Component

```typescript
'use client';

import { useState } from 'react';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { getEmergencyContacts } from '@/lib/env';

export function EmergencyButton() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleEmergency = async () => {
    setSending(true);
    setStatus('Sending emergency alerts...');

    try {
      const contacts = getEmergencyContacts();
      const message = '🚨 EMERGENCY! I need help!';

      // Send to first contact as example
      const result = await sendWhatsAppMessage(contacts[0], message);

      if (result.success) {
        setStatus('✅ Emergency alert sent!');
      } else {
        setStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('❌ An error occurred');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleEmergency}
        disabled={sending}
        className="emergency-button"
      >
        {sending ? 'Sending...' : 'SEND EMERGENCY ALERT'}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
```

## Security Architecture

### How It Works

```
┌─────────────────┐
│  Browser        │
│  (Client-Side)  │
└────────┬────────┘
         │ 1. sendWhatsAppMessage('+1555...', 'Help!')
         ↓
┌─────────────────┐
│  API Route      │
│  /api/send-     │  ← ⚠️ Twilio credentials ONLY accessible here
│  whatsapp       │     (Server-Side)
└────────┬────────┘
         │ 2. Uses TWILIO_AUTH_TOKEN (secure)
         ↓
┌─────────────────┐
│  Twilio API     │
│  WhatsApp       │
└────────┬────────┘
         │ 3. Delivers message
         ↓
┌─────────────────┐
│  Recipient      │
│  WhatsApp       │
└─────────────────┘
```

### Why This Is Secure

1. **Credentials Never Leave Server**: 
   - `TWILIO_AUTH_TOKEN` is not prefixed with `NEXT_PUBLIC_`
   - Browser never receives these values

2. **API Route as Proxy**:
   - Client calls `/api/send-whatsapp`
   - Server-side route handles Twilio authentication
   - No sensitive data in client code

3. **Built-in Protection**:
   - `getTwilioConfig()` throws error if called from browser
   - Type-safe environment variable access
   - Validation at every layer

## Testing

### 1. Test Configuration

```typescript
import { validateEnv } from '@/lib/env';

// Check if Twilio is configured (server-side only)
const validation = validateEnv(true);

if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}
```

### 2. Test WhatsApp Sandbox

1. Make sure you've joined the Twilio WhatsApp sandbox
2. Send a test message:

```typescript
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const result = await sendWhatsAppMessage(
  '+15551234567',  // Your phone number
  'Test message from SafeAlert'
);

console.log(result);
```

### 3. Check Twilio Logs

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Monitor** → **Logs** → **Messages**
3. View delivery status and errors

## Troubleshooting

### "Twilio configuration missing"

**Cause**: Environment variables not set correctly.

**Solution**:
1. Check `.env.local` exists and has correct values
2. Restart dev server: `npm run dev`
3. Verify no typos in variable names

### "Unable to create record: Permission Denied"

**Cause**: Recipient hasn't joined WhatsApp sandbox (in testing).

**Solution**:
1. Send sandbox join message from recipient's phone
2. Wait for confirmation from Twilio
3. Try sending again

### "From phone number not verified"

**Cause**: Using non-sandbox number without approval.

**Solution**:
1. Use Twilio sandbox number for testing
2. Or complete WhatsApp Business approval for production

### "Invalid phone number format"

**Cause**: Phone number not in E.164 format.

**Solution**:
- ✅ Correct: `+15551234567`
- ❌ Wrong: `5551234567`, `+1 (555) 123-4567`

## Rate Limits

Twilio WhatsApp has rate limits:

- **Sandbox**: ~1 message per second
- **Production**: Higher limits based on your business profile

Handle rate limits gracefully:

```typescript
const results = await sendEmergencyAlerts(contacts, message);

const failed = results.filter(r => 
  r.error?.includes('rate limit') || 
  r.error?.includes('Too Many Requests')
);

if (failed.length > 0) {
  // Implement retry logic with exponential backoff
  console.warn('Some messages were rate limited');
}
```

## Production Checklist

- [ ] Applied for WhatsApp Business Account
- [ ] Received approval from Twilio
- [ ] Configured production phone number
- [ ] Updated `TWILIO_WHATSAPP_NUMBER` in production environment
- [ ] Tested with real phone numbers
- [ ] Set up monitoring and alerts
- [ ] Implemented error handling and retries
- [ ] Added rate limit handling
- [ ] Configured logging for compliance

## Best Practices

### 1. Message Templates

Pre-approved templates for faster delivery:

```typescript
const templates = {
  emergency: (location: string) => 
    `🚨 EMERGENCY ALERT\n\nLocation: ${location}\n\nSent via SafeAlert`,
  
  test: () => 
    'SafeAlert test message - Your emergency contact system is working.',
};
```

### 2. Error Handling

Always handle failures gracefully:

```typescript
try {
  const result = await sendWhatsAppMessage(contact, message);
  
  if (!result.success) {
    // Log error for monitoring
    console.error('WhatsApp send failed:', result.error);
    
    // Fall back to SMS or other notification method
    await sendSMS(contact, message);
  }
} catch (error) {
  // Handle network errors
  console.error('Network error:', error);
}
```

### 3. User Consent

Always get explicit consent before sending WhatsApp messages:

```typescript
const [consent, setConsent] = useState(false);

<label>
  <input 
    type="checkbox" 
    checked={consent}
    onChange={(e) => setConsent(e.target.checked)}
  />
  I consent to receive emergency alerts via WhatsApp
</label>
```

## Additional Resources

- [Twilio WhatsApp API Documentation](https://www.twilio.com/docs/whatsapp/api)
- [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)
- [Twilio Rate Limits](https://www.twilio.com/docs/usage/limits)
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)

## Support

If you encounter issues:

1. Check [Twilio Status Page](https://status.twilio.com/)
2. Review [Twilio Error Codes](https://www.twilio.com/docs/api/errors)
3. Contact Twilio Support (if account issue)
4. Check application logs for detailed error messages
