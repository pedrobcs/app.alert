/**
 * Debug endpoint to check environment variables
 * This helps verify if Twilio credentials are loaded in Vercel
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER;
  const mockMode = process.env.MOCK_TWILIO === 'true';
  const nodeEnv = process.env.NODE_ENV || 'development';

  const response = {
    environment: nodeEnv,
    mockMode: mockMode,
    variables: {
      TWILIO_ACCOUNT_SID: accountSid ? `${accountSid.substring(0, 4)}...${accountSid.substring(accountSid.length - 4)}` : '❌ NOT SET',
      TWILIO_AUTH_TOKEN: authToken ? '✅ SET (hidden)' : '❌ NOT SET',
      TWILIO_WHATSAPP_NUMBER: twilioPhone || '❌ NOT SET',
      MOCK_TWILIO: mockMode ? '✅ ENABLED' : '❌ DISABLED',
    },
    status: mockMode && nodeEnv === 'development' 
      ? '✅ Ready (Mock Mode - No Twilio required)' 
      : accountSid && authToken && twilioPhone 
        ? '✅ Ready (Production Mode - Twilio configured)' 
        : '⚠️ Missing Twilio credentials',
    instructions: mockMode && nodeEnv === 'development'
      ? 'Running in mock mode. Emergency alerts will be simulated without sending real messages.'
      : !accountSid || !authToken || !twilioPhone
        ? 'To enable mock mode: Set MOCK_TWILIO=true in .env.local. To use real Twilio: Configure TWILIO_* variables.'
        : 'All Twilio credentials configured. Ready to send real WhatsApp messages.',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('TWILIO') || key.includes('MOCK')),
  };

  return NextResponse.json(response);
}
