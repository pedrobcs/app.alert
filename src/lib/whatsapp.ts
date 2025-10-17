/**
 * WhatsApp Messaging Client (Client-Side Safe)
 * 
 * This module provides a client-side interface for sending WhatsApp messages.
 * It proxies requests through our secure API route which handles Twilio credentials.
 * 
 * ✅ SECURITY: This code is safe for browser use
 * ⚠️ Twilio credentials are NEVER exposed to the client
 */

export interface WhatsAppMessage {
  to: string;
  message: string;
}

export interface WhatsAppResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  error?: string;
  details?: string;
}

/**
 * Send a WhatsApp message via our secure API endpoint
 * 
 * This function calls our server-side API route which handles
 * Twilio credentials securely. The credentials never reach the browser.
 * 
 * @param to - Recipient phone number in E.164 format (e.g., +1234567890)
 * @param message - Message content to send
 * @returns Promise with response data
 * 
 * @example
 * ```typescript
 * const result = await sendWhatsAppMessage(
 *   '+15551234567',
 *   'Emergency! I need help at my current location.'
 * );
 * 
 * if (result.success) {
 *   console.log('Message sent:', result.messageId);
 * } else {
 *   console.error('Failed:', result.error);
 * }
 * ```
 */
export const sendWhatsAppMessage = async (
  to: string,
  message: string
): Promise<WhatsAppResponse> => {
  // Validate input
  if (!to || !message) {
    return {
      success: false,
      error: 'Recipient and message are required',
    };
  }

  // Basic phone number format validation
  if (!to.match(/^\+[1-9]\d{1,14}$/)) {
    return {
      success: false,
      error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)',
    };
  }

  try {
    // Call our secure server-side API endpoint
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `Request failed with status ${response.status}`,
        details: data.details,
      };
    }

    return {
      success: true,
      message: data.message || 'WhatsApp message sent successfully',
      messageId: data.messageId,
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Send emergency WhatsApp alerts to multiple contacts
 * 
 * @param contacts - Array of phone numbers in E.164 format
 * @param message - Emergency message to send
 * @returns Promise with array of results for each contact
 * 
 * @example
 * ```typescript
 * const results = await sendEmergencyAlerts(
 *   ['+15551234567', '+15559876543'],
 *   'Emergency at: https://maps.google.com/?q=40.7128,-74.0060'
 * );
 * 
 * const successful = results.filter(r => r.success).length;
 * console.log(`Sent to ${successful}/${results.length} contacts`);
 * ```
 */
export const sendEmergencyAlerts = async (
  contacts: string[],
  message: string
): Promise<WhatsAppResponse[]> => {
  if (!contacts || contacts.length === 0) {
    return [{
      success: false,
      error: 'No contacts provided',
    }];
  }

  // Send to all contacts in parallel
  const promises = contacts.map(contact =>
    sendWhatsAppMessage(contact, message)
  );

  return Promise.all(promises);
};
