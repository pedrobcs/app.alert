/**
 * Next.js API Route: /api/contacts
 * GET - Get all contacts
 * POST - Create new contact
 */

import { NextRequest, NextResponse } from 'next/server';
import type { CreateContactRequest, ContactsResponse, ContactResponse } from '@/types/api';
import { createContact, getAllContacts } from '@/lib/database';
import { normalizePhone, isValidE164Phone } from '@/lib/helpers';

/**
 * GET /api/contacts
 * Get all contacts
 */
export async function GET() {
  try {
    const contacts = getAllContacts();
    
    const response: ContactsResponse = {
      contacts,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contacts
 * Create a new contact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateContactRequest;
    const { name, phone, opt_in } = body;
    
    // Validate phone number
    if (!phone) {
      return NextResponse.json(
        {
          error: 'phone required (E.164 format e.g. +15085140864)',
        },
        { status: 400 }
      );
    }
    
    const normalizedPhone = normalizePhone(phone);
    
    if (!isValidE164Phone(normalizedPhone)) {
      return NextResponse.json(
        {
          error: `Invalid phone number format. Must be E.164 format (e.g., +15085140864). Got: ${normalizedPhone}`,
        },
        { status: 400 }
      );
    }
    
    // Create contact
    const contact = createContact(
      name || null,
      normalizedPhone,
      opt_in || false
    );
    
    if (!contact) {
      return NextResponse.json(
        {
          error: 'Failed to create contact. Phone number may already exist.',
        },
        { status: 500 }
      );
    }
    
    const response: ContactResponse = {
      contact,
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
