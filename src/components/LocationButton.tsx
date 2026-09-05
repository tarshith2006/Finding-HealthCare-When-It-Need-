import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  ChevronDown,
  Check,
  Search,
  Crosshair,
  Compass,
  X,
  AlertCircle,
  Globe
} from 'lucide-react';
import { UserLocation } from '../types';
import {
  getCurrentLocation,
  searchLocations,
  PRESET_LOCALITIES,
  GeocodingSearchResult
} from '../services/locationService';

interface LocationButtonProps {
  userLocation: UserLocation | null;
  onLocationChange: (loc: UserLocation) => void;
  onError: (msg: string) => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  userLocation,
  onLocationChange,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'presets'>('search');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleGetGPSLocation = async () => {
    setIsLoading(true);
    const res = await getCurrentLocation();
    setIsLoading(false);

    if (res.success && res.location) {
      onLocationChange(res.location);
      setIsOpen(false);
    } else {
      onError(res.errorMessage || 'Unable to retrieve location. Please search for your city manually.');
    }
  };

  const handleSelectResult = (result: GeocodingSearchResult) => {
    onLocationChange({
      latitude: result.latitude,
      longitude: result.longitude,
      label: result.label,
      city: result.city,
      isCustom: true,
      source: 'search'
    });
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectPreset = (preset: typeof PRESET_LOCALITIES[0]) => {
    onLocationChange({
      latitude: preset.latitude,
      longitude: preset.longitude,
      label: preset.name,
      city: preset.city,
      isCustom: true,
      source: 'preset'
    });
    setIsOpen(false);
  };

  const getSourceBadge = () => {
    if (!userLocation) return null;
    if (userLocation.source === 'gps') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>GPS</span>
        </span>
      );
    }
    if (userLocation.source === 'network') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-200">
          <span>Network IP</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-sm">
        <span>Verified Area</span>
      </span>
    );
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="inline-flex items-center gap-2">
        {/* Quick GPS button */}
        <button
          id="use-my-location-btn"
          type="button"
          onClick={handleGetGPSLocation}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs disabled:opacity-60"
          title="Detect precise GPS coordinates"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Crosshair className="w-3.5 h-3.5" />
          )}
          <span>{isLoading ? 'Detecting GPS...' : 'Locate Me'}</span>
        </button>

        {/* Location Dropdown Trigger */}
        <button
          id="select-area-btn"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs transition-all"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="font-semibold text-slate-900 truncate max-w-[150px] sm:max-w-[200px]">
            {userLocation?.label || 'Central Metro'}
          </span>
          {getSourceBadge()}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Expanded Location Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Active Location & Accuracy
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Coordinates Banner */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[11px]">Current Coordinates</span>
              <span className="font-bold text-slate-900 font-mono">
                {userLocation ? `${userLocation.latitude.toFixed(4)}°, ${userLocation.longitude.toFixed(4)}°` : 'Not Set'}
              </span>
            </div>
            {userLocation?.accuracyMeters && (
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">GPS Accuracy</span>
                <span className="font-bold text-emerald-700">±{userLocation.accuracyMeters}m</span>
              </div>
            )}
          </div>

          {/* 1-Click High Accuracy GPS Button */}
          <div className="p-3 border-b border-slate-100">
            <button
              type="button"
              onClick={handleGetGPSLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs transition-colors"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{isLoading ? 'Retrieving Precise GPS...' : 'Use Precise Device Location'}</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="p-3 border-b border-slate-100">
            <label htmlFor="location-search-input" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Search City, Neighborhood, or Postal Code:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="location-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Indiranagar, Mumbai, Austin, 560038..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs: Search Results vs Presets */}
          <div className="max-h-60 overflow-y-auto p-2">
            {searchQuery.trim().length >= 2 ? (
              <div>
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {isSearching ? 'Searching locations...' : `Search Results (${searchResults.length})`}
                </div>
                {searchResults.length === 0 && !isSearching && (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching localities found. Try a different city or area name.
                  </div>
                )}
                {searchResults.map((result, idx) => (
                  <button
                    key={`${result.label}-${idx}`}
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2 text-xs text-slate-800"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 block">{result.label}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Major Medical Hubs</span>
                  <span className="text-[10px] text-slate-400 lowercase">quick select</span>
                </div>
                {PRESET_LOCALITIES.map((preset) => {
                  const isSelected =
                    userLocation?.label === preset.name ||
                    (userLocation?.latitude === preset.latitude &&
                      userLocation?.longitude === preset.longitude);
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="truncate">{preset.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
