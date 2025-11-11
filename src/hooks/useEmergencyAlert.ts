/**
 * Custom React hook for managing emergency alert functionality
 */

import { useState, useCallback } from 'react';
import { sendEmergencyAlert, reverseGeocode, EmergencyPayload } from '@/lib/api';
import { Coordinates } from '@/lib/geolocation';

interface UseEmergencyAlertResult {
  sendAlert: (coordinates: Coordinates, phoneNumber: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useEmergencyAlert = (): UseEmergencyAlertResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendAlert = useCallback(async (coordinates: Coordinates, phoneNumber: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get address from coordinates
      const address = await reverseGeocode(coordinates);
      
      // Prepare message with address
      const message = `🚨 EMERGENCY ALERT! I need help! I am at: ${address}`;

      const payload: EmergencyPayload = {
        phoneNumber,
        message,
        location: coordinates,
      };

      await sendEmergencyAlert(payload);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send alert';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendAlert,
    loading,
    error,
    success,
  };
};
