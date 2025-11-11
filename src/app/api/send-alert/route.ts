/**
 * API Route for sending emergency alerts via UltraMsg WhatsApp API
 */

import { NextRequest, NextResponse } from 'next/server';

interface AlertRequestBody {
  phoneNumber: string;
  message: string;
  location: {
    lat: number;
    lng: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AlertRequestBody = await request.json();
    const { phoneNumber, message, location } = body;

    // Validate input
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number' },
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

    // UltraMsg API credentials from environment variables
    const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN || 'ur110ctwwie9qgr2';
    const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID || '149621';

    // Prepare form data for UltraMsg API
    const formData = new URLSearchParams({
      token: ULTRAMSG_TOKEN,
      to: phoneNumber.replace(/[^0-9+]/g, ''), // Clean phone number
      body: message,
    });

    // Send request to UltraMsg API
    const response = await fetch(
      `https://api.ultramsg.com/instance${ULTRAMSG_INSTANCE_ID}/messages/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('UltraMsg API error:', errorText);
      throw new Error(`UltraMsg API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('UltraMsg response:', data);

    return NextResponse.json({
      success: true,
      message: 'Emergency alert sent successfully via WhatsApp',
      data,
    });
  } catch (error) {
    console.error('Error sending alert:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send alert',
      },
      { status: 500 }
    );
  }
}
