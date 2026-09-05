import { UserLocation } from '../types';

export interface LocationResult {
  success: boolean;
  location?: UserLocation;
  errorMessage?: string;
  code?: 'PERMISSION_DENIED' | 'UNSUPPORTED' | 'TIMEOUT' | 'POSITION_UNAVAILABLE' | 'UNKNOWN';
}

export interface GeocodingSearchResult {
  label: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export const PRESET_LOCALITIES: { name: string; latitude: number; longitude: number; city: string; region: string }[] = [
  // Bengaluru Hubs
  { name: 'Bengaluru Central (MG Road / Richmond)', latitude: 12.9716, longitude: 77.5946, city: 'Bengaluru', region: 'India' },
  { name: 'Indiranagar & Domlur Medical Zone', latitude: 12.9784, longitude: 77.6408, city: 'Bengaluru', region: 'India' },
  { name: 'Koramangala & HSR Layout Hub', latitude: 12.9352, longitude: 77.6245, city: 'Bengaluru', region: 'India' },
  { name: 'Whitefield MedTech & IT Corridor', latitude: 12.9698, longitude: 77.7499, city: 'Bengaluru', region: 'India' },
  { name: 'Jayanagar & JP Nagar South', latitude: 12.9250, longitude: 77.5938, city: 'Bengaluru', region: 'India' },
  { name: 'Hebbal & North Airport Expressway', latitude: 13.0358, longitude: 77.5970, city: 'Bengaluru', region: 'India' },

  // Other Major Metros
  { name: 'Mumbai South & Marine Lines', latitude: 18.9438, longitude: 72.8234, city: 'Mumbai', region: 'India' },
  { name: 'Delhi NCR Central (Connaught Place)', latitude: 28.6304, longitude: 77.2177, city: 'New Delhi', region: 'India' },
  { name: 'Hyderabad HITEC City & Gachibowli', latitude: 17.4435, longitude: 78.3772, city: 'Hyderabad', region: 'India' },
  { name: 'Chennai Central & Anna Nagar', latitude: 13.0827, longitude: 80.2707, city: 'Chennai', region: 'India' },

  // Global Hubs
  { name: 'New York (Manhattan Medical Corridor)', latitude: 40.7589, longitude: -73.9851, city: 'New York', region: 'USA' },
  { name: 'London (Central & Westminster)', latitude: 51.5074, longitude: -0.1278, city: 'London', region: 'UK' },
  { name: 'San Francisco (Bay Area Central)', latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', region: 'USA' }
];

/**
 * Reverse geocode latitude and longitude to a human-readable neighborhood/city name
 * using OpenStreetMap Nominatim with a strict timeout and fallback.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<{ label: string; city: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CareRouteHealthcareApp/1.0'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};

      const neighborhood =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.quarter ||
        addr.road ||
        addr.village;

      const city =
        addr.city ||
        addr.town ||
        addr.municipality ||
        addr.city_district ||
        addr.county ||
        addr.state ||
        'Local Area';

      if (neighborhood && city) {
        return { label: `${neighborhood}, ${city}`, city };
      } else if (city) {
        return { label: city, city };
      } else if (data.display_name) {
        const parts = data.display_name.split(',').map((p: string) => p.trim());
        const shortName = parts.slice(0, 2).join(', ');
        return { label: shortName, city: parts[1] || parts[0] };
      }
    }
  } catch {
    // Network or timeout failure - fallback smoothly
  }

  // Graceful fallback to nearest preset or coordinates
  const nearestPreset = findNearestPreset(latitude, longitude);
  if (nearestPreset) {
    return { label: `${nearestPreset.name} (approx)`, city: nearestPreset.city };
  }

  return {
    label: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
    city: 'Current Area'
  };
}

/**
 * Find the nearest preset locality to provide a smart default label if reverse geocoding is unavailable.
 */
function findNearestPreset(lat: number, lon: number): typeof PRESET_LOCALITIES[0] | null {
  let closest: typeof PRESET_LOCALITIES[0] | null = null;
  let minDiff = 0.35; // ~35km

  for (const preset of PRESET_LOCALITIES) {
    const diff = Math.sqrt(Math.pow(preset.latitude - lat, 2) + Math.pow(preset.longitude - lon, 2));
    if (diff < minDiff) {
      minDiff = diff;
      closest = preset;
    }
  }

  return closest;
}

/**
 * Search locations via Nominatim forward geocoding + local offline index.
 */
export async function searchLocations(query: string): Promise<GeocodingSearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const results: GeocodingSearchResult[] = [];

  // 1. Check local curated presets first for instant response
  const localMatches = PRESET_LOCALITIES.filter(
    (p) =>
      p.name.toLowerCase().includes(trimmed) ||
      p.city.toLowerCase().includes(trimmed) ||
      p.region.toLowerCase().includes(trimmed)
  );

  for (const match of localMatches) {
    results.push({
      label: match.name,
      latitude: match.latitude,
      longitude: match.longitude,
      city: match.city,
      country: match.region
    });
  }

  // 2. Query Nominatim for accurate global/local address lookup
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=6&addressdetails=1`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CareRouteHealthcareApp/1.0'
      }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      for (const item of data) {
        const addr = item.address || {};
        const city =
          addr.city ||
          addr.town ||
          addr.municipality ||
          addr.county ||
          addr.state ||
          '';

        const country = addr.country || '';

        // Formulate a crisp, readable title
        const parts = item.display_name.split(',').map((p: string) => p.trim());
        const crispLabel = parts.slice(0, 3).join(', ');

        // Avoid duplicate coordinates
        const isDuplicate = results.some(
          (r) =>
            Math.abs(r.latitude - parseFloat(item.lat)) < 0.005 &&
            Math.abs(r.longitude - parseFloat(item.lon)) < 0.005
        );

        if (!isDuplicate) {
          results.push({
            label: crispLabel,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            city,
            country
          });
        }
      }
    }
  } catch {
    // If external search times out or errors, return local matches
  }

  return results;
}

/**
 * Fallback to IP Geolocation when browser GPS is denied or unavailable.
 */
async function getIPLocationFallback(): Promise<LocationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const city = data.city || data.region || 'Local Area';
        const label = `${city}, ${data.country || 'Current Region'}`;

        return {
          success: true,
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
            label,
            city,
            source: 'network',
            isCustom: true
          }
        };
      }
    }
  } catch {
    // Ignore IP fallback error
  }

  return {
    success: false,
    errorMessage: 'Location access was restricted. Please search for your city or area manually.',
    code: 'POSITION_UNAVAILABLE'
  };
}

/**
 * Retrieves the user's high-accuracy location with reverse-geocoding and IP fallback.
 */
export async function getCurrentLocation(): Promise<LocationResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return getIPLocationFallback();
  }

  return new Promise((resolve) => {
    let resolved = false;

    // Safety timeout in case browser hangs on prompt
    const safetyTimeout = setTimeout(async () => {
      if (!resolved) {
        resolved = true;
        const fallback = await getIPLocationFallback();
        resolve(fallback);
      }
    }, 9000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimeout);

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 20);

        // Immediately reverse-geocode for human-readable neighborhood/city
        const geoInfo = await reverseGeocode(lat, lon);

        resolve({
          success: true,
          location: {
            latitude: lat,
            longitude: lon,
            label: geoInfo.label,
            city: geoInfo.city,
            accuracyMeters: accuracy,
            source: 'gps',
            isCustom: false
          }
        });
      },
      async (error) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(safetyTimeout);

        // If GPS permission was explicitly denied or unavailable, attempt network IP fallback
        const ipFallback = await getIPLocationFallback();
        if (ipFallback.success) {
          resolve(ipFallback);
          return;
        }

        let message = 'Unable to determine your GPS location. Please search for your city or neighborhood manually.';
        let code: LocationResult['code'] = 'UNKNOWN';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Browser location permission was denied. You can search for your neighborhood or city manually.';
            code = 'PERMISSION_DENIED';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location signal is unavailable. Please type your city or area manually.';
            code = 'POSITION_UNAVAILABLE';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again or search your city manually.';
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
        timeout: 8000,
        maximumAge: 0 // Do NOT return cached stale positions
      }
    );
  });
}
