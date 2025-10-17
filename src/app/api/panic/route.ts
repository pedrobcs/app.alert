/**
 * Emergency Alert API Endpoint
 * Handles POST requests to send emergency WhatsApp messages via Twilio
 */

import { NextRequest, NextResponse } from 'next/server';

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

    // Check Twilio configuration
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken) {
      console.error('Twilio credentials not configured');
      return NextResponse.json(
        { success: false, error: 'Messaging service not configured' },
        { status: 500 }
      );
    }

    if (!twilioPhone) {
      console.error('Twilio WhatsApp number not configured');
      return NextResponse.json(
        { success: false, error: 'Messaging service not configured' },
        { status: 500 }
      );
    }

    // Initialize Twilio client
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);

    // Send WhatsApp messages to all contacts
    const promises = contacts.map((contact: string) =>
      client.messages.create({
        from: `whatsapp:${twilioPhone}`,
        to: `whatsapp:${contact}`,
        body: message,
      })
    );

    await Promise.all(promises);

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
  } catch (error: any) {
    console.error('Error sending emergency alert:', error);

    // Handle Twilio-specific errors
    if (error.code) {
      const errorMessages: { [key: number]: string } = {
        20003: 'Authentication failed. Check your Twilio credentials.',
        21211: 'Invalid phone number.',
        21408: 'Permission to send messages to unverified number denied.',
        21610: 'Message could not be sent. Number may not be opted in.',
      };

      const errorMessage = errorMessages[error.code] || 'Failed to send WhatsApp message';
      
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
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
