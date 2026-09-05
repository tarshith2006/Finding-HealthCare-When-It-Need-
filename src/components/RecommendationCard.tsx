import React from 'react';
import {
  Award,
  CheckCircle2,
  Navigation,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { Hospital, HospitalScoreBreakdown, UserLocation, CallTarget } from '../types';
import { openNavigation } from '../services/navigationService';
import { formatETA } from '../utils/distanceCalculator';
import { triggerDeviceDial } from '../services/callService';

interface RecommendationCardProps {
  hospital: Hospital;
  breakdown: HospitalScoreBreakdown;
  userLocation: UserLocation | null;
  onViewDetails: (hospital: Hospital) => void;
  onStartCall?: (target: CallTarget) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  hospital,
  breakdown,
  userLocation,
  onViewDetails,
  onStartCall
}) => {
  const handleStartNavigation = () => {
    openNavigation(hospital, userLocation);
  };

  const handleCall = () => {
    const phoneToCall = hospital.emergencyPhone || hospital.phone;
    if (onStartCall) {
      onStartCall({
        phoneNumber: phoneToCall,
        title: hospital.name,
        subtitle: hospital.address,
        hospitalName: hospital.name,
        department: hospital.emergencyPhone ? 'Emergency & Trauma Desk' : 'Main Line',
        address: hospital.address,
        isEmergency: true
      });
    } else {
      triggerDeviceDial(phoneToCall);
    }
  };

  return (
    <div
      id="top-recommended-hospital-card"
      className="bg-white border border-emerald-300/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden"
    >
      {/* Top Priority Badge and Score */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold tracking-wide">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Priority Facility Match</span>
        </div>

        {/* Score Gauge */}
        <div className="flex items-baseline gap-1.5 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl shadow-2xs">
          <span className="text-xs uppercase font-medium text-slate-300">Compatibility:</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400">
            {breakdown.totalScore}
          </span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>

      {/* Hospital Name & Quick Specs */}
      <div className="space-y-1.5 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {hospital.category}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            ✓ 24/7 Emergency Verified
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
          {hospital.name}
        </h2>
        <p className="text-sm text-slate-600 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{hospital.address}</span>
        </p>
      </div>

      {/* Distance and Approximate Travel Time banner */}
      <div className="grid grid-cols-2 gap-3 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl mb-6">
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
            Distance
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-950">
            {breakdown.distanceKm} km
          </span>
        </div>
        <div>
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
            Approx Travel Time
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-950 flex items-center gap-1">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{formatETA(breakdown.estimatedMinutes)}</span>
          </span>
        </div>
      </div>

      {/* Why this hospital was recommended (Explainable checkmarks) */}
      <div className="mb-6 space-y-2.5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Clinical Compatibility & Readiness Factors:
        </h3>
        <ul className="space-y-2">
          {breakdown.reasons.map((reason, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs sm:text-sm font-medium text-slate-800"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Score Factor Breakdown */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Compatibility Criteria Weights</span>
          <span className="text-slate-400">Clinical Rubric</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-500 block text-[11px]">ER / Services</span>
            <span className="font-bold text-slate-900">
              {breakdown.emergencyServiceMatch} / 40
            </span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-500 block text-[11px]">Specialist Match</span>
            <span className="font-bold text-slate-900">
              {breakdown.specialistMatch} / 25
            </span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-500 block text-[11px]">Blood Stock</span>
            <span className="font-bold text-slate-900">
              {breakdown.bloodMatch} / 20
            </span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
            <span className="text-slate-500 block text-[11px]">Proximity</span>
            <span className="font-bold text-slate-900">
              {breakdown.distanceScore} / 15
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          id="rec-start-navigation-btn"
          type="button"
          onClick={handleStartNavigation}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md transition-all"
        >
          <Navigation className="w-5 h-5" />
          <span>Start Navigation</span>
        </button>

        <button
          id="rec-call-hospital-btn"
          type="button"
          onClick={handleCall}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
        >
          <Phone className="w-4 h-4 text-emerald-700" />
          <span>Call Hospital</span>
        </button>

        <button
          id="rec-view-details-btn"
          type="button"
          onClick={() => onViewDetails(hospital)}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recommendation Disclaimer */}
      <p className="text-[11px] sm:text-xs text-slate-500 italic mt-4 pt-3 border-t border-slate-100 leading-relaxed">
        * This recommendation is generated from application suitability scoring and does not replace medical judgment. Availability shown is demonstration data and subject to real-time hospital occupancy. Always contact the facility directly to verify admittance.
      </p>
    </div>
  );
};
