import { Hospital, UserLocation } from '../types';

export function getNavigationUrl(hospital: Hospital, userLocation?: UserLocation | null): string {
  if (!hospital) return '';

  const destCoords = `${hospital.latitude},${hospital.longitude}`;

  if (userLocation && userLocation.latitude && userLocation.longitude) {
    const originCoords = `${userLocation.latitude},${userLocation.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${originCoords}&destination=${destCoords}&travelmode=driving`;
  }

  // Fallback destination coordinates
  return `https://www.google.com/maps/dir/?api=1&destination=${destCoords}&travelmode=driving`;
}

export function getFallbackSearchUrl(hospital: Hospital): string {
  const query = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function openNavigation(hospital: Hospital, userLocation?: UserLocation | null): boolean {
  try {
    const url = getNavigationUrl(hospital, userLocation);
    if (!url) return false;
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  } catch {
    return false;
  }
}
