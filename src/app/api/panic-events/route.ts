/**
 * Next.js API Route: GET /api/panic-events
 * Get all panic events (history)
 */

import { NextResponse } from 'next/server';
import type { PanicEventsResponse } from '@/types/api';
import { getAllPanicEvents } from '@/lib/database';

export async function GET() {
  try {
    const events = getAllPanicEvents(50); // Limit to 50 most recent
    
    const response: PanicEventsResponse = {
      events,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Get panic events error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
