import Twilio from "twilio";

let cachedClient: ReturnType<typeof Twilio> | null = null;

export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) {
    throw new Error(
      "Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN environment variables"
    );
  }
  if (cachedClient) return cachedClient;
  cachedClient = Twilio(accountSid, authToken);
  return cachedClient;
}

export function getWhatsAppFrom() {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  if (!from && !messagingServiceSid) {
    throw new Error(
      "Set TWILIO_WHATSAPP_FROM (e.g. whatsapp:+14155238886) or TWILIO_MESSAGING_SERVICE_SID"
    );
  }
  return { from, messagingServiceSid };
}

export function formatWhatsAppTo(value: string) {
  const trimmed = (value || "").trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("whatsapp:")) return trimmed;
  return `whatsapp:${trimmed}`;
}
