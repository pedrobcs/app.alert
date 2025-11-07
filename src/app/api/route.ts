/**
 * Next.js API Route: GET /api
 * Health check endpoint
 */

import { NextResponse } from 'next/server';
import type { HealthResponse } from '@/types/api';

export async function GET() {
  const response: HealthResponse = {
    ok: true,
    service: 'SafeAlert Backend',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };
  
  return NextResponse.json(response);
}
