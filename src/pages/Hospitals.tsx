import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Filter,
  AlertCircle,
  Building2,
  CheckCircle2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { FilterState, Hospital, UserLocation, CallTarget } from '../types';
import { HOSPITALS_DATA, getHospitalsForLocation } from '../data/hospitalData';
import { HospitalCard } from '../components/HospitalCard';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { LocationButton } from '../components/LocationButton';
import { Loading } from '../components/Loading';
import { Disclaimer } from '../components/Disclaimer';
import { calculateDistance } from '../utils/distanceCalculator';
import { saveSearch } from '../services/storageService';

interface HospitalsPageProps {
  userLocation: UserLocation | null;
  onLocationChange: (location: UserLocation) => void;
  onViewDetails: (hospital: Hospital) => void;
  initialServiceFilter?: string;
  initialEmergencyOnly?: boolean;
  onStartCall?: (target: CallTarget) => void;
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({
  userLocation,
  onLocationChange,
  onViewDetails,
  initialServiceFilter = '',
  initialEmergencyOnly = false,
  onStartCall
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    emergencyOnly: initialEmergencyOnly,
    selectedService: (initialServiceFilter as FilterState['selectedService']) || '',
    selectedBloodGroup: '',
    maxDistanceKm: 25,
    sortBy: 'nearest'
  });

  const baseLat = userLocation?.latitude ?? 12.9716;
  const baseLon = userLocation?.longitude ?? 77.5946;

  const localizedHospitals = useMemo(() => {
    return getHospitalsForLocation(userLocation);
  }, [userLocation]);

  // Process and filter hospitals
  const filteredHospitals = useMemo(() => {
    return localizedHospitals.filter((hospital) => {
      // 1. Text search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = hospital.name.toLowerCase().includes(query);
        const matchesLocality = hospital.locality.toLowerCase().includes(query);
        const matchesAddress = hospital.address.toLowerCase().includes(query);
        const matchesService = hospital.services.some((s) =>
          s.toLowerCase().includes(query)
        );
        const matchesDoctor = hospital.doctors?.some(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.field.toLowerCase().includes(query) ||
            d.qualification.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesLocality && !matchesAddress && !matchesService && !matchesDoctor) {
          return false;
        }
      }

      // 2. Emergency Available filter
      if (filters.emergencyOnly && !hospital.emergencyAvailable) {
        return false;
      }

      // 3. Service filter
      if (filters.selectedService && !hospital.services.includes(filters.selectedService)) {
        return false;
      }

      // 4. Blood Group filter
      if (filters.selectedBloodGroup) {
        const status = hospital.bloodAvailability[filters.selectedBloodGroup];
        if (status !== 'Available' && status !== 'Limited') {
          return false;
        }
      }

      // 5. Distance filter
      const distance = calculateDistance(
        baseLat,
        baseLon,
        hospital.latitude,
        hospital.longitude
      );
      if (distance > filters.maxDistanceKm) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const distA = calculateDistance(baseLat, baseLon, a.latitude, a.longitude);
      const distB = calculateDistance(baseLat, baseLon, b.latitude, b.longitude);

      if (filters.sortBy === 'nearest') {
        return distA - distB;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'best_match': prioritizes emergency available + number of services
      const scoreA = (a.emergencyAvailable ? 30 : 0) + a.services.length * 4 - distA;
      const scoreB = (b.emergencyAvailable ? 30 : 0) + b.services.length * 4 - distB;
      return scoreB - scoreA;
    });
  }, [filters, baseLat, baseLon]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      saveSearch(query);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      emergencyOnly: false,
      selectedService: '',
      selectedBloodGroup: '',
      maxDistanceKm: 25,
      sortBy: 'nearest'
    });
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Header & Location Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Regional Directory • Live Operating Status</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Emergency Facilities & Hospitals
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time intake status, verified 24/7 trauma emergency departments, and drive times based on your current location.
          </p>
        </div>

        {/* Location Selector Button */}
        <div className="shrink-0">
          <LocationButton
            userLocation={userLocation}
            onLocationChange={(newLoc) => {
              onLocationChange(newLoc);
              setErrorMessage(null);
              setSuccessMessage(`Location updated to ${newLoc.label || 'GPS coordinates'}`);
              setTimeout(() => setSuccessMessage(null), 4000);
            }}
            onError={(msg) => {
              setErrorMessage(msg);
            }}
          />
        </div>
      </div>

      {/* Success or Error Notifications */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">{errorMessage}</span>
            <span className="text-amber-800">
              You can search for a hospital manually or select a preset area above.
            </span>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="w-full">
        <SearchBar
          value={filters.searchQuery}
          onChange={(val) => setFilters((prev) => ({ ...prev, searchQuery: val }))}
          onSearch={handleSearchSubmit}
          placeholder="Search hospitals by name, service (e.g. Cardiology), or locality..."
        />
      </div>

      {/* Filter and sorting bar */}
      <FilterBar
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        onReset={handleResetFilters}
        totalResultsCount={filteredHospitals.length}
      />

      {/* Hospitals Card Grid / Empty State */}
      {isLoading ? (
        <Loading message="Finding nearby hospitals..." />
      ) : filteredHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              userLocation={userLocation}
              onViewDetails={onViewDetails}
              highlightService={filters.selectedService}
              highlightBlood={filters.selectedBloodGroup}
              onStartCall={onStartCall}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            No nearby hospitals found.
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            No facilities match your active search "{filters.searchQuery}" or selected filter criteria within the {filters.maxDistanceKm} km radius.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-2xs"
          >
            <span>Try Another Search / Reset Filters</span>
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <Disclaimer variant="demo" />
    </div>
  );
};
