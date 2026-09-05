import {
  BloodGroup,
  EmergencyCategory,
  Hospital,
  HospitalScoreBreakdown,
  RecommendationResult,
  ServiceName,
  UserLocation
} from '../types';
import { EMERGENCY_OPTIONS } from '../data/emergencyData';
import { calculateDistance, calculateETA } from './distanceCalculator';

export interface RecommendationInput {
  emergencyType?: EmergencyCategory | '';
  bloodGroup?: BloodGroup | '';
  requiredService?: ServiceName | '';
  hospitals: Hospital[];
  userLocation?: UserLocation | null;
}

export function recommendHospital(input: RecommendationInput): {
  topRecommendation: RecommendationResult | null;
  rankedResults: RecommendationResult[];
} {
  const { emergencyType, bloodGroup, requiredService, hospitals, userLocation } = input;

  if (!hospitals || hospitals.length === 0) {
    return { topRecommendation: null, rankedResults: [] };
  }

  // Find matching emergency config if selected
  const emergencyConfig = emergencyType
    ? EMERGENCY_OPTIONS.find((e) => e.id === emergencyType)
    : null;

  // Reference coordinates for distance
  const baseLat = userLocation?.latitude ?? 12.9716;
  const baseLon = userLocation?.longitude ?? 77.5946;

  const scoredHospitals: RecommendationResult[] = hospitals.map((hospital) => {
    let emergencyServiceMatch = 0;
    let specialistMatch = 0;
    let bloodMatch = 0;
    let distanceScore = 0;
    const reasons: string[] = [];

    // 1. Calculate distance & travel ETA
    const distanceKm = calculateDistance(
      baseLat,
      baseLon,
      hospital.latitude,
      hospital.longitude
    );
    const estimatedMinutes = calculateETA(distanceKm);

    // 2. Emergency & Service Match (Max 40 points)
    if (hospital.emergencyAvailable) {
      emergencyServiceMatch += 20;
      reasons.push('Emergency Department is active 24/7');
    }

    if (emergencyConfig) {
      // Check if hospital provides the required services for this emergency
      const matchingServices = emergencyConfig.requiredServices.filter((req) =>
        hospital.services.includes(req)
      );
      if (matchingServices.length > 0) {
        const serviceRatio = matchingServices.length / emergencyConfig.requiredServices.length;
        const additionalPoints = Math.round(serviceRatio * 20);
        emergencyServiceMatch += additionalPoints;
        reasons.push(
          `Equipped for ${emergencyConfig.title} (${matchingServices.join(', ')})`
        );
      }
    } else if (requiredService) {
      if (hospital.services.includes(requiredService)) {
        emergencyServiceMatch += 20;
        reasons.push(`Offers ${requiredService} care`);
      }
    } else {
      // Base score if no specific emergency chosen
      emergencyServiceMatch += 15;
    }

    // 3. Specialist Availability (Max 25 points)
    if (emergencyConfig && emergencyConfig.recommendedSpecialists.length > 0) {
      const hasSpecialist = emergencyConfig.recommendedSpecialists.some((spec) =>
        hospital.specialists.some((hSpec) =>
          hSpec.toLowerCase().includes(spec.toLowerCase().split(' ')[0])
        )
      );
      if (hasSpecialist) {
        specialistMatch = 25;
        reasons.push('On-call relevant medical specialists confirmed');
      } else {
        specialistMatch = 15;
      }
    } else if (requiredService) {
      const matchingSpecialist = hospital.specialists.find((s) =>
        s.toLowerCase().includes(requiredService.toLowerCase().split(' ')[0])
      );
      if (matchingSpecialist) {
        specialistMatch = 25;
        reasons.push(`Specialist on duty: ${matchingSpecialist}`);
      } else if (hospital.services.includes(requiredService)) {
        specialistMatch = 20;
        reasons.push(`Department active with senior physicians`);
      } else {
        specialistMatch = 5;
      }
    } else {
      specialistMatch = hospital.specialists.length > 0 ? 20 : 10;
    }

    // 4. Blood Availability (Max 20 points)
    if (bloodGroup) {
      const status = hospital.bloodAvailability[bloodGroup];
      if (status === 'Available') {
        bloodMatch = 20;
        reasons.push(`${bloodGroup} blood unit listed as Available`);
      } else if (status === 'Limited') {
        bloodMatch = 12;
        reasons.push(`${bloodGroup} blood listed as Limited stock`);
      } else if (status === 'Contact to Confirm') {
        bloodMatch = 7;
        reasons.push(`${bloodGroup} stock requires phone verification`);
      } else {
        bloodMatch = 0;
      }
    } else {
      // General blood bank health
      const availableGroups = Object.values(hospital.bloodAvailability).filter(
        (st) => st === 'Available'
      ).length;
      bloodMatch = Math.min(20, Math.round((availableGroups / 8) * 20));
      if (availableGroups >= 4) {
        reasons.push('On-site blood bank stocked with major groups');
      }
    }

    // 5. Distance Score (Max 15 points)
    if (distanceKm <= 3) {
      distanceScore = 15;
      reasons.push(`Nearest facility (${distanceKm} km, ~${estimatedMinutes} mins)`);
    } else if (distanceKm <= 6) {
      distanceScore = 11;
      reasons.push(`Within immediate metro radius (${distanceKm} km)`);
    } else if (distanceKm <= 10) {
      distanceScore = 7;
      reasons.push(`Accessible location (${distanceKm} km)`);
    } else if (distanceKm <= 15) {
      distanceScore = 4;
    } else {
      distanceScore = 2;
    }

    const totalScore = Math.min(
      100,
      emergencyServiceMatch + specialistMatch + bloodMatch + distanceScore
    );

    const scoreBreakdown: HospitalScoreBreakdown = {
      emergencyServiceMatch,
      specialistMatch,
      bloodMatch,
      distanceScore,
      totalScore,
      reasons: reasons.slice(0, 4), // Top 4 crisp reasons
      distanceKm,
      estimatedMinutes
    };

    return {
      hospital,
      scoreBreakdown
    };
  });

  // Sort descending by totalScore, tiebreak by distanceKm ascending
  scoredHospitals.sort((a, b) => {
    if (b.scoreBreakdown.totalScore !== a.scoreBreakdown.totalScore) {
      return b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore;
    }
    return a.scoreBreakdown.distanceKm - b.scoreBreakdown.distanceKm;
  });

  return {
    topRecommendation: scoredHospitals[0] || null,
    rankedResults: scoredHospitals
  };
}
