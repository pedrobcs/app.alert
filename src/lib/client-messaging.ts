/**
 * Client-side messaging utilities
 * No backend required - uses native device capabilities
 */

import type { Coordinates } from './geolocation';

export interface EmergencyContact {
  name: string;
  phone: string;
  method: 'sms' | 'whatsapp' | 'both';
}

/**
 * Format emergency message with location
 */
export function formatEmergencyMessage(
  address: string,
  coordinates?: Coordinates
): string {
  const baseMessage = '🚨 EMERGÊNCIA! O ICE ACABOU DE ME PEGAR. Preciso de ajuda urgente!';
  
  if (coordinates) {
    const mapsLink = `https://maps.google.com/?q=${coordinates.lat},${coordinates.lng}`;
    return `${baseMessage}\n\n📍 Localização: ${address}\n${mapsLink}`;
  }
  
  return `${baseMessage}\n\n📍 Localização: ${address}`;
}

/**
 * Open SMS app with pre-filled message
 * Works on all mobile devices
 */
export function openSMS(phone: string, message: string): void {
  // Format phone number (remove non-digits except +)
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Different formats for iOS and Android
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  let smsLink: string;
  if (isIOS) {
    // iOS format: sms:+1234567890&body=message
    smsLink = `sms:${cleanPhone}&body=${encodedMessage}`;
  } else {
    // Android format: sms:+1234567890?body=message
    smsLink = `sms:${cleanPhone}?body=${encodedMessage}`;
  }
  
  window.open(smsLink, '_self');
}

/**
 * Open WhatsApp with pre-filled message
 * Works on mobile and desktop
 */
export function openWhatsApp(phone: string, message: string): void {
  // Remove all non-digits except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  // Remove + for WhatsApp API
  const whatsappPhone = cleanPhone.replace('+', '');
  
  // Encode message
  const encodedMessage = encodeURIComponent(message);
  
  // WhatsApp URL (works on mobile and desktop)
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
  
  window.open(whatsappLink, '_blank');
}

/**
 * Use Web Share API to share message
 * User can choose any app (WhatsApp, SMS, Email, etc.)
 */
export async function shareEmergencyMessage(
  message: string,
  title = '🚨 Alerta de Emergência'
): Promise<boolean> {
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return false;
  }
  
  try {
    await navigator.share({
      title,
      text: message,
    });
    return true;
  } catch (error) {
    // User cancelled or share failed
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Send alert to multiple contacts
 * Opens each messaging app in sequence
 */
export async function sendMultipleAlerts(
  contacts: EmergencyContact[],
  message: string,
  options: {
    delay?: number; // Delay between opening apps (ms)
    preferWhatsApp?: boolean;
  } = {}
): Promise<void> {
  const { delay = 1000, preferWhatsApp = true } = options;
  
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    
    // Add delay between contacts (except first one)
    if (i > 0 && delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Choose method based on contact preference
    if (contact.method === 'whatsapp' || (contact.method === 'both' && preferWhatsApp)) {
      openWhatsApp(contact.phone, message);
    } else if (contact.method === 'sms') {
      openSMS(contact.phone, message);
    } else if (contact.method === 'both') {
      // Send to both (WhatsApp first, SMS after delay)
      openWhatsApp(contact.phone, message);
      await new Promise(resolve => setTimeout(resolve, delay));
      openSMS(contact.phone, message);
    }
  }
}

/**
 * Copy message to clipboard
 * Useful as fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Open phone dialer with number
 */
export function openDialer(phone: string): void {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  window.open(`tel:${cleanPhone}`, '_self');
}

/**
 * Vibrate device (for emergency alert feedback)
 */
export function vibrateDevice(pattern: number | number[] = [200, 100, 200]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

/**
 * Play notification sound
 */
export function playAlertSound(): void {
  // Create a simple beep sound
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

/**
 * Check if device supports required features
 */
export function checkDeviceCapabilities(): {
  sms: boolean;
  whatsapp: boolean;
  share: boolean;
  clipboard: boolean;
  vibrate: boolean;
} {
  return {
    sms: true, // SMS links work on all devices
    whatsapp: true, // WhatsApp web links work everywhere
    share: 'share' in navigator,
    clipboard: 'clipboard' in navigator,
    vibrate: 'vibrate' in navigator,
  };
}
