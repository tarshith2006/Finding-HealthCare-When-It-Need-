import React, { useEffect } from 'react';
import {
  X,
  HeartPulse,
  Compass,
  Droplet,
  Stethoscope,
  ShieldAlert,
  MapPin,
  Check,
  AlertTriangle
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-500 rounded-xl text-slate-950">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Emergency Healthcare Routing Protocol
            </span>
          </div>

          <h2 id="about-modal-title" className="text-2xl font-black text-white">
            About CareRoute
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Rapid healthcare navigation, verified facility availability, and emergency department matching.
          </p>
        </div>

        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto text-slate-700 text-sm leading-relaxed">
          {/* Mission */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Clinical Mission</h3>
            <p>
              In acute medical emergencies, individuals and first aiders lose critical minutes navigating fragmented directories or driving to facilities without appropriate trauma surgeons, open catheterization labs, or compatible blood inventory. CareRoute consolidates verified facility status, live clinical capabilities, and direct turn-by-turn routing into an immediate, accessible interface.
            </p>
          </div>

          {/* Integrated Healthcare Capabilities */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Integrated Care Modules</h3>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Emergency Triage & Condition Assessment
              </span>
              <p className="text-xs text-slate-600">
                Rapid condition triage across accident trauma, cardiac arrest, stroke symptoms, acute obstetrics, and severe thermal burns with immediate first-aid protocols.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Emergency Facilities & Operating Status
              </span>
              <p className="text-xs text-slate-600">
                Live location-based discovery of 24/7 emergency departments, critical care trauma ratings, bed availability estimates, and direct telephone lines to intake desks.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-red-600" />
                Hospital Blood Transfusion Reserves
              </span>
              <p className="text-xs text-slate-600">
                Stock monitoring across all 8 major blood groups (A, B, AB, O) with direct contact routing to hospital blood transfusion coordinators for reserve holds.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                Specialist Departments & On-Call Coverage
              </span>
              <p className="text-xs text-slate-600">
                Operational verification across 9 critical departments with consultant physician names and specialized resuscitation capabilities.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-900" />
                Facility Compatibility Matching Engine
              </span>
              <p className="text-xs text-slate-600">
                Computes a multi-criteria compatibility index assessing emergency clinical capability match, on-call surgical coverage, blood availability, and transit time.
              </p>
            </div>
          </div>

          {/* Compatibility Scoring Rubric */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              Facility Compatibility Scoring Rubric
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700">Clinical Specialty Match</span>
                <span className="font-bold text-emerald-800">40% weight</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700">On-Call Specialist Coverage</span>
                <span className="font-bold text-emerald-800">25% weight</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700">Blood Bank Inventory</span>
                <span className="font-bold text-emerald-800">20% weight</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700">Transit Distance & ETA</span>
                <span className="font-bold text-emerald-800">15% weight</span>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 text-xs leading-relaxed space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
              Emergency Notice:
            </span>
            <p>
              CareRoute provides information and navigational assistance. If you or someone around you faces life-threatening distress, call local emergency dispatch immediately (911 / 112).
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
          >
            Close Protocol Info
          </button>
        </div>
      </div>
    </div>
  );
};
