import { NextRequest, NextResponse } from "next/server";
import Twilio from "twilio";

export const runtime = "nodejs";

const messageStatusStore = new Map<
  string,
  { status: string; timestamp: string; raw: Record<string, string | undefined> }
>();

function computePublicUrl(request: NextRequest) {
  const envBase = process.env.PUBLIC_BASE_URL;
  if (envBase) return new URL(request.nextUrl.pathname, envBase).toString();
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const origin = host ? `${proto}://${host}` : request.nextUrl.origin;
  return new URL(request.nextUrl.pathname, origin).toString();
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const params: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") params[key] = value;
  }

  const signature = request.headers.get("x-twilio-signature") || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (authToken) {
    const url = computePublicUrl(request);
    const valid = Twilio.validateRequest(authToken, signature, url, params);
    if (!valid) {
      return new NextResponse("Invalid signature", { status: 403 });
    }
  }

  const sid = params["MessageSid"] || params["SmsSid"] || "";
  const status = params["MessageStatus"] || "";
  const timestamp = new Date().toISOString();

  if (sid) {
    messageStatusStore.set(sid, { status, timestamp, raw: params });
    console.log(
      "[Twilio WhatsApp Status]",
      sid,
      status,
      params["ErrorCode"],
      params["ErrorMessage"]
    );
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const sid = request.nextUrl.searchParams.get("sid");
  if (!sid) {
    return NextResponse.json({ error: "sid is required" }, { status: 400 });
  }
  const current = messageStatusStore.get(sid);
  if (!current) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(current);
}
