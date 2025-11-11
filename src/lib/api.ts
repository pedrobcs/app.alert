/**
 * API client for emergency alert backend communication
 * Now uses built-in Twilio API route instead of external API
 */

import { Coordinates } from './geolocation';

export interface EmergencyPayload {
  contacts: string[];
  message: string;
  location: Coordinates;
}

export interface EmergencyResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Sends emergency alert using Twilio WhatsApp API
 * @param payload Emergency data including contacts, message, and location
 * @returns Promise with response data
 */
export const sendEmergencyAlert = async (
  payload: EmergencyPayload
): Promise<EmergencyResponse> => {
  try {
    // Add location link to the message
    const googleMapsLink = `https://www.google.com/maps?q=${payload.location.lat},${payload.location.lng}`;
    const fullMessage = `${payload.message}\n\n📍 Localização exata:\nLatitude: ${payload.location.lat}\nLongitude: ${payload.location.lng}\n\n🗺️ Ver no mapa: ${googleMapsLink}`;

    // Send message to each contact using Twilio API
    const sendPromises = payload.contacts.map(async (contact) => {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: contact,
          message: fullMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to send message to ${contact}`
        );
      }

      return response.json();
    });

    // Wait for all messages to be sent
    await Promise.all(sendPromises);

    return {
      success: true,
      message: 'Emergency alert sent successfully to all contacts',
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get human-readable address
 * Using browser's built-in geocoding or OpenStreetMap Nominatim API
 */
export const reverseGeocode = async (coords: Coordinates): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SafeAlert Emergency App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    
    if (data.display_name) {
      return data.display_name;
    }

    // Fallback to coordinates if no address found
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    // Return coordinates as fallback
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  }
};
