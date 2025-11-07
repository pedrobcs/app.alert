/**
 * Next.js API Route: GET /api/panic-events/[id]
 * Get panic event details with results
 */

import { NextRequest, NextResponse } from 'next/server';
import type { PanicEventDetailsResponse } from '@/types/api';
import { getPanicEventById, getPanicEventResults } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id, 10);
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    const event = getPanicEventById(eventId);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    const results = getPanicEventResults(eventId);
    
    const response: PanicEventDetailsResponse = {
      event,
      results,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Get panic event error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
