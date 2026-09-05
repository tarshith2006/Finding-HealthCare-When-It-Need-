import React from 'react';
import { Filter, RotateCcw, Flame, Check } from 'lucide-react';
import { BloodGroup, FilterState, ServiceName } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResultsCount: number;
}

const ALL_SERVICES: ServiceName[] = [
  'Emergency Department',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'General Medicine',
  'Pediatrics',
  'Gynecology',
  'Burn Care',
  'Trauma Care'
];

const ALL_BLOOD_GROUPS: BloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'O+',
  'O-',
  'AB+',
  'AB-'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalResultsCount
}) => {
  const hasActiveFilters =
    filters.emergencyOnly ||
    filters.selectedService !== '' ||
    filters.selectedBloodGroup !== '' ||
    filters.maxDistanceKm < 25 ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Top row: Header, active count, reset */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
            <Filter className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">
            Filters & Criteria
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            {totalResultsCount} found
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Primary toggles: Emergency Only & Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Emergency Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Emergency Care
          </label>
          <button
            type="button"
            onClick={() =>
              onChange({ ...filters, emergencyOnly: !filters.emergencyOnly })
            }
            className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all ${
              filters.emergencyOnly
                ? 'bg-rose-50 border-rose-300 text-rose-850 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  filters.emergencyOnly ? 'bg-rose-600 animate-pulse' : 'bg-slate-400'
                }`}
              />
              24/7 Emergency Only
            </span>
            {filters.emergencyOnly && <Check className="w-4 h-4 text-rose-600" />}
          </button>
        </div>

        {/* Required Service Dropdown */}
        <div>
          <label
            htmlFor="filter-service"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
          >
            Required Service
          </label>
          <select
            id="filter-service"
            value={filters.selectedService}
            onChange={(e) =>
              onChange({
                ...filters,
                selectedService: e.target.value as ServiceName | ''
              })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
          >
            <option value="">All Services</option>
            {ALL_SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Blood Group Dropdown */}
        <div>
          <label
            htmlFor="filter-blood"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
          >
            Blood Group
          </label>
          <select
            id="filter-blood"
            value={filters.selectedBloodGroup}
            onChange={(e) =>
              onChange({
                ...filters,
                selectedBloodGroup: e.target.value as BloodGroup | ''
              })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
          >
            <option value="">Any Blood Group</option>
            {ALL_BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg} Group
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label
            htmlFor="filter-sort"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5"
          >
            Sort Results
          </label>
          <select
            id="filter-sort"
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as FilterState['sortBy']
              })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
          >
            <option value="nearest">Nearest First (Distance)</option>
            <option value="best_match">Best Capability Match</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Distance range quick buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Distance radius:</span>
          <div className="inline-flex gap-1">
            {[5, 10, 15, 25].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => onChange({ ...filters, maxDistanceKm: km })}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  filters.maxDistanceKm === km
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {km === 25 ? 'Any (25km)' : `< ${km} km`}
              </button>
            ))}
          </div>
        </div>

        {filters.selectedService && (
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
            Filtering by: {filters.selectedService}
          </span>
        )}
      </div>
    </div>
  );
};
