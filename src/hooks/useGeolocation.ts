/**
 * Custom React hook for managing geolocation state
 */

import { useState, useEffect, useCallback } from 'react';
import { getCurrentLocation, Coordinates, LocationError } from '@/lib/geolocation';

interface UseGeolocationResult {
  coordinates: Coordinates | null;
  error: LocationError | null;
  loading: boolean;
  accuracy: number | null;
  refreshLocation: () => Promise<void>;
}

export const useGeolocation = (autoFetch = false): UseGeolocationResult => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCurrentLocation();
      setCoordinates(result.coordinates);
      setAccuracy(result.accuracy);
    } catch (err) {
      setError(err as LocationError);
      setCoordinates(null);
      setAccuracy(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      refreshLocation();
    }
  }, [autoFetch, refreshLocation]);

  return {
    coordinates,
    error,
    loading,
    accuracy,
    refreshLocation,
  };
};
