import { NextResponse } from 'next/server';
import twilio from 'twilio';

export const runtime = 'nodejs';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

const hasTwilioConfig = () => Boolean(accountSid && authToken && whatsappFrom);

const isValidContact = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const formatWhatsappNumber = (value: string) =>
  value.startsWith('whatsapp:') ? value : `whatsapp:${value}`;

const twilioClient = hasTwilioConfig() ? twilio(accountSid!, authToken!) : null;

export async function POST(request: Request) {
  if (!hasTwilioConfig() || !twilioClient) {
    return NextResponse.json(
      { success: false, error: 'Twilio environment variables are not configured.' },
      { status: 500 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error('Invalid JSON payload', error);
    return NextResponse.json(
      { success: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const { contacts, message, location } = (payload ?? {}) as {
    contacts?: unknown;
    message?: unknown;
    location?: unknown;
  };

  if (!Array.isArray(contacts) || contacts.length === 0 || !contacts.every(isValidContact)) {
    return NextResponse.json(
      { success: false, error: 'Contacts array is required and must contain valid phone numbers.' },
      { status: 400 }
    );
  }

  if (typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Message is required.' },
      { status: 400 }
    );
  }

  if (
    !location ||
    typeof (location as Record<string, unknown>).lat !== 'number' ||
    typeof (location as Record<string, unknown>).lng !== 'number'
  ) {
    return NextResponse.json(
      { success: false, error: 'Location with numeric lat and lng is required.' },
      { status: 400 }
    );
  }

  try {
    await Promise.all(
      contacts.map((contact) =>
        twilioClient.messages.create({
          from: whatsappFrom!,
          to: formatWhatsappNumber(contact as string),
          body: message,
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Emergency alert sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Emergency alert Twilio error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to send emergency alert via Twilio.' },
      { status: 502 }
    );
  }
}
