/**
 * Debug endpoint to check environment variables
 * This helps verify if Twilio credentials are loaded in Vercel
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_WHATSAPP_NUMBER;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    variables: {
      TWILIO_ACCOUNT_SID: accountSid ? `${accountSid.substring(0, 4)}...${accountSid.substring(accountSid.length - 4)}` : '❌ NOT SET',
      TWILIO_AUTH_TOKEN: authToken ? '✅ SET (hidden)' : '❌ NOT SET',
      TWILIO_WHATSAPP_NUMBER: twilioPhone || '❌ NOT SET',
    },
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('TWILIO')),
  });
}
