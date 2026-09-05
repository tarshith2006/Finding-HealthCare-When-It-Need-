import { BloodGroup, EmergencyCategory, ServiceName } from '../types';

const STORAGE_KEYS = {
  EMERGENCY: 'careroute_last_emergency',
  SEARCHES: 'careroute_recent_searches',
  PREFERENCES: 'careroute_user_preferences',
  RECOMMENDATIONS: 'careroute_recent_recommendations'
};

export interface StoredRecommendation {
  id: string;
  timestamp: string;
  hospitalName: string;
  score: number;
  emergencyType?: string;
  distanceKm: number;
}

export function saveEmergency(emergencyType: EmergencyCategory): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify({
      type: emergencyType,
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch {
    return false;
  }
}

export function getEmergency(): EmergencyCategory | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.type || null;
  } catch {
    return null;
  }
}

export function saveSearch(query: string): boolean {
  if (!query || query.trim().length === 0) return false;
  try {
    const clean = query.trim();
    const existing = getSearches();
    const filtered = existing.filter((item) => item.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...filtered].slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.SEARCHES, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function getSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCHES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SEARCHES);
  } catch {
    // Ignore error
  }
}

export function savePreference(key: string, value: string | BloodGroup | ServiceName): boolean {
  try {
    const prefs = getPreferences();
    prefs[key] = value;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

export function getPreferences(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export function saveRecommendation(rec: StoredRecommendation): boolean {
  try {
    const existing = getRecommendations();
    const updated = [rec, ...existing.filter((item) => item.hospitalName !== rec.hospitalName)].slice(0, 5);
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

export function getRecommendations(): StoredRecommendation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
