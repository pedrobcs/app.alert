'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppTest() {
  const [toNumber, setToNumber] = useState('');
  const [message, setMessage] = useState('Hello from Next.js!');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setStatus('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toNumber, message }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus(`✓ Message sent successfully! SID: ${data.sid}`);
      } else {
        setStatus(`✗ Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
      }
    } catch (error) {
      setStatus(`✗ Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Send WhatsApp Message
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Test your Twilio WhatsApp integration
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="toNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Number
            </label>
            <input
              id="toNumber"
              type="text"
              placeholder="+1234567890"
              value={toNumber}
              onChange={(e) => setToNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !toNumber || !message}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading || !toNumber || !message
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>

          {status && (
            <div
              className={`p-4 rounded-lg ${
                status.startsWith('✓')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p className="text-sm font-medium whitespace-pre-wrap">{status}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Important Notes:</h3>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Configure your Twilio credentials in <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
            <li>If using Twilio Sandbox, recipients must opt-in first by sending &quot;join &lt;keyword&gt;&quot;</li>
            <li>For production, you need an approved WhatsApp Business Account</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Emergency Alert
          </Link>
        </div>
      </div>
    </div>
  );
}
