/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param lat1 Latitude of point 1 in decimal degrees
 * @param lon1 Longitude of point 1 in decimal degrees
 * @param lat2 Latitude of point 2 in decimal degrees
 * @param lon2 Longitude of point 2 in decimal degrees
 * @returns Distance in kilometers rounded to 1 decimal place
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0.1;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Calculates an approximate urban travel time (ETA) in minutes.
 * Standard city driving speed ~25-30 km/h with 2 minutes traffic buffer.
 *
 * @param distanceKm Distance in kilometers
 * @returns Estimated minutes (integer)
 */
export function calculateETA(distanceKm: number): number {
  if (distanceKm <= 0) return 2;
  const speedKmPerHr = 28; // conservative urban driving speed
  const driveMinutes = (distanceKm / speedKmPerHr) * 60;
  return Math.max(2, Math.round(driveMinutes + 1));
}

/**
 * Formats ETA string with clear indication that it is an estimate.
 */
export function formatETA(minutes: number): string {
  if (minutes < 60) {
    return `~${minutes} mins`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `~${hrs} hr ${mins > 0 ? `${mins} mins` : ''}`;
}
