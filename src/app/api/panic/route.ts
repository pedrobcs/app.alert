/**
 * Server-side API route for emergency panic alerts
 * Uses Twilio to send WhatsApp messages
 * 
 * IMPORTANT: This code runs on the server side only.
 * Twilio credentials are never exposed to the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';

// Twilio credentials - server-side only
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

// Validate Twilio credentials are configured
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
  console.error('Missing Twilio credentials. Please configure environment variables:');
  console.error('- TWILIO_ACCOUNT_SID');
  console.error('- TWILIO_AUTH_TOKEN');
  console.error('- TWILIO_WHATSAPP_NUMBER');
}

interface EmergencyPayload {
  contacts: string[];
  message: string;
  location: {
    lat: number;
    lng: number;
  };
}

/**
 * Validates phone number format (E.164)
 */
function isValidPhoneNumber(phone: string): boolean {
  return /^\+[1-9]\d{1,14}$/.test(phone);
}

/**
 * POST /api/panic
 * Sends emergency alerts via WhatsApp using Twilio
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const payload: EmergencyPayload = await request.json();
    const { contacts, message, location } = payload;

    // Validate input
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contacts array',
        },
        { status: 400 }
      );
    }

    if (contacts.length > 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum 10 contacts allowed',
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid message (max 1000 characters)',
        },
        { status: 400 }
      );
    }

    if (
      !location ||
      typeof location.lat !== 'number' ||
      typeof location.lng !== 'number' ||
      location.lat < -90 ||
      location.lat > 90 ||
      location.lng < -180 ||
      location.lng > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid location coordinates',
        },
        { status: 400 }
      );
    }

    // Validate phone numbers
    for (const contact of contacts) {
      if (!isValidPhoneNumber(contact)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid phone number format: ${contact}. Use E.164 format (e.g., +15551234567)`,
          },
          { status: 400 }
        );
      }
    }

    // Check if Twilio is configured
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
      console.error('Twilio not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Messaging service not configured',
        },
        { status: 500 }
      );
    }

    // Dynamically import Twilio (server-side only)
    const twilio = (await import('twilio')).default;
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Send WhatsApp messages to all contacts
    const messagePromises = contacts.map((contact) =>
      client.messages.create({
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${contact}`,
        body: message,
      })
    );

    // Wait for all messages to be sent
    await Promise.all(messagePromises);

    // Log success (without sensitive info)
    console.log(`Emergency alert sent to ${contacts.length} contact(s)`);
    console.log(`Location: ${location.lat}, ${location.lng}`);

    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully',
    });
  } catch (error) {
    console.error('Error sending emergency alert:', error);

    // Return generic error to client (don't expose internal details)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send emergency alert',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/panic
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
