/**
 * Next.js API Route: /api/contacts/[id]
 * GET - Get contact by ID
 * PUT - Update contact
 * DELETE - Delete contact
 */

import { NextRequest, NextResponse } from 'next/server';
import type { UpdateContactRequest, ContactResponse } from '@/types/api';
import {
  getContactById,
  updateContact,
  deleteContact,
} from '@/lib/database';
import { normalizePhone, isValidE164Phone } from '@/lib/helpers';

/**
 * GET /api/contacts/[id]
 * Get contact by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id, 10);
    
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      );
    }
    
    const contact = getContactById(contactId);
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    const response: ContactResponse = {
      contact,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Get contact error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contacts/[id]
 * Update contact
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id, 10);
    
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json() as UpdateContactRequest;
    const { name, phone, opt_in } = body;
    
    // Validate phone if provided
    let normalizedPhone: string | undefined;
    if (phone) {
      normalizedPhone = normalizePhone(phone);
      if (!isValidE164Phone(normalizedPhone)) {
        return NextResponse.json(
          {
            error: `Invalid phone number format. Must be E.164 format (e.g., +15085140864). Got: ${normalizedPhone}`,
          },
          { status: 400 }
        );
      }
    }
    
    // Update contact
    const contact = updateContact(contactId, {
      name,
      phone: normalizedPhone,
      opt_in,
    });
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    const response: ContactResponse = {
      contact,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contacts/[id]
 * Delete contact
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id, 10);
    
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: 'Invalid contact ID' },
        { status: 400 }
      );
    }
    
    const success = deleteContact(contactId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
