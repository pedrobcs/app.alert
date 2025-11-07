/**
 * Twilio client configuration
 */

import twilio from 'twilio';

// Twilio credentials from environment variables
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886',
  TWILIO_FROM,
} = process.env;

// Validate required credentials
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('⚠️  WARNING: Twilio credentials not configured');
  console.error('   Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env.local');
}

// Create Twilio client
export const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

// Export configuration
export const twilioConfig = {
  whatsappFrom: TWILIO_WHATSAPP_FROM,
  smsFrom: TWILIO_FROM,
  isConfigured: !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN),
};

/**
 * Send WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<{ sid: string }> {
  if (!twilioClient) {
    throw new Error('Twilio client not configured. Check environment variables.');
  }
  
  const message = await twilioClient.messages.create({
    from: twilioConfig.whatsappFrom,
    to: `whatsapp:${to}`,
    body,
  });
  
  return { sid: message.sid };
}

/**
 * Send SMS message via Twilio
 */
export async function sendSMSMessage(
  to: string,
  body: string
): Promise<{ sid: string }> {
  if (!twilioClient) {
    throw new Error('Twilio client not configured. Check environment variables.');
  }
  
  if (!twilioConfig.smsFrom) {
    throw new Error('TWILIO_FROM not configured. Set it in .env.local for SMS support.');
  }
  
  const message = await twilioClient.messages.create({
    from: twilioConfig.smsFrom,
    to,
    body,
  });
  
  return { sid: message.sid };
}
