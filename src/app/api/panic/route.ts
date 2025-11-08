import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

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
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json(
        { 
          error: 'Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.' 
        },
        { status: 500 }
      );
    }

    // Parse request body
    const payload: EmergencyPayload = await request.json();
    const { contacts, message, location } = payload;

    // Validate payload
    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'At least one contact is required' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Create message with location
    const fullMessage = `${message}\n\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}`;

    // Send SMS to all contacts
    const sendPromises = contacts.map(async (contact) => {
      try {
        const result = await client.messages.create({
          body: fullMessage,
          from: twilioPhoneNumber,
          to: contact,
        });
        return { contact, success: true, sid: result.sid };
      } catch (error) {
        console.error(`Failed to send to ${contact}:`, error);
        return { 
          contact, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    });

    const results = await Promise.all(sendPromises);
    
    // Check if at least one message was sent successfully
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    if (successCount === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to send messages to all contacts',
          details: results
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Emergency alert sent to ${successCount} contact(s)${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
      results,
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send emergency alert' 
      },
      { status: 500 }
    );
  }
}
