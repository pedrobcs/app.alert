/**
 * Client-side emergency alert hook
 * No backend required - uses device capabilities
 */

import { useState, useCallback } from 'react';
import type { Coordinates } from '@/lib/geolocation';
import {
  formatEmergencyMessage,
  sendMultipleAlerts,
  shareEmergencyMessage,
  vibrateDevice,
  playAlertSound,
  type EmergencyContact,
} from '@/lib/client-messaging';
import { getPrimaryContacts } from '@/lib/contacts-storage';
import { reverseGeocode } from '@/lib/api';

interface UseClientAlertResult {
  sendAlert: (coordinates: Coordinates) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useClientAlert = (): UseClientAlertResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendAlert = useCallback(async (coordinates: Coordinates) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get contacts from localStorage
      const storedContacts = getPrimaryContacts();
      
      if (storedContacts.length === 0) {
        throw new Error('Nenhum contato de emergência configurado. Adicione contatos nas configurações.');
      }

      // Convert to EmergencyContact format
      const contacts: EmergencyContact[] = storedContacts.map(c => ({
        name: c.name,
        phone: c.phone,
        method: c.method,
      }));

      // Get address from coordinates
      const address = await reverseGeocode(coordinates);
      
      // Format emergency message
      const message = formatEmergencyMessage(address, coordinates);

      // Play alert sound and vibrate
      playAlertSound();
      vibrateDevice([200, 100, 200, 100, 200]);

      // Try Web Share API first (if available)
      const shared = await shareEmergencyMessage(message);
      
      if (shared) {
        // User used share menu successfully
        setSuccess(true);
      } else {
        // Fallback: Open messaging apps directly
        await sendMultipleAlerts(contacts, message, {
          delay: 800, // Delay between opening apps
          preferWhatsApp: true,
        });
        setSuccess(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Falha ao enviar alerta';
      setError(errorMessage);
      console.error('Alert error:', err);
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
