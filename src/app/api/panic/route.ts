import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contacts, message, location } = body;

    // Validate environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_FROM;

    if (!accountSid || !authToken || !twilioWhatsAppFrom) {
      return NextResponse.json(
        { 
          error: 'Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM environment variables in Vercel.',
          missingVars: {
            accountSid: !accountSid,
            authToken: !authToken,
            twilioWhatsAppFrom: !twilioWhatsAppFrom
          }
        },
        { status: 500 }
      );
    }

    // Validate request body
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'No contacts provided' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    if (!location || !location.lat || !location.lng) {
      return NextResponse.json(
        { error: 'Invalid location data' },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Format location for Google Maps
    const googleMapsUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    
    // Create WhatsApp message with location
    const whatsappMessage = `${message}\n\nLocation: ${googleMapsUrl}`;

    // Send WhatsApp messages to all contacts
    const sendPromises = contacts.map(async (contact: string) => {
      try {
        // Ensure contact number has + prefix
        const formattedContact = contact.startsWith('+') ? contact : `+${contact}`;
        
        const messageResult = await client.messages.create({
          from: `whatsapp:${twilioWhatsAppFrom}`,
          to: `whatsapp:${formattedContact}`,
          body: whatsappMessage,
        });

        return {
          contact: formattedContact,
          success: true,
          messageSid: messageResult.sid,
        };
      } catch (error) {
        console.error(`Failed to send to ${contact}:`, error);
        return {
          contact,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    if (successCount === 0) {
      return NextResponse.json(
        {
          error: 'Failed to send WhatsApp messages to any contact',
          results,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Emergency alert sent successfully to ${successCount} contact(s)${
        failureCount > 0 ? ` (${failureCount} failed)` : ''
      }`,
      results,
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
