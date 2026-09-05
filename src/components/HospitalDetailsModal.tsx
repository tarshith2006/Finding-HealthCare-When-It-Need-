import React, { useEffect } from 'react';
import {
  X,
  Phone,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Star,
  Clock,
  Droplet,
  Bed,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PhoneForwarded
} from 'lucide-react';
import { AvailabilityStatus, BloodGroup, Hospital, UserLocation } from '../types';
import { calculateDistance, calculateETA, formatETA } from '../utils/distanceCalculator';
import { openNavigation } from '../services/navigationService';

interface HospitalDetailsModalProps {
  hospital: Hospital | null;
  userLocation: UserLocation | null;
  onClose: () => void;
}

export const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({
  hospital,
  userLocation,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!hospital) return null;

  const baseLat = userLocation?.latitude ?? 12.9716;
  const baseLon = userLocation?.longitude ?? 77.5946;

  const distanceKm = calculateDistance(
    baseLat,
    baseLon,
    hospital.latitude,
    hospital.longitude
  );
  const etaMinutes = calculateETA(distanceKm);

  const getStatusBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Available</span>
          </span>
        );
      case 'Limited':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Limited</span>
          </span>
        );
      case 'Currently Unavailable':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Unavailable</span>
          </span>
        );
      case 'Contact to Confirm':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            <PhoneForwarded className="w-3 h-3 text-slate-500" />
            <span>Confirm</span>
          </span>
        );
    }
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hospital-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
              {hospital.category}
            </span>
            {hospital.emergencyAvailable ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 Emergency Department Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Day Clinic (No 24/7 ER)</span>
              </span>
            )}
          </div>

          <h2
            id="hospital-modal-title"
            className="text-xl sm:text-2xl font-black text-white leading-tight"
          >
            {hospital.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{hospital.address}</span>
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs font-medium text-slate-300">
            <div>
              Distance: <strong className="text-white font-bold">{distanceKm} km</strong>
            </div>
            <div>
              Est. Travel: <strong className="text-white font-bold">{formatETA(etaMinutes)}</strong>
            </div>
            <div>
              Rating: <strong className="text-amber-400 font-bold">★ {hospital.rating}</strong>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[68vh] overflow-y-auto">
          {/* Quick Metrics: Beds, ICU, Phone */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-slate-500 text-xs block font-medium">Facility Size</span>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 mt-0.5">
                <Bed className="w-4 h-4 text-slate-600" />
                <span>{hospital.totalBeds} Total Beds</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-slate-500 text-xs block font-medium">Critical Care / ICU</span>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{hospital.icuAvailable ? 'ICU Active' : 'No ICU'}</span>
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <span className="text-emerald-800 text-xs block font-medium">Emergency Line</span>
              <a
                href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                className="font-extrabold text-emerald-950 text-sm sm:text-base flex items-center gap-1.5 mt-0.5 hover:underline"
              >
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">{hospital.emergencyPhone || hospital.phone}</span>
              </a>
            </div>
          </div>

          {/* Services Available */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Available Clinical Services:
            </h3>
            <div className="flex flex-wrap gap-2">
              {hospital.services.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                >
                  ✓ {service}
                </span>
              ))}
            </div>
          </div>

          {/* Specialists On Call */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              On-Call Doctors & Specialists:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hospital.specialists.map((spec) => (
                <div
                  key={spec}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Blood Availability Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-red-600" />
                <span>On-Site Blood Bank Inventory:</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Transfusion Service Status</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {bloodGroups.map((bg) => (
                <div
                  key={bg}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                >
                  <span className="font-extrabold text-slate-900 text-xs">{bg}</span>
                  {getStatusBadge(hospital.bloodAvailability[bg])}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Reminder */}
          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3.5 rounded-xl leading-relaxed">
            <strong className="text-slate-900 font-bold">Clinical Intake Protocol:</strong> Critical emergency intake, resuscitation bays, and on-call trauma teams are prioritized upon arrival. Dial the direct emergency desk above to announce an inbound acute patient.
          </p>
        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 flex-wrap">
          <a
            href={`tel:${hospital.emergencyPhone || hospital.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>Call Facility</span>
          </a>

          <button
            type="button"
            onClick={() => {
              openNavigation(hospital, userLocation);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>Start Navigation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
