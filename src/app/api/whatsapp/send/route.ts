import { NextRequest, NextResponse } from "next/server";
import { getTwilioClient, getWhatsAppFrom, formatWhatsAppTo } from "@/lib/twilio";
import type { MessageListInstanceCreateOptions } from "twilio/lib/rest/api/v2010/account/message";

export const runtime = "nodejs";

function computeCallbackUrl(request: NextRequest) {
  const envBase = process.env.PUBLIC_BASE_URL;
  if (envBase) return new URL("/api/whatsapp/status", envBase).toString();
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const origin = host ? `${proto}://${host}` : request.nextUrl.origin;
  return new URL("/api/whatsapp/status", origin).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const toRaw = typeof body.to === "string" ? body.to : process.env.NEXT_PUBLIC_WHATSAPP_TEST_TO;
    const messageBody =
      typeof body.body === "string" && body.body.trim()
        ? body.body.trim()
        : "Hello from Next.js via Twilio WhatsApp 👋";

    if (!toRaw) {
      return NextResponse.json({ error: 'Missing "to" phone number' }, { status: 400 });
    }

    const client = getTwilioClient();
    const { from, messagingServiceSid } = getWhatsAppFrom();

    const createParams: MessageListInstanceCreateOptions = {
      to: formatWhatsAppTo(toRaw),
      body: messageBody,
      statusCallback: computeCallbackUrl(request),
    };

    if (messagingServiceSid) {
      createParams.messagingServiceSid = messagingServiceSid;
    } else if (from) {
      createParams.from = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;
    }

    const message = await client.messages.create(createParams);

    return NextResponse.json({
      sid: message.sid,
      apiStatus: message.status,
      to: createParams.to,
      from: createParams.from ?? `messagingServiceSid:${createParams.messagingServiceSid}`,
      statusCallback: createParams.statusCallback,
    });
  } catch (error) {
    const err = error as { message?: string; code?: number };
    return NextResponse.json(
      {
        error: "Failed to send WhatsApp message",
        details: err?.message,
        code: err?.code,
      },
      { status: 500 }
    );
  }
}
