import React from 'react';
import {
  Droplet,
  MapPin,
  Phone,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PhoneForwarded,
  ArrowRight
} from 'lucide-react';
import { AvailabilityStatus, BloodGroup, Hospital, UserLocation, CallTarget } from '../types';
import { calculateDistance, calculateETA, formatETA } from '../utils/distanceCalculator';
import { triggerDeviceDial } from '../services/callService';

interface BloodCardProps {
  hospital: Hospital;
  bloodGroup: BloodGroup;
  status: AvailabilityStatus;
  userLocation: UserLocation | null;
  onViewHospital: (hospital: Hospital) => void;
  onStartCall?: (target: CallTarget) => void;
}

export const BloodCard: React.FC<BloodCardProps> = ({
  hospital,
  bloodGroup,
  status,
  userLocation,
  onViewHospital,
  onStartCall
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

  const handleCallBloodBank = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phoneToCall = hospital.phone;
    if (onStartCall) {
      onStartCall({
        phoneNumber: phoneToCall,
        title: hospital.name,
        subtitle: `Blood Bank Direct Line • Group ${bloodGroup} (${status})`,
        hospitalName: hospital.name,
        department: `Blood Transfusion Unit (${bloodGroup})`,
        address: hospital.address,
        isEmergency: status === 'Available' || status === 'Limited'
      });
    } else {
      triggerDeviceDial(phoneToCall);
    }
  };

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
            <span>! Limited Stock</span>
          </span>
        );
      case 'Currently Unavailable':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>✕ Currently Unavailable</span>
          </span>
        );
      case 'Contact to Confirm':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            <PhoneForwarded className="w-3.5 h-3.5 text-slate-600" />
            <span>☎ Contact to Confirm</span>
          </span>
        );
    }
  };

  return (
    <div
      id={`blood-card-${hospital.id}-${bloodGroup}`}
      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black text-base border border-red-200">
              {bloodGroup}
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Blood Bank Unit
              </span>
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {hospital.name}
              </h3>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <p className="text-xs text-slate-600 flex items-center gap-1 mb-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{hospital.address}</span>
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 py-2 border-y border-slate-100 my-3">
          <span>Distance: <strong className="text-slate-900 font-bold">{distanceKm} km</strong></span>
          <span>ETA: <strong className="text-slate-900 font-bold">{formatETA(etaMinutes)}</strong></span>
          <span className="text-slate-500 font-medium text-[11px]">Direct Reserve</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          id={`call-blood-bank-${hospital.id}`}
          onClick={handleCallBloodBank}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors p-1 cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-700" />
          <span>Call Blood Bank</span>
        </button>

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
