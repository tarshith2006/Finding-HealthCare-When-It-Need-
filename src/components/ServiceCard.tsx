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
import { AvailabilityStatus, Hospital, ServiceName, UserLocation, CallTarget } from '../types';
import { calculateDistance, calculateETA, formatETA } from '../utils/distanceCalculator';
import { triggerDeviceDial } from '../services/callService';

interface ServiceCardProps {
  hospital: Hospital;
  service: ServiceName;
  userLocation: UserLocation | null;
  onViewHospital: (hospital: Hospital) => void;
  onStartCall?: (target: CallTarget) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  hospital,
  service,
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

  const handleCallDesk = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phoneToCall = hospital.emergencyPhone || hospital.phone;
    if (onStartCall) {
      onStartCall({
        phoneNumber: phoneToCall,
        title: hospital.name,
        subtitle: `${service} Service Desk • ${hospital.address}`,
        hospitalName: hospital.name,
        department: `${service} Department`,
        address: hospital.address,
        isEmergency: hospital.emergencyAvailable
      });
    } else {
      triggerDeviceDial(phoneToCall);
    }
  };

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
            <span className="text-slate-500">Department Status:</span>
            <span className="font-medium text-slate-800 truncate max-w-[180px]">
              {isServiceOffered ? 'Active Clinical Department' : 'Not Offered'}
            </span>
          </div>

          {/* Attending Doctor for this Department */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Attending Doctor & Field:
            </span>
            {(() => {
              const serviceKeyword = service.toLowerCase().split(' ')[0];
              const matchingDoctor = hospital.doctors?.find((doc) =>
                doc.field.toLowerCase().includes(serviceKeyword)
              );

              if (matchingDoctor) {
                return (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs truncate flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{matchingDoctor.name}</span>
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                        {matchingDoctor.availabilityStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-900 font-medium truncate mt-0.5">
                      Field: {matchingDoctor.field}
                    </div>
                  </div>
                );
              }

              return (
                <div className="text-xs text-slate-600 font-medium">
                  {matchingSpecialist || (isServiceOffered ? 'Department Duty Specialist on call' : 'None')}
                </div>
              );
            })()}
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
        <button
          type="button"
          id={`call-service-desk-${hospital.id}`}
          onClick={handleCallDesk}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-700" />
          <span>Call Desk</span>
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
