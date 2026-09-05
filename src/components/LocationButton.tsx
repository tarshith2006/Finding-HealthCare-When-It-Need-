import React, { useState } from 'react';
import { MapPin, Navigation, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { UserLocation } from '../types';
import { getCurrentLocation, PRESET_LOCALITIES } from '../services/locationService';

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
  const [showPresets, setShowPresets] = useState(false);

  const handleGetLocation = async () => {
    setIsLoading(true);
    const res = await getCurrentLocation();
    setIsLoading(false);

    if (res.success && res.location) {
      onLocationChange(res.location);
    } else {
      onError(res.errorMessage || 'Location request failed. Please select an area manually.');
    }
  };

  const handleSelectPreset = (preset: { name: string; latitude: number; longitude: number }) => {
    onLocationChange({
      latitude: preset.latitude,
      longitude: preset.longitude,
      label: preset.name,
      isCustom: true
    });
    setShowPresets(false);
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 flex-wrap">
      <button
        id="use-my-location-btn"
        type="button"
        onClick={handleGetLocation}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
        title="Detect your precise coordinates using browser geolocation"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Navigation className="w-4 h-4 text-emerald-700" />
        )}
        <span>{isLoading ? 'Detecting Location...' : 'Use My Location'}</span>
      </button>

      <div className="relative">
        <button
          id="select-area-btn"
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          aria-expanded={showPresets}
          aria-haspopup="true"
        >
          <MapPin className="w-4 h-4 text-slate-500" />
          <span className="truncate max-w-[140px] sm:max-w-[200px]">
            {userLocation?.label || 'Central Metro'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showPresets && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setShowPresets(false)}
            />
            <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Locality Area
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
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      isSelected ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
