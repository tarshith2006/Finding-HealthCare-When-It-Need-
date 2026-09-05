import React from 'react';
import {
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  Phone,
  ArrowRight,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PhoneForwarded
} from 'lucide-react';
import { AvailabilityStatus, Hospital, ServiceName, UserLocation } from '../types';
import { calculateDistance, calculateETA, formatETA } from '../utils/distanceCalculator';

interface ServiceCardProps {
  hospital: Hospital;
  service: ServiceName;
  userLocation: UserLocation | null;
  onViewHospital: (hospital: Hospital) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  hospital,
  service,
  userLocation,
  onViewHospital
}) => {
  const baseLat = userLocation?.latitude ?? 12.9716;
  const baseLon = userLocation?.longitude ?? 77.5946;

  const distanceKm = calculateDistance(
    baseLat,
    baseLon,
    hospital.latitude,
    hospital.longitude
  );
  const etaMinutes = calculateETA(distanceKm);

  // Check specialist matches
  const matchingSpecialist = hospital.specialists.find((s) =>
    s.toLowerCase().includes(service.toLowerCase().split(' ')[0])
  );

  const isServiceOffered = hospital.services.includes(service);
  const status: AvailabilityStatus = isServiceOffered
    ? matchingSpecialist
      ? 'Available'
      : 'Limited'
    : 'Currently Unavailable';

  const getStatusBadge = () => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>✓ Available</span>
          </span>
        );
      case 'Limited':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>! On-Call / Limited</span>
          </span>
        );
      case 'Currently Unavailable':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>✕ Unavailable</span>
          </span>
        );
    }
  };

  return (
    <div
      id={`service-card-${hospital.id}-${service.replace(/\s+/g, '-').toLowerCase()}`}
      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {service} Department
            </span>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {hospital.name}
            </h3>
          </div>
          {getStatusBadge()}
        </div>

        <div className="space-y-2 my-3 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Emergency Department:</span>
            {hospital.emergencyAvailable ? (
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 24/7 Available
              </span>
            ) : (
              <span className="font-semibold text-amber-700 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Daytime Only
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">On-Duty Specialist:</span>
            <span className="font-medium text-slate-800 truncate max-w-[180px]">
              {matchingSpecialist || (isServiceOffered ? 'General Physician on call' : 'None')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-slate-500">Distance & ETA:</span>
            <span className="font-bold text-slate-900">
              {distanceKm} km ({formatETA(etaMinutes)})
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <a
          href={`tel:${hospital.phone}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Desk</span>
        </a>

        <button
          type="button"
          onClick={() => onViewHospital(hospital)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
        >
          <span>View Hospital</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
