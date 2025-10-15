"use client";

import { useState } from "react";

interface Contact {
  id: number;
  name: string;
  phone: string;
}

export default function Home() {
  const [contacts] = useState<Contact[]>([
    { id: 1, name: "John Doe", phone: "+1234567890" },
    { id: 2, name: "Jane Smith", phone: "+0987654321" },
    { id: 3, name: "Bob Johnson", phone: "+1122334455" },
  ]);

  const [sendingStatus, setSendingStatus] = useState<{ [key: number]: string }>({});
  const [message, setMessage] = useState("Hello! This is a test message from WhatsApp via Twilio.");

  const sendWhatsAppMessage = async (contact: Contact) => {
    setSendingStatus(prev => ({ ...prev, [contact.id]: 'sending' }));

    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: contact.phone,
          message: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendingStatus(prev => ({ ...prev, [contact.id]: 'success' }));
        setTimeout(() => {
          setSendingStatus(prev => ({ ...prev, [contact.id]: '' }));
        }, 3000);
      } else {
        setSendingStatus(prev => ({ ...prev, [contact.id]: 'error' }));
        alert(`Error: ${data.error || 'Failed to send message'}\n${data.details || ''}`);
        setTimeout(() => {
          setSendingStatus(prev => ({ ...prev, [contact.id]: '' }));
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setSendingStatus(prev => ({ ...prev, [contact.id]: 'error' }));
      alert('Network error. Please check your connection and try again.');
      setTimeout(() => {
        setSendingStatus(prev => ({ ...prev, [contact.id]: '' }));
      }, 3000);
    }
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">WhatsApp Message Sender</h1>
        
        {/* Message Input */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message to Send
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Enter your message here..."
          />
        </div>

        {/* Contact List */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contacts</h2>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{contact.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</p>
                </div>
                <button
                  onClick={() => sendWhatsAppMessage(contact)}
                  disabled={sendingStatus[contact.id] === 'sending'}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
                    sendingStatus[contact.id] === 'sending'
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : sendingStatus[contact.id] === 'success'
                      ? 'bg-green-500 text-white'
                      : sendingStatus[contact.id] === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {sendingStatus[contact.id] === 'sending'
                    ? 'Sending...'
                    : sendingStatus[contact.id] === 'success'
                    ? '✓ Sent'
                    : sendingStatus[contact.id] === 'error'
                    ? '✗ Failed'
                    : 'Send WhatsApp'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Make sure your Twilio credentials are configured in your environment variables and the phone numbers are registered in your Twilio WhatsApp sandbox.
          </p>
        </div>
      </main>
    </div>
  );
}
