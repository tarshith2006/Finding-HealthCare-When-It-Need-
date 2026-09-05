import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Navigation,
  Compass,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Droplet,
  Stethoscope,
  Building2,
  Phone
} from 'lucide-react';
import {
  BloodGroup,
  EmergencyCategory,
  Hospital,
  RecommendationResult,
  ServiceName,
  UserLocation
} from '../types';
import { HOSPITALS_DATA, getHospitalsForLocation } from '../data/hospitalData';
import { EMERGENCY_OPTIONS } from '../data/emergencyData';
import { recommendHospital } from '../utils/hospitalRecommendation';
import { RecommendationCard } from '../components/RecommendationCard';
import { Disclaimer } from '../components/Disclaimer';
import { LocationButton } from '../components/LocationButton';
import { saveRecommendation } from '../services/storageService';
import { openNavigation } from '../services/navigationService';
import { formatETA } from '../utils/distanceCalculator';
import { CallTarget } from '../types';
import { triggerDeviceDial } from '../services/callService';

interface RecommendationPageProps {
  userLocation: UserLocation | null;
  onLocationChange: (loc: UserLocation) => void;
  onViewDetails: (hospital: Hospital) => void;
  initialEmergencyId?: EmergencyCategory | '';
  onStartCall?: (target: CallTarget) => void;
}

const BLOOD_GROUPS: BloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-'
];

const SERVICES: ServiceName[] = [
  'Emergency Department',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Trauma Care',
  'Burn Care',
  'Pediatrics',
  'Gynecology',
  'General Medicine'
];

export const RecommendationPage: React.FC<RecommendationPageProps> = ({
  userLocation,
  onLocationChange,
  onViewDetails,
  initialEmergencyId = '',
  onStartCall
}) => {
  const [emergencyType, setEmergencyType] = useState<EmergencyCategory | ''>(initialEmergencyId);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('O+');
  const [requiredService, setRequiredService] = useState<ServiceName | ''>('');

  // Calculate recommendation results
  const recommendationData = useMemo(() => {
    const localizedHospitals = getHospitalsForLocation(userLocation);
    return recommendHospital({
      emergencyType,
      bloodGroup,
      requiredService,
      hospitals: localizedHospitals,
      userLocation
    });
  }, [emergencyType, bloodGroup, requiredService, userLocation]);

  const topMatch = recommendationData.topRecommendation;
  const runnerUps = recommendationData.rankedResults.slice(1, 4);

  // Save recommendation to LocalStorage whenever a top match is found
  useEffect(() => {
    if (topMatch) {
      saveRecommendation({
        id: `${topMatch.hospital.id}-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        hospitalName: topMatch.hospital.name,
        score: topMatch.scoreBreakdown.totalScore,
        emergencyType: emergencyType || 'General Triage',
        distanceKm: topMatch.scoreBreakdown.distanceKm
      });
    }
  }, [topMatch, emergencyType]);

  const handleResetCriteria = () => {
    setEmergencyType('');
    setBloodGroup('');
    setRequiredService('');
  };

  return (
    <div className="space-y-8 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-emerald-700" />
          <span>Facility Triage Matcher • Proximity & Capability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Facility Compatibility & Priority Routing
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Evaluates regional hospitals against condition requirements, acute specialist availability, blood bank stock, and transit distance.
        </p>
      </div>

      {/* Criteria Customization Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">
              Adjust Patient Situation & Needs:
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LocationButton
              userLocation={userLocation}
              onLocationChange={onLocationChange}
              onError={() => {}}
            />
            <button
              type="button"
              onClick={handleResetCriteria}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Emergency Type Selector */}
          <div>
            <label
              htmlFor="rec-emergency-select"
              className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Emergency Situation
            </label>
            <select
              id="rec-emergency-select"
              value={emergencyType}
              onChange={(e) =>
                setEmergencyType(e.target.value as EmergencyCategory | '')
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            >
              <option value="">General Triage / Any Emergency</option>
              {EMERGENCY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.title}
                </option>
              ))}
            </select>
          </div>

          {/* Blood Group Selector */}
          <div>
            <label
              htmlFor="rec-blood-select"
              className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Required Blood Group
            </label>
            <select
              id="rec-blood-select"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup | '')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            >
              <option value="">No specific blood needed</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg} Group
                </option>
              ))}
            </select>
          </div>

          {/* Specific Medical Service */}
          <div>
            <label
              htmlFor="rec-service-select"
              className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
            >
              Specialized Service
            </label>
            <select
              id="rec-service-select"
              value={requiredService}
              onChange={(e) =>
                setRequiredService(e.target.value as ServiceName | '')
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            >
              <option value="">Any appropriate service</option>
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Top Recommendation Result */}
      {topMatch ? (
        <section className="space-y-8">
          <RecommendationCard
            hospital={topMatch.hospital}
            breakdown={topMatch.scoreBreakdown}
            userLocation={userLocation}
            onViewDetails={onViewDetails}
            onStartCall={onStartCall}
          />

          {/* Alternative Hospitals Comparison (Runner-ups) */}
          {runnerUps.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Alternative Suitable Facilities
                  </h3>
                  <p className="text-xs text-slate-500">
                    Runner-up options ranked by overall compatibility and proximity
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {runnerUps.length} alternatives
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {runnerUps.map((res) => (
                  <div
                    key={res.hospital.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Rank #{recommendationData.rankedResults.indexOf(res) + 1}
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400">
                          {res.scoreBreakdown.totalScore}/100
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1 mb-1">
                        {res.hospital.name}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{res.hospital.address}</span>
                      </p>

                      <div className="text-xs text-slate-600 space-y-1 mb-3 bg-slate-50 p-2.5 rounded-xl">
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <strong className="text-slate-900">{res.scoreBreakdown.distanceKm} km</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Est. Travel:</span>
                          <strong className="text-slate-900">{formatETA(res.scoreBreakdown.estimatedMinutes)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const phone = res.hospital.emergencyPhone || res.hospital.phone;
                          if (onStartCall) {
                            onStartCall({
                              phoneNumber: phone,
                              title: res.hospital.name,
                              subtitle: res.hospital.address,
                              hospitalName: res.hospital.name,
                              department: res.hospital.emergencyPhone ? 'Emergency & Trauma' : 'Hospital Reception',
                              address: res.hospital.address,
                              isEmergency: !!res.hospital.emergencyPhone
                            });
                          } else {
                            triggerDeviceDial(phone);
                          }
                        }}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetails(res.hospital)}
                          className="text-xs font-semibold text-slate-600 hover:underline px-2 py-1"
                        >
                          Details
                        </button>

                        <button
                          type="button"
                          onClick={() => openNavigation(res.hospital, userLocation)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Route</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No suitable hospitals could be calculated.</p>
        </div>
      )}

      <Disclaimer variant="demo" />
    </div>
  );
};
