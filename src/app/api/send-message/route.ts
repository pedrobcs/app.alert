import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  try {
    const { toNumber, message } = await req.json();

    // Validate input
    if (!toNumber || !message) {
      return NextResponse.json(
        { error: 'Missing toNumber or message' },
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

    // Send WhatsApp message
    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: `whatsapp:${toNumber}`, // Format as whatsapp:+1234567890
    });

    return NextResponse.json({
      success: true,
      sid: response.sid,
      status: response.status,
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to send message',
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
