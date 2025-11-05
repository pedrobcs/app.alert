import { NextResponse } from "next/server";
import twilio from "twilio";

// Add the TWILIO_* environment variables in Vercel → Project Settings → Environment Variables.
// Optionally set TWILIO_WHATSAPP_TEST_TO (defaults to whatsapp:+15085140864) for sandbox testing.
// After deploying, click the "Send WhatsApp Message" button on the live site to test this endpoint.

export async function POST() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const primaryRecipient = process.env.TWILIO_WHATSAPP_TO;
  const testRecipient = process.env.TWILIO_WHATSAPP_TEST_TO || "whatsapp:+15085140864";

  if (!accountSid || !authToken || !from || (!primaryRecipient && !testRecipient)) {
    console.error("Missing Twilio environment variables for WhatsApp messaging.");
    return NextResponse.json(
      { success: false, error: "Twilio configuration is incomplete." },
      { status: 500 }
    );
  }

  try {
    const client = twilio(accountSid, authToken);

    const recipients = [primaryRecipient, testRecipient]
      .filter(Boolean)
      .map((value) => value.startsWith("whatsapp:") ? value : `whatsapp:${value}`);

    const uniqueRecipients = Array.from(new Set(recipients));

    await Promise.all(
      uniqueRecipients.map((to) =>
        client.messages.create({
          from,
          to,
          body: "🔥 Message sent successfully from the website button!",
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send WhatsApp message via Twilio.", error);
    return NextResponse.json(
      { success: false, error: "Failed to send WhatsApp message." },
      { status: 500 }
    );
  }
}
