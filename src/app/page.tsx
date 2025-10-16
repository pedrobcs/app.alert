"use client";

import { useEffect, useState } from "react";

type SendResponse = {
  sid: string;
  apiStatus: string;
  to: string;
  from: string;
  statusCallback: string;
};

export default function Home() {
  const [to, setTo] = useState<string>(
    process.env.NEXT_PUBLIC_WHATSAPP_TEST_TO || ""
  );
  const [body, setBody] = useState<string>(
    "Hello from Next.js via Twilio WhatsApp 👋"
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<SendResponse | null>(null);
  const [delivery, setDelivery] = useState<
    | { status: string; timestamp: string; errorCode?: string; errorMessage?: string }
    | null
  >(null);

  useEffect(() => {
    if (!lastMessage?.sid) return;
    let active = true;
    const controller = new AbortController();

    async function poll() {
      if (!lastMessage?.sid) return;
      try {
        const res = await fetch(`/api/whatsapp/status?sid=${lastMessage.sid}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (active) setDelivery({ status: data.status, timestamp: data.timestamp });
        } else if (res.status === 404) {
          // not yet in memory store; try Twilio fetch as fallback
          const tw = await fetch(`/api/whatsapp/message/${lastMessage.sid}`);
          if (tw.ok) {
            const m = await tw.json();
            if (active) {
              setDelivery({
                status: m.status,
                timestamp: new Date().toISOString(),
                errorCode: m.errorCode,
                errorMessage: m.errorMessage,
              });
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }

    const interval = setInterval(poll, 2500);
    poll();
    return () => {
      active = false;
      controller.abort();
      clearInterval(interval);
    };
  }, [lastMessage?.sid]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    setLastMessage(null);
    setDelivery(null);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.details || data?.error || "Failed to send");
      setLastMessage(data as SendResponse);
    } catch (error) {
      const err = error as { message?: string };
      setError(err?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">WhatsApp Test Sender</h1>

      <form onSubmit={handleSend} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">To (E.164): e.g. +15085140864</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="+15085140864"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Message</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send WhatsApp"}
        </button>
      </form>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {lastMessage && (
        <div className="border rounded p-4 space-y-1">
          <div className="text-sm">SID: <code>{lastMessage.sid}</code></div>
          <div className="text-sm">API status: {lastMessage.apiStatus}</div>
          <div className="text-sm">To: {lastMessage.to}</div>
          <div className="text-sm">From: {lastMessage.from}</div>
          <div className="text-sm break-all">Callback: {lastMessage.statusCallback}</div>
        </div>
      )}

      {delivery && (
        <div className="border rounded p-4 space-y-1">
          <div className="text-sm">Delivery status: {delivery.status || "unknown"}</div>
          <div className="text-sm">Updated: {new Date(delivery.timestamp).toLocaleString()}</div>
          {delivery.errorCode && (
            <div className="text-sm text-red-600">Error {delivery.errorCode}: {delivery.errorMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}
