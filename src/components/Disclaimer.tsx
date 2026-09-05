import React from 'react';
import { AlertTriangle, PhoneCall, Info } from 'lucide-react';
import { CallTarget, UserLocation } from '../types';
import { getEmergencyHotlines, triggerDeviceDial } from '../services/callService';

interface DisclaimerProps {
  variant?: 'general' | 'emergency' | 'demo';
  compact?: boolean;
  userLocation?: UserLocation | null;
  onStartCall?: (target: CallTarget) => void;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({
  variant = 'general',
  compact = false,
  userLocation,
  onStartCall
}) => {
  const hotlines = getEmergencyHotlines(userLocation);

  const handleCallEmergency = () => {
    if (onStartCall) {
      onStartCall({
        phoneNumber: hotlines.primary.number,
        title: hotlines.primary.label,
        subtitle: `${hotlines.primary.desc} • Immediate Medical Dispatch`,
        department: 'National Emergency Services',
        isEmergency: true
      });
    } else {
      triggerDeviceDial(hotlines.primary.number);
    }
  };

  if (variant === 'emergency') {
    return (
      <aside
        aria-label="Emergency Services Notice"
        className="w-full bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-3.5 sm:p-4 shadow-xs"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="text-sm leading-relaxed flex-1">
            <div className="font-semibold text-rose-950 flex items-center justify-between flex-wrap gap-2">
              <span>Immediate Medical Emergency?</span>
              <button
                type="button"
                onClick={handleCallEmergency}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors shadow-2xs cursor-pointer"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call {hotlines.primary.number} ({hotlines.primary.label})</span>
              </button>
            </div>
            <p className="text-rose-800 mt-1">
              If this is a life-threatening crisis, do not rely solely on mobile navigation.
              Immediately contact your local emergency hotline or ambulance dispatch. CareRoute is an assistance directory and does not replace emergency medical response.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  if (variant === 'demo') {
    return (
      <aside
        aria-label="Demonstration Data Notice"
        className="w-full bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs sm:text-sm flex items-start gap-2.5"
      >
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-950">Demonstration Data Notice: </span>
          <span>
            Hospital capacity, specialist on-duty status, and blood bank units are based on demonstration data for this prototype. Real-world conditions fluctuate continuously; always call ahead to verify availability.
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Healthcare Assistance Disclaimer"
      className={`w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl ${
        compact ? 'p-3 text-xs' : 'p-4 text-xs sm:text-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-900">Important Safety Notice: </span>
          <span>
            CareRoute is a healthcare discovery and navigation assistance platform. It does not provide medical diagnosis, clinical triage, or patient admission guarantees. It does not replace doctors, hospitals, ambulances, or emergency medical technicians.
          </span>
        </div>
      </div>
    </aside>
  );
};
