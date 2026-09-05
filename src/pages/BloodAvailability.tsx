import React, { useState } from 'react';
import {
  Droplet,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PhoneForwarded,
  Info,
  Building2,
  Check
} from 'lucide-react';
import { BloodGroup, Hospital, UserLocation, CallTarget } from '../types';
import { HOSPITALS_DATA, getHospitalsForLocation } from '../data/hospitalData';
import { BloodCard } from '../components/BloodCard';
import { Disclaimer } from '../components/Disclaimer';
import { savePreference } from '../services/storageService';
import { calculateDistance } from '../utils/distanceCalculator';

interface BloodAvailabilityPageProps {
  userLocation: UserLocation | null;
  onViewHospital: (hospital: Hospital) => void;
  initialBloodGroup?: BloodGroup | '';
  onStartCall?: (target: CallTarget) => void;
}

const BLOOD_GROUPS: BloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-'
];

export const BloodAvailabilityPage: React.FC<BloodAvailabilityPageProps> = ({
  userLocation,
  onViewHospital,
  initialBloodGroup = 'O+',
  onStartCall
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(
    (initialBloodGroup as BloodGroup) || 'O+'
  );
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const handleSelectGroup = (group: BloodGroup) => {
    setSelectedGroup(group);
    savePreference('blood_group', group);
  };

  const baseLat = userLocation?.latitude ?? 12.9716;
  const baseLon = userLocation?.longitude ?? 77.5946;

  const localizedHospitals = getHospitalsForLocation(userLocation);

  // Filter facilities by blood availability and distance
  const matchingFacilities = localizedHospitals.filter((hospital) => {
    const status = hospital.bloodAvailability[selectedGroup];

    if (onlyAvailable && status !== 'Available') {
      return false;
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = hospital.name.toLowerCase().includes(q);
      const matchLocality = hospital.locality.toLowerCase().includes(q);
      if (!matchName && !matchLocality) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort available stock first, then distance
    const statusOrder: Record<string, number> = {
      Available: 4,
      Limited: 3,
      'Contact to Confirm': 2,
      'Currently Unavailable': 1
    };
    const scoreA = statusOrder[a.bloodAvailability[selectedGroup]] || 0;
    const scoreB = statusOrder[b.bloodAvailability[selectedGroup]] || 0;

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    const distA = calculateDistance(baseLat, baseLon, a.latitude, a.longitude);
    const distB = calculateDistance(baseLat, baseLon, b.latitude, b.longitude);
    return distA - distB;
  });

  return (
    <div className="space-y-8 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200/80 text-xs font-semibold">
          <Droplet className="w-3.5 h-3.5 text-red-600" />
          <span>Hospital Blood Banks • Verified Inventory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Blood Bank Stock & Availability
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Check real-time reserves across certified regional hospital blood banks and connect directly with transfusion coordinators.
        </p>
      </div>

      {/* Mandatory Blood Warning Banner */}
      <div className="bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block font-bold mb-0.5">Critical Blood Bank Protocol:</strong>
          Blood inventory can change within minutes due to emergency surgeries and trauma intake.
          Please <strong>contact the facility by phone to reserve or confirm availability</strong> before travelling.
        </div>
      </div>

      {/* Blood Group Selector (8 Large Buttons) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Required Blood Group:
          </span>
          <span className="text-xs text-slate-400">
            Viewing: <strong className="text-red-700 font-extrabold">{selectedGroup}</strong> Group
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = selectedGroup === group;
            return (
              <button
                key={group}
                id={`blood-btn-${group.replace('+', 'pos').replace('-', 'neg')}`}
                type="button"
                onClick={() => handleSelectGroup(group)}
                className={`py-3 sm:py-3.5 rounded-2xl font-black text-base sm:text-lg transition-all flex flex-col items-center justify-center border-2 ${
                  isSelected
                    ? 'bg-red-600 border-red-700 text-white shadow-md scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-red-50/50 hover:border-red-200'
                }`}
              >
                <span>{group}</span>
                {isSelected && <span className="text-[10px] font-medium opacity-90">Selected</span>}
              </button>
            );
          })}
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                onlyAvailable
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Only show "Available" stock</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by hospital name..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Facilities Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Hospitals with <span className="text-red-600">{selectedGroup}</span> Blood Units
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
            {matchingFacilities.length} facilities listed
          </span>
        </div>

        {matchingFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingFacilities.map((hospital) => (
              <BloodCard
                key={hospital.id}
                hospital={hospital}
                bloodGroup={selectedGroup}
                status={hospital.bloodAvailability[selectedGroup]}
                userLocation={userLocation}
                onViewHospital={onViewHospital}
                onStartCall={onStartCall}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-8 space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Droplet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No blood availability data found.
            </h3>
            <p className="text-xs text-slate-500">
              No facilities currently show available units for {selectedGroup} with current filters. Try turning off the "Available only" filter or call blood banks directly.
            </p>
            <button
              type="button"
              onClick={() => {
                setOnlyAvailable(false);
                setSearchFilter('');
              }}
              className="text-xs font-bold text-emerald-700 underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <Disclaimer variant="demo" />
    </div>
  );
};
