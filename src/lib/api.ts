/**
 * API client for emergency alert backend communication
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
 * Get API base URL from environment or use default
 * If not set, uses Next.js API routes (integrated backend)
 */
const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

/**
 * Sends emergency alert to backend
 * @param payload Emergency data including contacts, message, and location
 * @returns Promise with response data
 */
export const sendEmergencyAlert = async (
  payload: EmergencyPayload
): Promise<EmergencyResponse> => {
  const apiUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiUrl}/panic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return {
      success: data.success || true,
      message: data.message || 'Emergency alert sent successfully',
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
