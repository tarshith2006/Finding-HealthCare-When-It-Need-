export type EmergencyCategory =
  | 'accident'
  | 'heart'
  | 'stroke'
  | 'pregnancy'
  | 'burns'
  | 'general';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'O+'
  | 'O-'
  | 'AB+'
  | 'AB-';

export type AvailabilityStatus =
  | 'Available'
  | 'Limited'
  | 'Currently Unavailable'
  | 'Contact to Confirm';

export type ServiceName =
  | 'Emergency Department'
  | 'Cardiology'
  | 'Neurology'
  | 'Orthopedics'
  | 'General Medicine'
  | 'Pediatrics'
  | 'Gynecology'
  | 'Burn Care'
  | 'Trauma Care'
  | 'ICU';

export interface Hospital {
  id: number;
  name: string;
  category: 'Multi-Specialty' | 'Government' | 'Emergency & Trauma' | 'Super-Specialty';
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyPhone?: string;
  emergencyAvailable: boolean;
  services: ServiceName[];
  specialists: string[];
  bloodAvailability: Record<BloodGroup, AvailabilityStatus>;
  rating: number;
  totalBeds: number;
  icuAvailable: boolean;
  isDemoData: true;
}

export interface EmergencyOption {
  id: EmergencyCategory;
  title: string;
  iconName: string;
  description: string;
  requiredServices: ServiceName[];
  recommendedSpecialists: string[];
  urgentActionNote: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  label?: string;
  isCustom?: boolean;
  accuracyMeters?: number;
  city?: string;
  source?: 'gps' | 'search' | 'preset' | 'network';
}

export interface HospitalScoreBreakdown {
  emergencyServiceMatch: number; // Max 40
  specialistMatch: number; // Max 25
  bloodMatch: number; // Max 20
  distanceScore: number; // Max 15
  totalScore: number; // Max 100
  reasons: string[];
  distanceKm: number;
  estimatedMinutes: number;
}

export interface RecommendationResult {
  hospital: Hospital;
  scoreBreakdown: HospitalScoreBreakdown;
}

export interface FilterState {
  searchQuery: string;
  emergencyOnly: boolean;
  selectedService: ServiceName | '';
  selectedBloodGroup: BloodGroup | '';
  maxDistanceKm: number;
  sortBy: 'nearest' | 'best_match' | 'rating';
}

export interface CallTarget {
  phoneNumber: string;
  title: string;
  subtitle?: string;
  isEmergency?: boolean;
  hospitalName?: string;
  department?: string;
  address?: string;
}
