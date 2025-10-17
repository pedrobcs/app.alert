import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio configuration
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send emergency alert';
    
    if (error instanceof Error) {
      // Twilio-specific error messages
      if (error.message.includes('authenticate')) {
        errorMessage = 'Twilio authentication failed. Please check your credentials.';
      } else if (error.message.includes('phone number')) {
        errorMessage = 'Invalid phone number format. Please use E.164 format (e.g., +15551234567).';
      } else if (error.message.includes('WhatsApp')) {
        errorMessage = 'Failed to send WhatsApp message. Make sure the recipient has joined your WhatsApp sandbox.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
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
