/**
 * Geolocation utilities for getting user's precise GPS coordinates
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationResult {
  coordinates: Coordinates;
  accuracy: number;
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

/**
 * Gets the user's current location with high accuracy
 * @returns Promise that resolves with location data or rejects with error
 */
export const getCurrentLocation = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 0, // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let message = 'Unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }

        reject({
          code: error.code,
          message,
        });
      },
      options
    );
  });
};

/**
 * Formats coordinates for display
 */
export const formatCoordinates = (coords: Coordinates): string => {
  return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
};

/**
 * Checks if geolocation is supported
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};
