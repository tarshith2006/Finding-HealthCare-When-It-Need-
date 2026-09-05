import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Activity,
  Compass,
  Clock,
  MapPin
} from 'lucide-react';
import { EMERGENCY_OPTIONS } from '../data/emergencyData';
import { HOSPITALS_DATA, getHospitalsForLocation } from '../data/hospitalData';
import { EmergencyCategory, EmergencyOption, Hospital, UserLocation, CallTarget } from '../types';
import { EmergencyCard } from '../components/EmergencyCard';
import { HospitalCard } from '../components/HospitalCard';
import { Disclaimer } from '../components/Disclaimer';
import { saveEmergency } from '../services/storageService';
import { calculateDistance } from '../utils/distanceCalculator';

interface EmergencyPageProps {
  userLocation: UserLocation | null;
  selectedEmergencyId: EmergencyCategory | '';
  onSelectEmergency: (id: EmergencyCategory) => void;
  onNavigateToHospitals: (emergencyService?: string) => void;
  onNavigateToRecommendation: (emergencyId: EmergencyCategory) => void;
  onViewHospitalDetails: (hospital: Hospital) => void;
  onStartCall?: (target: CallTarget) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({
  userLocation,
  selectedEmergencyId,
  onSelectEmergency,
  onNavigateToHospitals,
  onNavigateToRecommendation,
  onViewHospitalDetails,
  onStartCall
}) => {
  const [selectedOption, setSelectedOption] = useState<EmergencyOption | null>(() => {
    return EMERGENCY_OPTIONS.find((e) => e.id === selectedEmergencyId) || null;
  });

  const handleSelect = (option: EmergencyOption) => {
    setSelectedOption(option);
    onSelectEmergency(option.id);
    saveEmergency(option.id);
  };

  const baseLat = userLocation?.latitude ?? 12.9716;
  const baseLon = userLocation?.longitude ?? 77.5946;

  const localizedHospitals = getHospitalsForLocation(userLocation);

  // Filter prioritized hospitals that match this emergency
  const matchingHospitals = selectedOption
    ? localizedHospitals.filter(
        (h) =>
          h.emergencyAvailable &&
          selectedOption.requiredServices.some((srv) => h.services.includes(srv))
      ).sort((a, b) => {
        const distA = calculateDistance(baseLat, baseLon, a.latitude, a.longitude);
        const distB = calculateDistance(baseLat, baseLon, b.latitude, b.longitude);
        return distA - distB;
      })
    : [];

  return (
    <div className="space-y-8 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Urgent Medical Hotline Banner */}
      <Disclaimer variant="emergency" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Clinical Triage Protocol • Rapid Assessment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Emergency Condition Triage
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Select the presenting acute condition to identify specialized emergency departments, trauma centers, and required clinical capabilities.
        </p>
      </div>

      {/* Emergency Cards Grid (6 Options) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMERGENCY_OPTIONS.map((option) => (
          <EmergencyCard
            key={option.id}
            option={option}
            isSelected={selectedOption?.id === option.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* When an emergency is selected: Action Banner & Guidance */}
      {selectedOption && (
        <section
          id="emergency-selected-banner"
          className="bg-white border border-rose-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                Selected Triage Assessment
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {selectedOption.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium">
                <strong className="text-slate-900">Required Hospital Capabilities: </strong>
                <span className="text-rose-800 font-semibold">{selectedOption.requiredServices.join(' • ')}</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap">
              <button
                id="emergency-find-hospitals-cta"
                type="button"
                onClick={() =>
                  onNavigateToHospitals(selectedOption.requiredServices[0])
                }
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <span>Find Equipped Hospitals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="emergency-get-rec-cta"
                type="button"
                onClick={() => onNavigateToRecommendation(selectedOption.id)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Calculate Best Facility Match</span>
              </button>
            </div>
          </div>

          {/* Urgent Action Note */}
          <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200/80 text-xs sm:text-sm text-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block mb-0.5 font-bold">Immediate First-Response Protocol:</strong>
              <p className="text-slate-700 leading-relaxed">
                {selectedOption.urgentActionNote}
              </p>
            </div>
          </div>

          {/* Prioritized hospitals preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Priority Emergency Facilities for {selectedOption.title}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                  {matchingHospitals.length} facilities verified
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchingHospitals.slice(0, 3).map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  userLocation={userLocation}
                  onViewDetails={onViewHospitalDetails}
                  highlightService={selectedOption.requiredServices[0]}
                  onStartCall={onStartCall}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Disclaimer variant="emergency" userLocation={userLocation} onStartCall={onStartCall} compact />
    </div>
  );
};
