import { UserLocation } from '../types';

export interface LocationResult {
  success: boolean;
  location?: UserLocation;
  errorMessage?: string;
  code?: 'PERMISSION_DENIED' | 'UNSUPPORTED' | 'TIMEOUT' | 'POSITION_UNAVAILABLE' | 'UNKNOWN';
}

export const PRESET_LOCALITIES: { name: string; latitude: number; longitude: number }[] = [
  { name: 'Central Metro (City Center)', latitude: 12.9716, longitude: 77.5946 },
  { name: 'North Corridor / Metro', latitude: 12.9860, longitude: 77.5990 },
  { name: 'East Park & MedTech Zone', latitude: 12.9550, longitude: 77.6200 },
  { name: 'South Greens / Ridge', latitude: 12.9300, longitude: 77.5800 },
  { name: 'Westside Medical Belt', latitude: 12.9650, longitude: 77.5500 }
];

export async function getCurrentLocation(): Promise<LocationResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      errorMessage: 'Location services are not supported on this browser. You can search for a hospital manually or choose a preset area.',
      code: 'UNSUPPORTED'
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            label: 'Current GPS Location'
          }
        });
      },
      (error) => {
        let message = 'Unable to determine your location. You can search manually.';
        let code: LocationResult['code'] = 'UNKNOWN';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. You can search for a hospital manually.';
            code = 'PERMISSION_DENIED';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is currently unavailable. Please search manually.';
            code = 'POSITION_UNAVAILABLE';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again or search manually.';
            code = 'TIMEOUT';
            break;
        }

        resolve({
          success: false,
          errorMessage: message,
          code
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60000
      }
    );
  });
}
