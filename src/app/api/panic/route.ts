import { NextResponse } from "next/server";
import twilio from "twilio";

type PanicRequestBody = {
  contacts?: unknown;
  message?: unknown;
  location?: unknown;
};

const ensureWhatsAppPrefix = (value: string): string => {
  const trimmed = value.trim();
  return trimmed.startsWith("whatsapp:") ? trimmed : `whatsapp:${trimmed.replace(/^whatsapp:/, "")}`;
};

// Configure the Twilio credentials in Vercel → Project Settings → Environment Variables before deploying.
export async function POST(request: Request) {
  let body: PanicRequestBody;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Invalid JSON body for panic alert request.", error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { contacts, message } = body;

  if (!Array.isArray(contacts) || contacts.length === 0) {
    return NextResponse.json(
      { success: false, error: "At least one contact number is required." },
      { status: 400 }
    );
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Message text is required." },
      { status: 400 }
    );
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    console.error("Missing Twilio credentials for panic alert endpoint.");
    return NextResponse.json(
      {
        success: false,
        error: "Twilio credentials are not configured.",
      },
      { status: 500 }
    );
  }

  const client = twilio(accountSid, authToken);

  const defaultTestRecipient = process.env.TWILIO_WHATSAPP_TEST_TO || "whatsapp:+15085140864";

  const recipientCandidates = [
    ...contacts,
    process.env.TWILIO_WHATSAPP_TO,
    defaultTestRecipient,
  ];

  const recipients = recipientCandidates
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map(ensureWhatsAppPrefix)
    .map((value) => value.replace(/\s+/g, ""));

  const uniqueRecipients = Array.from(new Set(recipients));

  if (uniqueRecipients.length === 0) {
    return NextResponse.json(
      { success: false, error: "No valid WhatsApp recipients provided." },
      { status: 400 }
    );
  }

  try {
    await Promise.all(
      uniqueRecipients.map((to) =>
        client.messages.create({
          from,
          to,
          body: message.trim(),
        })
      )
    );

    return NextResponse.json({ success: true, recipients: uniqueRecipients.length });
  } catch (error) {
    console.error("Failed to dispatch panic alert messages via Twilio.", error);
    return NextResponse.json(
      { success: false, error: "Failed to send WhatsApp messages." },
      { status: 500 }
    );
  }
}
