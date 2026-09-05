import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  MapPin,
  Droplet,
  Stethoscope,
  Compass,
  Menu,
  X,
  HelpCircle,
  PhoneCall,
  Activity
} from 'lucide-react';
import { UserLocation, CallTarget } from '../types';
import { LocationButton } from './LocationButton';
import { getEmergencyHotlines, triggerDeviceDial } from '../services/callService';

export type NavPage =
  | 'home'
  | 'emergency'
  | 'hospitals'
  | 'blood'
  | 'services'
  | 'recommendation';

interface NavbarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenAbout: () => void;
  userLocation?: UserLocation | null;
  onLocationChange?: (loc: UserLocation) => void;
  onStartCall?: (target: CallTarget) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenAbout,
  userLocation,
  onLocationChange,
  onStartCall
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hotlines = getEmergencyHotlines(userLocation);

  const handleNav = (page: NavPage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleEmergencyCall = () => {
    if (onStartCall) {
      onStartCall({
        phoneNumber: hotlines.primary.number,
        title: hotlines.primary.label,
        subtitle: `${hotlines.primary.desc} • Immediate Dispatch`,
        department: 'National Emergency Dispatch',
        isEmergency: true
      });
    } else {
      triggerDeviceDial(hotlines.primary.number);
    }
  };

  const navItems: { id: NavPage; label: string; icon: React.ReactNode; isEmergency?: boolean }[] = [
    { id: 'home', label: 'Overview', icon: <HeartPulse className="w-4 h-4" /> },
    {
      id: 'emergency',
      label: 'Emergency Triage',
      icon: <AlertTriangle className="w-4 h-4" />,
      isEmergency: true
    },
    { id: 'hospitals', label: 'Hospitals', icon: <MapPin className="w-4 h-4" /> },
    { id: 'blood', label: 'Blood Bank', icon: <Droplet className="w-4 h-4" /> },
    { id: 'services', label: 'Specialists', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'recommendation', label: 'Triage Match', icon: <Compass className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Clinical Brand */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 group-hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-xs">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  CareRoute
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Network
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Emergency Healthcare & Hospital Navigation
              </p>
            </div>
          </div>

          {/* Desktop Navigation - Pill Segmented Style */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              if (item.isEmergency) {
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Location, About & Emergency Hotline */}
          <div className="hidden sm:flex items-center gap-2">
            {userLocation && onLocationChange && (
              <div className="mr-1">
                <LocationButton
                  userLocation={userLocation}
                  onLocationChange={onLocationChange}
                  onError={() => {}}
                />
              </div>
            )}

            <button
              id="nav-about-btn"
              type="button"
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="System Documentation & Clinical Protocols"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Protocol Info</span>
            </button>

            <button
              id="nav-emergency-call-btn"
              type="button"
              onClick={handleEmergencyCall}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              title={`Direct Emergency Dispatch (${hotlines.primary.number})`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-100 animate-pulse" />
              <span>Call {hotlines.primary.number}</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              id="nav-mobile-quick-call-btn"
              onClick={handleEmergencyCall}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-lg shadow-xs sm:hidden cursor-pointer"
              title={`Direct Emergency Dispatch (${hotlines.primary.number})`}
            >
              <PhoneCall className="w-3 h-3" />
              <span>{hotlines.primary.number}</span>
            </button>
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {userLocation && onLocationChange && (
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Location:
              </span>
              <LocationButton
                userLocation={userLocation}
                onLocationChange={onLocationChange}
                onError={() => {}}
              />
            </div>
          )}

          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Emergency Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  item.isEmergency
                    ? isActive
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-rose-50 text-rose-800'
                    : isActive
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 px-1">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAbout();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Protocols & Criteria</span>
            </button>

            <button
              type="button"
              id="nav-mobile-drawer-call-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleEmergencyCall();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency {hotlines.primary.number}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
