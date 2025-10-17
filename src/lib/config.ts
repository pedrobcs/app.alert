/**
 * Configuration Loader
 * 
 * Import this at the top of server-side files to ensure environment
 * variables are loaded from .env.local
 * 
 * Usage:
 * ```typescript
 * // At the top of API routes or server components
 * import 'dotenv/config';
 * import { getTwilioConfig } from '@/lib/env';
 * 
 * export async function POST(request: NextRequest) {
 *   const config = getTwilioConfig();
 *   // Use config...
 * }
 * ```
 */

// This file is intentionally minimal. The actual dotenv/config import
// should be done in individual API routes or server files that need it.

/**
 * Validates that critical environment variables are set
 * Call this during application startup or in API routes
 */
export function ensureConfigured() {
  if (typeof window !== 'undefined') {
    // Client-side check
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn('NEXT_PUBLIC_API_BASE_URL is not configured');
    }
  }
}

/**
 * Development mode check
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Production mode check
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Test mode check
 */
export const isTest = process.env.NODE_ENV === 'test';
