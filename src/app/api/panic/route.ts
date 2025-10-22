/**
 * Emergency Alert API Endpoint
 * Handles POST requests to send emergency WhatsApp messages via Twilio
 */

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Validate E.164 phone number format
const isValidE164 = (phone: string): boolean => {
  return /^\+[1-9]\d{1,14}$/.test(phone);
};

// Validate coordinates
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { contacts, message, location } = body;

    // Validate inputs
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid contacts array' },
        { status: 400 }
      );
    }

    if (contacts.length > 10) {
      return NextResponse.json(
        { success: false, error: 'Maximum 10 contacts allowed' },
        { status: 400 }
      );
    }

    // Validate phone numbers
    for (const contact of contacts) {
      if (!isValidE164(contact)) {
        return NextResponse.json(
          { success: false, error: `Invalid phone number format: ${contact}` },
          { status: 400 }
        );
      }
    }

    if (!message || typeof message !== 'string' || message.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Invalid message (max 1000 characters)' },
        { status: 400 }
      );
    }

    if (
      !location ||
      typeof location.lat !== 'number' ||
      typeof location.lng !== 'number' ||
      !isValidCoordinate(location.lat, location.lng)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid location coordinates' },
        { status: 400 }
      );
    }

    // Check if we're in mock/development mode
    const isMockMode = process.env.MOCK_TWILIO === 'true';
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Check Twilio configuration
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER;

    // Log what we found (without exposing sensitive data)
    console.log('Environment check:', {
      accountSid: accountSid ? '✅ SET' : '❌ MISSING',
      authToken: authToken ? '✅ SET' : '❌ MISSING',
      twilioPhone: twilioPhone ? `✅ SET (${twilioPhone})` : '❌ MISSING',
      nodeEnv: process.env.NODE_ENV,
      mockMode: isMockMode,
    });

    // If in mock mode, simulate sending messages
    if (isMockMode && isDevelopment) {
      console.log('🧪 MOCK MODE: Simulating WhatsApp message send:', {
        from: `whatsapp:+14155238886`,
        to: contacts.map(c => `whatsapp:${c}`),
        message: message,
        location: location,
      });

      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('✅ MOCK MODE: Emergency alert simulated successfully', {
        timestamp: new Date().toISOString(),
        contactsCount: contacts.length,
        location: location,
      });

      return NextResponse.json({
        success: true,
        message: '✅ Mock alert sent successfully (Development Mode - No real messages sent)',
      });
    }

    // Production mode - require Twilio credentials
    if (!accountSid) {
      console.error('TWILIO_ACCOUNT_SID is not set');
      const errorMsg = isDevelopment
        ? 'Missing TWILIO_ACCOUNT_SID. Set MOCK_TWILIO=true in .env.local for development mode, or add your Twilio credentials.'
        : 'Missing TWILIO_ACCOUNT_SID environment variable. Please configure in Vercel dashboard.';
      
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 500 }
      );
    }

    if (!authToken) {
      console.error('TWILIO_AUTH_TOKEN is not set');
      const errorMsg = isDevelopment
        ? 'Missing TWILIO_AUTH_TOKEN. Set MOCK_TWILIO=true in .env.local for development mode, or add your Twilio credentials.'
        : 'Missing TWILIO_AUTH_TOKEN environment variable. Please configure in Vercel dashboard.';
      
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 500 }
      );
    }

    if (!twilioPhone) {
      console.error('TWILIO_WHATSAPP_NUMBER is not set');
      const errorMsg = isDevelopment
        ? 'Missing TWILIO_WHATSAPP_NUMBER. Set MOCK_TWILIO=true in .env.local for development mode, or add your Twilio WhatsApp number (e.g., +14155238886).'
        : 'Missing TWILIO_WHATSAPP_NUMBER environment variable. Should be +14155238886 for sandbox.';
      
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 500 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    console.log('Sending WhatsApp message:', {
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${contacts[0]}`,
      messageLength: message.length,
    });

    // Send WhatsApp messages to all contacts
    const promises = contacts.map((contact: string) =>
      client.messages.create({
        from: `whatsapp:${twilioPhone}`,
        to: `whatsapp:${contact}`,
        body: message,
      })
    );

    const results = await Promise.all(promises);
    
    console.log('Messages sent successfully:', {
      count: results.length,
      sids: results.map(r => r.sid),
    });

    // Log successful alert (without sensitive data)
    console.log('Emergency alert sent successfully', {
      timestamp: new Date().toISOString(),
      contactsCount: contacts.length,
      location: location,
    });

    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully',
    });
  } catch (error: unknown) {
    console.error('Error sending emergency alert:', error);

    // Handle Twilio-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      const twilioError = error as { code: number; message?: string; moreInfo?: string };
      
      console.error('Twilio error details:', {
        code: twilioError.code,
        message: twilioError.message,
        moreInfo: twilioError.moreInfo,
      });

      const errorMessages: { [key: number]: string } = {
        20003: 'Authentication failed. Check your Twilio credentials.',
        21211: 'Invalid phone number.',
        21408: 'Permission to send messages to unverified number denied.',
        21610: 'Number not opted in to WhatsApp Sandbox. Send "join [code]" to +14155238886 first.',
        63007: 'Number not in WhatsApp Sandbox. Send "join [code]" to +14155238886 from your WhatsApp.',
      };

      const errorMessage = errorMessages[twilioError.code] || `Twilio error: ${twilioError.message || 'Failed to send WhatsApp message'}`;
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send emergency alert' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
