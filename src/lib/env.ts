/**
 * Environment Variable Configuration Utilities
 * 
 * This module provides type-safe access to environment variables
 * and ensures proper usage of sensitive credentials.
 * 
 * SECURITY RULES:
 * - Client-side variables: Must be prefixed with NEXT_PUBLIC_
 * - Server-side variables: NO NEXT_PUBLIC_ prefix (sensitive data)
 * - Only use server-side functions in API routes or server components
 */

// ============================================================================
// CLIENT-SIDE ENVIRONMENT VARIABLES
// Safe to use in any component (browser or server)
// ============================================================================

/**
 * Get public API base URL (exposed to browser)
 * @returns API base URL or empty string if not configured
 */
export const getPublicApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || '';
};

/**
 * Get emergency contact numbers (exposed to browser)
 * @returns Array of contact phone numbers
 */
export const getEmergencyContacts = (): string[] => {
  const contacts: string[] = [];
  
  if (process.env.NEXT_PUBLIC_CONTACT_1) {
    contacts.push(process.env.NEXT_PUBLIC_CONTACT_1);
  }
  if (process.env.NEXT_PUBLIC_CONTACT_2) {
    contacts.push(process.env.NEXT_PUBLIC_CONTACT_2);
  }
  if (process.env.NEXT_PUBLIC_CONTACT_3) {
    contacts.push(process.env.NEXT_PUBLIC_CONTACT_3);
  }
  
  // Default contact if none configured
  if (contacts.length === 0) {
    contacts.push('+15085140864');
  }
  
  return contacts;
};

// ============================================================================
// SERVER-SIDE ENVIRONMENT VARIABLES
// ⚠️ WARNING: Only use these functions in API routes or server components!
// NEVER import or use these in client components
// ============================================================================

/**
 * Server-side configuration for Twilio
 * 
 * ⚠️ SECURITY WARNING: These credentials are SENSITIVE
 * Only call this function from:
 * - API routes (app/api/*)
 * - Server Components (components with 'use server')
 * - Server Actions
 * 
 * @throws Error if required environment variables are missing
 * @returns Twilio configuration object
 */
export const getTwilioConfig = () => {
  // Ensure this is only called on the server
  if (typeof window !== 'undefined') {
    throw new Error(
      'SECURITY ERROR: getTwilioConfig() called on client-side! ' +
      'Twilio credentials must only be accessed from server-side code.'
    );
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !whatsappNumber) {
    throw new Error(
      'Twilio configuration missing. Please set TWILIO_ACCOUNT_SID, ' +
      'TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER in your .env.local file.'
    );
  }

  return {
    accountSid,
    authToken,
    whatsappNumber,
  };
};

/**
 * Validate all required environment variables
 * Useful for startup checks
 * 
 * @param includeServerVars Whether to validate server-side variables (default: false)
 * @returns Object with validation results
 */
export const validateEnv = (includeServerVars = false) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check client-side variables
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    errors.push('NEXT_PUBLIC_API_BASE_URL is not set');
  }

  if (!process.env.NEXT_PUBLIC_CONTACT_1) {
    warnings.push('No emergency contacts configured, using default');
  }

  // Check server-side variables (only if explicitly requested)
  if (includeServerVars && typeof window === 'undefined') {
    if (!process.env.TWILIO_ACCOUNT_SID) {
      errors.push('TWILIO_ACCOUNT_SID is not set');
    }
    if (!process.env.TWILIO_AUTH_TOKEN) {
      errors.push('TWILIO_AUTH_TOKEN is not set');
    }
    if (!process.env.TWILIO_WHATSAPP_NUMBER) {
      errors.push('TWILIO_WHATSAPP_NUMBER is not set');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
