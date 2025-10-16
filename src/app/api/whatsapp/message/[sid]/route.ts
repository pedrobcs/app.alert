import { NextRequest, NextResponse } from "next/server";
import { getTwilioClient } from "@/lib/twilio";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ sid: string }> }
) {
  try {
    const { sid } = await context.params;
    const client = getTwilioClient();
    const message = await client.messages.get(sid).fetch();
    return NextResponse.json({
      sid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      errorCode: (message as unknown as { errorCode?: string }).errorCode,
      errorMessage: (message as unknown as { errorMessage?: string }).errorMessage,
    });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: "Failed to fetch message", details: err?.message },
      { status: 500 }
    );
  }
}
