/**
 * Helper utilities for SafeAlert backend
 */

import type { GeocodeResult, NominatimResponse } from '@/types/api';

/**
 * Normalize phone number to E.164 format
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  
  // Remove spaces, dashes, and parentheses
  let normalized = phone.replace(/[\s\-()]/g, '');
  
  // Ensure it starts with +
  if (!normalized.startsWith('+')) {
    // If it's a US number without country code, add +1
    if (normalized.length === 10) {
      normalized = '+1' + normalized;
    } else if (normalized.length > 10) {
      normalized = '+' + normalized;
    }
  }
  
  return normalized;
}

/**
 * Format concise address from Nominatim response
 */
export function formatConciseAddress(nominatim: NominatimResponse): string {
  const a = nominatim?.address || {};
  
  const street = [
    a.house_number,
    a.road || a.pedestrian || a.footway
  ].filter(Boolean).join(' ');
  
  const city = a.city || a.town || a.village || a.hamlet || a.county;
  const state = a.state || a.region || a.state_district;
  const zip = a.postcode;
  
  const parts = [street, city, state, zip].filter(Boolean);
  
  return parts.length ? parts.join(', ') : (nominatim.display_name || '');
}

/**
 * Reverse geocode coordinates using OpenStreetMap Nominatim
 */
export async function reverseGeocode(
  lat: number,
  lon: number,
  options: {
    countryBias?: string;
    acceptLanguage?: string;
  } = {}
): Promise<GeocodeResult> {
  try {
    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(lat),
      lon: String(lon),
      addressdetails: '1',
    });
    
    if (options.countryBias) {
      params.append('countrycodes', options.countryBias);
    }
    
    const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SafeAlert/1.0',
        'Accept-Language': options.acceptLanguage || 'en',
      },
    });
    
    if (!response.ok) {
      return {
        full: `${lat}, ${lon}`,
        short: `${lat}, ${lon}`,
      };
    }
    
    const data = await response.json() as NominatimResponse;
    
    return {
      full: data.display_name || `${lat}, ${lon}`,
      short: formatConciseAddress(data) || `${lat}, ${lon}`,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      full: `${lat}, ${lon}`,
      short: `${lat}, ${lon}`,
    };
  }
}

/**
 * Validate E.164 phone number format
 */
export function isValidE164Phone(phone: string): boolean {
  // E.164 format: +[1-9][0-9]{1,14}
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Validate latitude
 */
export function isValidLatitude(lat: number): boolean {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

/**
 * Validate longitude
 */
export function isValidLongitude(lon: number): boolean {
  return typeof lon === 'number' && lon >= -180 && lon <= 180;
}
