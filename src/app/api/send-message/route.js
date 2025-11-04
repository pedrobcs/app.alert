import { NextResponse } from "next/server";
import twilio from "twilio";

// Add the TWILIO_* environment variables in Vercel → Project Settings → Environment Variables.
// After deploying, click the "Send WhatsApp Message" button on the live site to test this endpoint.

export async function POST() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.TWILIO_WHATSAPP_TO;

  if (!accountSid || !authToken || !from || !to) {
    console.error("Missing Twilio environment variables for WhatsApp messaging.");
    return NextResponse.json(
      { success: false, error: "Twilio configuration is incomplete." },
      { status: 500 }
    );
  }

  try {
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      from,
      to,
      body: "🔥 Message sent successfully from the website button!",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send WhatsApp message via Twilio.", error);
    return NextResponse.json(
      { success: false, error: "Failed to send WhatsApp message." },
      { status: 500 }
    );
  }
}
