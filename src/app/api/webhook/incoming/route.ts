/**
 * Next.js API Route: POST /api/webhook/incoming
 * Webhook for incoming Twilio messages (opt-in/opt-out)
 * 
 * Set this URL in Twilio Console:
 * "WHEN A MESSAGE COMES IN" -> https://your-domain.com/api/webhook/incoming
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateContactOptIn } from '@/lib/database';
import { sendWhatsAppMessage, twilioConfig } from '@/lib/twilio';

export async function POST(request: NextRequest) {
  try {
    // Twilio sends form-encoded data, but Next.js automatically parses it
    const formData = await request.formData();
    
    const from = formData.get('From') as string; // e.g., "whatsapp:+15085140864"
    const body = formData.get('Body') as string || '';
    
    console.log('📥 Incoming message from:', from, 'Body:', body);
    
    // Extract phone number
    const phone = (from || '').replace('whatsapp:', '');
    
    if (!phone) {
      return NextResponse.json({ ok: true });
    }
    
    const lower = body.trim().toLowerCase();
    
    // Handle opt-in
    if (lower.startsWith('join') || lower.includes('quero') || lower.includes('sim')) {
      // Update contact with opt-in
      updateContactOptIn(phone, true);
      
      // Send confirmation
      if (twilioConfig.isConfigured) {
        try {
          await sendWhatsAppMessage(
            phone,
            '✅ Obrigado! Você está inscrito(a) para receber alertas de emergência.'
          );
        } catch (error) {
          console.error('Error sending confirmation:', error);
        }
      }
      
      console.log(`✅ User ${phone} opted in`);
    }
    
    // Handle opt-out
    if (lower === 'stop' || lower === 'parar' || lower === 'sair') {
      // Update contact with opt-out
      updateContactOptIn(phone, false);
      
      // Send confirmation
      if (twilioConfig.isConfigured) {
        try {
          await sendWhatsAppMessage(
            phone,
            '❌ Você saiu dos alertas. Envie "join" para voltar a receber alertas.'
          );
        } catch (error) {
          console.error('Error sending confirmation:', error);
        }
      }
      
      console.log(`❌ User ${phone} opted out`);
    }
    
    // Twilio expects 200 OK
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
