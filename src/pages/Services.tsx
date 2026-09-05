import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Phone,
  UserCheck,
  Info
} from 'lucide-react';
import { Hospital, ServiceName, UserLocation } from '../types';
import { HOSPITALS_DATA } from '../data/hospitalData';
import { ServiceCard } from '../components/ServiceCard';
import { Disclaimer } from '../components/Disclaimer';
import { savePreference } from '../services/storageService';
import { calculateDistance } from '../utils/distanceCalculator';

interface ServicesPageProps {
  userLocation: UserLocation | null;
  onViewHospital: (hospital: Hospital) => void;
  initialService?: ServiceName | '';
}

const SERVICES_LIST: { id: ServiceName; label: string; iconDesc: string }[] = [
  { id: 'Emergency Department', label: 'Emergency Department', iconDesc: '24/7 Acute Resuscitation' },
  { id: 'Cardiology', label: 'Cardiology', iconDesc: 'Heart Care & Cath Lab' },
  { id: 'Neurology', label: 'Neurology', iconDesc: 'Brain, Stroke & Spine' },
  { id: 'Orthopedics', label: 'Orthopedics', iconDesc: 'Fractures & Joint Trauma' },
  { id: 'Trauma Care', label: 'Trauma Care', iconDesc: 'Accident & Critical Surgery' },
  { id: 'Burn Care', label: 'Burn Care', iconDesc: 'Thermal & Wound Recovery' },
  { id: 'Pediatrics', label: 'Pediatrics', iconDesc: 'Child & Infant Emergency' },
  { id: 'Gynecology', label: 'Gynecology & Maternity', iconDesc: 'Obstetrics & Delivery' },
  { id: 'General Medicine', label: 'General Medicine', iconDesc: 'Internal Medicine & Triage' }
];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  userLocation,
  onViewHospital,
  initialService = 'Cardiology'
}) => {
  const [selectedService, setSelectedService] = useState<ServiceName>(
    (initialService as ServiceName) || 'Cardiology'
  );
  const [searchFilter, setSearchFilter] = useState<string>('');

  const handleSelectService = (srv: ServiceName) => {
    setSelectedService(srv);
    savePreference('service', srv);
  };

  const baseLat = userLocation?.latitude ?? 12.9716;
  const baseLon = userLocation?.longitude ?? 77.5946;

  // Filter facilities that offer the selected service, sorted by proximity and active emergency dept
  const matchingFacilities = HOSPITALS_DATA.filter((h) => {
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchSpecialist = h.specialists.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchSpecialist) return false;
    }
    return true;
  }).sort((a, b) => {
    const aHasService = a.services.includes(selectedService);
    const bHasService = b.services.includes(selectedService);
    if (aHasService && !bHasService) return -1;
    if (!aHasService && bHasService) return 1;

    const distA = calculateDistance(baseLat, baseLon, a.latitude, a.longitude);
    const distB = calculateDistance(baseLat, baseLon, b.latitude, b.longitude);
    return distA - distB;
  });

  return (
    <div className="space-y-8 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
          <span>Clinical Specialties • On-Call Coverage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Medical Specialties & On-Call Coverage
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Verify operational clinical departments, on-duty specialists, and advanced trauma surgery capabilities across regional hospitals.
        </p>
      </div>

      {/* Service Selector Tabs / Chips */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Required Healthcare Department:
          </span>
          <span className="text-xs text-slate-400">
            Current Filter: <strong className="text-blue-700 font-bold">{selectedService}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
          {SERVICES_LIST.map((item) => {
            const isSelected = selectedService === item.id;
            return (
              <button
                key={item.id}
                id={`service-select-btn-${item.id.replace(/\s+/g, '-').toLowerCase()}`}
                type="button"
                onClick={() => handleSelectService(item.id)}
                className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {item.iconDesc}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-500">
            Showing facilities with active <strong>{selectedService}</strong> specialists or emergency on-call physicians.
          </p>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search doctor or facility..."
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white w-full sm:w-64"
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Hospitals Equipped with <span className="text-blue-700">{selectedService}</span>
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
            {matchingFacilities.length} facilities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingFacilities.map((hospital) => (
            <ServiceCard
              key={hospital.id}
              hospital={hospital}
              service={selectedService}
              userLocation={userLocation}
              onViewHospital={onViewHospital}
            />
          ))}
        </div>
      </div>

      <Disclaimer variant="demo" />
    </div>
  );
};
