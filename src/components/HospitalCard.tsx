import React from 'react';
import {
  MapPin,
  Phone,
  Navigation as NavIcon,
  ShieldCheck,
  ShieldAlert,
  Star,
  ExternalLink,
  Droplet
} from 'lucide-react';
import { Hospital, UserLocation } from '../types';
import { calculateDistance, calculateETA, formatETA } from '../utils/distanceCalculator';
import { openNavigation } from '../services/navigationService';

interface HospitalCardProps {
  hospital: Hospital;
  userLocation: UserLocation | null;
  onViewDetails: (hospital: Hospital) => void;
  highlightService?: string;
  highlightBlood?: string;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  userLocation,
  onViewDetails,
  highlightService,
  highlightBlood
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

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    openNavigation(hospital, userLocation);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${hospital.emergencyPhone || hospital.phone}`;
  };

  return (
    <article
      id={`hospital-card-${hospital.id}`}
      onClick={() => onViewDetails(hospital)}
      className="group bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Top Header: Category, Distance & Rating */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {hospital.category}
              </span>
              {hospital.emergencyAvailable ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>✓ 24/7 Emergency Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  <span>✕ Day Clinic (No 24/7 ER)</span>
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
              {hospital.name}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm sm:text-base font-extrabold text-slate-900">
              {distanceKm} km
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {formatETA(etaMinutes)} (approx)
            </div>
          </div>
        </div>

        {/* Address & Locality */}
        <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 mb-3.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{hospital.address}</span>
        </p>

        {/* Highlighted requirements match banner if matching */}
        {highlightBlood && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Droplet className="w-3.5 h-3.5 text-red-600" />
              <span>{highlightBlood} Group Stock:</span>
            </span>
            <span className="font-bold">
              {hospital.bloodAvailability[highlightBlood as keyof typeof hospital.bloodAvailability] || 'Unknown'}
            </span>
          </div>
        )}

        {/* Services Badges */}
        <div className="space-y-1.5 mb-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Available Services:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hospital.services.slice(0, 4).map((service) => {
              const isHighlighted =
                highlightService &&
                service.toLowerCase().includes(highlightService.toLowerCase());
              return (
                <span
                  key={service}
                  className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                    isHighlighted
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {service}
                </span>
              );
            })}
            {hospital.services.length > 4 && (
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500">
                +{hospital.services.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA Row: Call, View Details, Navigate */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          id={`call-hospital-btn-${hospital.id}`}
          type="button"
          onClick={handleCall}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title={`Call ${hospital.name}`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-700" />
          <span className="hidden sm:inline">Call ER</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id={`view-details-btn-${hospital.id}`}
            type="button"
            onClick={() => onViewDetails(hospital)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            View Details
          </button>
          <button
            id={`navigate-hospital-btn-${hospital.id}`}
            type="button"
            onClick={handleNavigate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors"
          >
            <NavIcon className="w-3.5 h-3.5" />
            <span>Navigate</span>
          </button>
        </div>
      </div>
    </article>
  );
};
