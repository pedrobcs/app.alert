/**
 * Next.js API Route: POST /api/panic
 * Send emergency panic alert via WhatsApp
 */

import { NextRequest, NextResponse } from 'next/server';
import type { PanicRequest, PanicResponse, PanicResult } from '@/types/api';
import {
  createPanicEvent,
  createPanicResult,
  getContactsByIds,
} from '@/lib/database';
import { normalizePhone, reverseGeocode } from '@/lib/helpers';
import { sendWhatsAppMessage, twilioConfig } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    // Check if Twilio is configured
    if (!twilioConfig.isConfigured) {
      return NextResponse.json(
        {
          success: false,
          error: 'Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local',
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json() as PanicRequest;
    const { contacts, contactIds, message: customMessage, location, meta } = body;

    // Build target phone list
    let phones: string[] = [];

    // Add contacts from database
    if (contactIds && Array.isArray(contactIds) && contactIds.length > 0) {
      const dbContacts = getContactsByIds(contactIds);
      phones = dbContacts.map((c) => c.phone);
    }

    // Add direct phone numbers
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      phones = phones.concat(contacts.map(normalizePhone));
    }

    // Remove duplicates and filter empty values
    phones = Array.from(new Set(phones.filter(Boolean)));

    if (phones.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No contacts provided. Include contacts array or contactIds.',
        },
        { status: 400 }
      );
    }

    // Compose message
    const prefix = '🚨 ALERTA! O ICE ACABOU DE ME PEGAR. ';
    let message: string;

    if (location && location.lat && location.lng) {
      // Get human-readable address
      const geocode = await reverseGeocode(location.lat, location.lng, {
        countryBias: 'us',
        acceptLanguage: 'en',
      });

      const baseMessage =
        customMessage || `Preciso de ajuda! Estou em: ${geocode.short}`;
      message = `${prefix}${baseMessage}\n\n📍 Localização: https://maps.google.com/?q=${location.lat},${location.lng}`;
    } else {
      message = `${prefix}${customMessage || 'Preciso de ajuda urgente!'}`;
    }

    // Save panic event to database
    const panicEventId = createPanicEvent(
      message,
      location?.lat || null,
      location?.lng || null,
      meta ? JSON.stringify(meta) : null
    );

    // Send messages to all contacts
    const results: PanicResult[] = [];

    for (const phone of phones) {
      try {
        console.log(`📤 Sending WhatsApp to ${phone}...`);

        const { sid } = await sendWhatsAppMessage(phone, message);

        // Save success result
        createPanicResult(panicEventId, phone, 'sent', sid);

        results.push({
          phone,
          status: 'sent',
          sid,
        });

        console.log(`✅ Sent to ${phone}: ${sid}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Failed to send to ${phone}:`, errorMessage);

        // Save error result
        createPanicResult(panicEventId, phone, 'failed', undefined, errorMessage);

        results.push({
          phone,
          status: 'failed',
          error: errorMessage,
        });
      }
    }

    // Calculate summary
    const successCount = results.filter((r) => r.status === 'sent').length;

    const response: PanicResponse = {
      success: successCount > 0,
      panicEventId,
      message,
      results,
      summary: {
        total: results.length,
        sent: successCount,
        failed: results.length - successCount,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Panic alert error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
