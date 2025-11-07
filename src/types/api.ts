/**
 * TypeScript types for SafeAlert API
 */

// ============================================================================
// Contact Types
// ============================================================================

export interface Contact {
  id: number;
  name: string | null;
  phone: string;
  opt_in: number; // 0 or 1 (SQLite doesn't have boolean)
  created_at: string;
  updated_at: string;
}

export interface CreateContactRequest {
  name?: string;
  phone: string;
  opt_in?: boolean;
}

export interface UpdateContactRequest {
  name?: string;
  phone?: string;
  opt_in?: boolean;
}

export interface ContactsResponse {
  contacts: Contact[];
}

export interface ContactResponse {
  contact: Contact;
}

// ============================================================================
// Panic Alert Types
// ============================================================================

export interface PanicRequest {
  contacts?: string[]; // Array of phone numbers in E.164 format
  contactIds?: number[]; // Array of contact IDs from database
  message?: string; // Optional custom message
  location?: {
    lat: number;
    lng: number;
  };
  meta?: Record<string, any>; // Additional metadata
}

export interface PanicResult {
  phone: string;
  status: 'sent' | 'failed';
  sid?: string; // Twilio message SID
  error?: string;
}

export interface PanicResponse {
  success: boolean;
  panicEventId: number;
  message: string;
  results: PanicResult[];
  summary: {
    total: number;
    sent: number;
    failed: number;
  };
}

// ============================================================================
// SMS Alert Types (PWA Compatibility)
// ============================================================================

export interface SendAlertContact {
  name?: string;
  phone: string;
  message?: string;
}

export interface SendAlertRequest {
  contacts: SendAlertContact[];
  lat: number;
  lon: number;
}

export interface SendAlertResult {
  to: string | null;
  status: 'sent' | 'failed';
  sid?: string;
  error?: string;
}

export interface SendAlertResponse {
  ok: boolean;
  results: SendAlertResult[];
  address: string;
  lat: number;
  lon: number;
  error?: string;
}

// ============================================================================
// Panic Event Types
// ============================================================================

export interface PanicEvent {
  id: number;
  message: string;
  latitude: number | null;
  longitude: number | null;
  meta: string | null;
  created_at: string;
}

export interface PanicEventResult {
  id: number;
  panic_event_id: number;
  contact_phone: string;
  status: string;
  sid: string | null;
  error: string | null;
  created_at: string;
}

export interface PanicEventsResponse {
  events: PanicEvent[];
}

export interface PanicEventDetailsResponse {
  event: PanicEvent;
  results: PanicEventResult[];
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface TwilioWebhookRequest {
  From: string; // e.g., "whatsapp:+15085140864"
  To: string;
  Body: string;
  MessageSid: string;
  AccountSid: string;
  [key: string]: any;
}

// ============================================================================
// Geocoding Types
// ============================================================================

export interface GeocodeResult {
  full: string;
  short: string;
}

export interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  footway?: string;
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  county?: string;
  state?: string;
  region?: string;
  state_district?: string;
  postcode?: string;
}

export interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  error: string;
  details?: any;
}

export interface SuccessResponse {
  ok: boolean;
  message?: string;
}

// ============================================================================
// Health Check Types
// ============================================================================

export interface HealthResponse {
  ok: boolean;
  service: string;
  version: string;
  env: string;
  timestamp: string;
}
