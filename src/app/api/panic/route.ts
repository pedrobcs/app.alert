import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

interface EmergencyPayload {
  contacts: string[];
  message: string;
  location: {
    lat: number;
    lng: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Validate Twilio credentials
    if (!accountSid || !authToken) {
      console.error('Twilio credentials not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.',
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body: EmergencyPayload = await request.json();
    const { contacts, message, location } = body;

    // Validate input
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid contacts array. Must provide at least one contact.',
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid message. Must provide a message string.',
        },
        { status: 400 }
      );
    }

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid location. Must provide lat and lng coordinates.',
        },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (location.lat < -90 || location.lat > 90 || location.lng < -180 || location.lng > 180) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.',
        },
        { status: 400 }
      );
    }

    // Validate phone numbers (basic E.164 format check)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const invalidContacts = contacts.filter(contact => !phoneRegex.test(contact));
    if (invalidContacts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid phone number format: ${invalidContacts.join(', ')}. Must be in E.164 format (e.g., +15085140864).`,
        },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Send WhatsApp messages to all contacts
    const messagePromises = contacts.map(async (contact) => {
      try {
        const result = await client.messages.create({
          from: twilioWhatsAppNumber,
          to: `whatsapp:${contact}`,
          body: message,
        });
        
        console.log(`WhatsApp message sent to ${contact}:`, result.sid);
        return { contact, success: true, sid: result.sid };
      } catch (error) {
        console.error(`Failed to send WhatsApp message to ${contact}:`, error);
        return { contact, success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    // Wait for all messages to be sent
    const results = await Promise.all(messagePromises);

    // Check if all messages were sent successfully
    const failedMessages = results.filter(r => !r.success);
    
    if (failedMessages.length > 0) {
      console.error('Some messages failed to send:', failedMessages);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to send messages to ${failedMessages.length} contact(s). Check server logs for details.`,
          details: failedMessages,
        },
        { status: 500 }
      );
    }

    // Log success
    console.log('Emergency alert sent successfully to all contacts:', {
      contacts: contacts.length,
      location: { lat: location.lat, lng: location.lng },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully',
      sentTo: results.map(r => r.contact),
    });

  } catch (error) {
    console.error('Error processing emergency alert:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send emergency alert',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
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
