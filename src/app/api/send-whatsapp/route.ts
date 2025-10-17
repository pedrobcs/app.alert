/**
 * API Route: Send WhatsApp Message via Twilio
 * 
 * This is a SERVER-SIDE route that safely uses sensitive Twilio credentials.
 * Sensitive environment variables are NEVER exposed to the browser.
 * 
 * Example usage from client:
 * ```typescript
 * const response = await fetch('/api/send-whatsapp', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     to: '+1234567890',
 *     message: 'Emergency alert!'
 *   })
 * });
 * ```
 */

// Load environment variables from .env.local
import 'dotenv/config';

import { NextRequest, NextResponse } from 'next/server';
import { getTwilioConfig } from '@/lib/env';

interface WhatsAppRequest {
  to: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: WhatsAppRequest = await request.json();
    const { to, message } = body;

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic check)
    if (!to.match(/^\+[1-9]\d{1,14}$/)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)' },
        { status: 400 }
      );
    }

    // ⚠️ SECURITY: getTwilioConfig() only works on server-side
    // This will throw an error if accidentally called from client
    const twilioConfig = getTwilioConfig();

    // Send WhatsApp message using Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`;
    
    const formData = new URLSearchParams({
      From: `whatsapp:${twilioConfig.whatsappNumber}`,
      To: `whatsapp:${to}`,
      Body: message,
    });

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(
          `${twilioConfig.accountSid}:${twilioConfig.authToken}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!twilioResponse.ok) {
      const errorData = await twilioResponse.json().catch(() => ({}));
      console.error('Twilio API error:', errorData);
      
      return NextResponse.json(
        { 
          error: 'Failed to send WhatsApp message',
          details: errorData.message || twilioResponse.statusText
        },
        { status: twilioResponse.status }
      );
    }

    const twilioData = await twilioResponse.json();

    return NextResponse.json({
      success: true,
      message: 'WhatsApp message sent successfully',
      messageId: twilioData.sid,
    });

  } catch (error) {
    console.error('Error in send-whatsapp API:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Twilio configuration missing')) {
        return NextResponse.json(
          { error: 'Server configuration error: Twilio credentials not configured' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send WhatsApp messages.' },
    { status: 405 }
  );
}
