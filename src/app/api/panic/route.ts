import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

interface PanicRequest {
  contacts: string[];
  message: string;
  location: {
    lat: number;
    lng: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: PanicRequest = await req.json();
    const { contacts, message, location } = body;

    // Validate input
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid contacts array' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message' },
        { status: 400 }
      );
    }

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return NextResponse.json(
        { error: 'Missing or invalid location data' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Create Google Maps link for location
    const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    
    // Enhanced message with location
    const fullMessage = `${message}\n\nLocation: ${mapsLink}\nCoordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;

    // Send WhatsApp message to all contacts
    const results = await Promise.allSettled(
      contacts.map((contact) =>
        client.messages.create({
          body: fullMessage,
          from: fromNumber,
          to: `whatsapp:${contact}`,
        })
      )
    );

    // Check for any failures
    const failures = results.filter((result) => result.status === 'rejected');
    const successes = results.filter((result) => result.status === 'fulfilled');

    if (failures.length > 0) {
      console.error('Some messages failed to send:', failures);
      
      if (successes.length === 0) {
        return NextResponse.json(
          { error: 'Failed to send messages to all contacts' },
          { status: 500 }
        );
      }
      
      // Partial success
      return NextResponse.json({
        success: true,
        message: `Messages sent to ${successes.length} of ${contacts.length} contacts`,
        partial: true,
        sentCount: successes.length,
        totalCount: contacts.length,
      });
    }

    // Full success
    return NextResponse.json({
      success: true,
      message: `Emergency alert sent successfully to ${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`,
      sentCount: contacts.length,
      totalCount: contacts.length,
    });
  } catch (error) {
    console.error('Error sending emergency alert:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to send emergency alert',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Return 405 for non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
