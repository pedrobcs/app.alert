import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

export async function POST(request: NextRequest) {
  try {
    // Validate Twilio configuration
    if (!accountSid || !authToken || !whatsappNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Twilio configuration missing. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER environment variables.' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { contacts, message, location } = body;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No emergency contacts provided' },
        { status: 400 }
      );
    }

    if (!location || !location.lat || !location.lng) {
      return NextResponse.json(
        { success: false, error: 'Location data is required' },
        { status: 400 }
      );
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Create Google Maps link for the location
    const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

    // Prepare the emergency message
    const emergencyMessage = `🚨 EMERGENCY ALERT! 🚨\n\nHelp! I need assistance at my location:\n\n${message}\n\nView my location on map:\n${mapsLink}\n\n📍 Coordinates: ${location.lat}, ${location.lng}`;

    // Send WhatsApp messages to all contacts
    const sendPromises = contacts.map(async (contact: string) => {
      try {
        const messageResponse = await client.messages.create({
          from: `whatsapp:${whatsappNumber}`,
          to: `whatsapp:${contact}`,
          body: emergencyMessage,
        });
        
        return { 
          success: true, 
          contact, 
          messageSid: messageResponse.sid 
        };
      } catch (error) {
        console.error(`Failed to send message to ${contact}:`, error);
        return { 
          success: false, 
          contact, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    });

    const results = await Promise.all(sendPromises);
    
    // Check if at least one message was sent successfully
    const successCount = results.filter(r => r.success).length;
    
    if (successCount === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send messages to any contacts',
          results 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Emergency alert sent to ${successCount} contact(s)`,
      results,
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send emergency alert' 
      },
      { status: 500 }
    );
  }
}
