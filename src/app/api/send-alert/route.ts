/**
 * Next.js API Route: POST /api/send-alert
 * Send SMS alert (PWA compatibility)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { SendAlertRequest, SendAlertResponse, SendAlertResult } from '@/types/api';
import { normalizePhone, reverseGeocode } from '@/lib/helpers';
import { sendSMSMessage, twilioConfig } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    // Check if Twilio is configured
    if (!twilioConfig.isConfigured) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local',
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json() as SendAlertRequest;
    const { contacts, lat, lon } = body;

    // Validate inputs
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'contacts array required',
        },
        { status: 400 }
      );
    }

    if (lat == null || lon == null) {
      return NextResponse.json(
        {
          ok: false,
          error: 'lat and lon required',
        },
        { status: 400 }
      );
    }

    if (!twilioConfig.smsFrom) {
      return NextResponse.json(
        {
          ok: false,
          error: 'TWILIO_FROM not configured for SMS. Set it in .env.local',
        },
        { status: 500 }
      );
    }

    // Get address from coordinates
    const geocode = await reverseGeocode(lat, lon, {
      countryBias: 'us',
      acceptLanguage: 'en',
    });

    const results: SendAlertResult[] = [];

    // Send SMS to all contacts
    for (const contact of contacts) {
      const name = contact.name || '';
      const phone = normalizePhone(contact.phone || '');

      if (!phone) {
        results.push({
          to: null,
          status: 'failed',
          error: 'missing phone',
        });
        continue;
      }

      const baseMessage =
        contact.message ||
        `O ICE ACABOU DE ME PEGAR. Preciso de ajuda! Estou em: ${geocode.short}`;

      const text = `${baseMessage}\n\n📍 Mapa: https://maps.google.com/?q=${lat},${lon}`;

      try {
        const { sid } = await sendSMSMessage(
          phone,
          (name ? `Olá ${name}, ` : '') + text
        );

        results.push({
          to: phone,
          status: 'sent',
          sid,
        });
      } catch (error) {
        results.push({
          to: phone,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const response: SendAlertResponse = {
      ok: true,
      results,
      address: geocode.short,
      lat,
      lon,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Send alert error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
