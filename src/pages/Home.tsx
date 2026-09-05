import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Droplet,
  Stethoscope,
  Compass,
  Clock,
  PhoneCall,
  Activity,
  HeartPulse,
  Brain,
  Baby,
  Flame,
  Car,
  Search,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { NavPage } from '../components/Navbar';
import { Disclaimer } from '../components/Disclaimer';
import { getSearches, getEmergency, getRecommendations } from '../services/storageService';
import { EMERGENCY_OPTIONS } from '../data/emergencyData';
import { UserLocation, CallTarget } from '../types';
import { getEmergencyHotlines, triggerDeviceDial } from '../services/callService';

interface HomeProps {
  onNavigate: (page: NavPage) => void;
  onSelectEmergency: (emergencyId: string) => void;
  userLocation?: UserLocation | null;
  onStartCall?: (target: CallTarget) => void;
}

export const Home: React.FC<HomeProps> = ({
  onNavigate,
  onSelectEmergency,
  userLocation,
  onStartCall
}) => {
  const [quickQuery, setQuickQuery] = useState('');
  const recentSearches = getSearches();
  const lastEmergencyId = getEmergency();
  const recentRecs = getRecommendations();
  const hotlines = getEmergencyHotlines(userLocation);

  const handleCallHotline = () => {
    if (onStartCall) {
      onStartCall({
        phoneNumber: hotlines.primary.number,
        title: hotlines.primary.label,
        subtitle: `${hotlines.primary.desc} • Immediate Medical Dispatch`,
        department: 'National Emergency Dispatch',
        isEmergency: true
      });
    } else {
      triggerDeviceDial(hotlines.primary.number);
    }
  };

  const lastEmergencyObj = lastEmergencyId
    ? EMERGENCY_OPTIONS.find((e) => e.id === lastEmergencyId)
    : null;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('hospitals');
  };

  const handleTriageSelect = (id: string) => {
    onSelectEmergency(id);
    onNavigate('emergency');
  };

  return (
    <div className="space-y-10 sm:space-y-14 py-4 sm:py-6 animate-in fade-in duration-300">
      {/* Urgent Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-white/15 rounded-xl shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Acute Medical Emergency?
              </h2>
              <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Immediate Action
              </span>
            </div>
            <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl leading-relaxed">
              If someone is unresponsive, bleeding profusely, or experiencing severe chest pain or stroke signs, call local emergency dispatch immediately.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            id="home-emergency-call-btn"
            onClick={handleCallHotline}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-rose-700" />
            <span>Call {hotlines.primary.number} Direct</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('emergency')}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-white font-semibold text-xs sm:text-sm border border-rose-400/30 transition-colors"
          >
            <span>Emergency Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Regional Emergency Medical Dispatch Directory</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Find critical care & hospitals <br className="hidden sm:inline" />
          <span className="text-emerald-700">when seconds count.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Locate 24/7 emergency departments, check real-time blood bank inventory, verify on-call clinical specialists, and get direct directions to the right facility.
        </p>

        {/* Immediate Search Bar */}
        <form onSubmit={handleQuickSearch} className="max-w-xl mx-auto flex items-center gap-2 p-1.5 bg-white border border-slate-300 rounded-2xl shadow-xs focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Search hospital, specialty (Cardiology, Trauma), or locality..."
            className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none py-1.5 px-2"
          />
          <button
            type="submit"
            className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Explore
          </button>
        </form>

        {/* Quick Acute Symptom Triage Chips */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Emergency Triage Shortcuts:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'heart', label: 'Chest Pain / Cardiac', icon: <HeartPulse className="w-3.5 h-3.5 text-rose-600" /> },
              { id: 'accident', label: 'Accident & Trauma', icon: <Car className="w-3.5 h-3.5 text-rose-600" /> },
              { id: 'stroke', label: 'Stroke Symptoms', icon: <Brain className="w-3.5 h-3.5 text-rose-600" /> },
              { id: 'pregnancy', label: 'Maternity / Labor', icon: <Baby className="w-3.5 h-3.5 text-rose-600" /> },
              { id: 'burns', label: 'Severe Burns', icon: <Flame className="w-3.5 h-3.5 text-rose-600" /> }
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleTriageSelect(chip.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-800 transition-colors shadow-2xs"
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live System Operational Network Indicators */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Regional Health Network Status
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Central District • Verified Live Database
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Facilities Online</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">10 Centers</span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
              ✓ Multi-specialty & Trauma
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Active 24/7 ER Bays</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">8 Hospitals</span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
              ✓ Open without appointment
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Blood Inventory</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">8 Groups</span>
            <span className="text-[11px] text-slate-600 font-semibold mt-1 inline-flex items-center gap-1">
              A, B, AB, O (+ / -)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">GPS Routing</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">Turn-by-Turn</span>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
              ✓ Live ETA calculation
            </span>
          </div>
        </div>
      </section>

      {/* Care Services & Directory Hub */}
      <section className="space-y-5">
        <div className="flex items-end justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Emergency & Healthcare Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select a clinical module to begin assessment, browse availability, or initiate routing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Emergency Triage Card */}
          <div
            onClick={() => onNavigate('emergency')}
            className="group bg-white border border-slate-200 hover:border-rose-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-800 transition-colors mb-1.5">
                Emergency Triage
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rapid condition assessment for acute trauma, cardiac distress, stroke, obstetrics, and burns with mapped clinical capability requirements.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-700">
              <span>Start Triage Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hospital Directory Card */}
          <div
            onClick={() => onNavigate('hospitals')}
            className="group bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-emerald-100">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-1.5">
                Hospital Directory & Live Status
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore nearby hospitals with GPS proximity, 24/7 ER availability verification, trauma rating, bed capacity, and direct emergency desk numbers.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Browse Facilities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Blood Bank Reserves Card */}
          <div
            onClick={() => onNavigate('blood')}
            className="group bg-white border border-slate-200 hover:border-red-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-red-100">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-red-800 transition-colors mb-1.5">
                Blood Bank Reserves
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check stock levels across all 8 blood groups with immediate contact lines to hospital blood banks for critical transfusion holds.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-700">
              <span>Check Blood Stock</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Specialists On Call Card */}
          <div
            onClick={() => onNavigate('services')}
            className="group bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-blue-100">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-800 transition-colors mb-1.5">
                Clinical Specialists & Departments
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by 9 medical specialties, view on-call consultant physicians, and verify active Cath Lab, ICU, or Trauma surgery readiness.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>View Specialists</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Facility Triage Matcher Card (spans 2 cols on lg) */}
          <div
            onClick={() => onNavigate('recommendation')}
            className="group bg-white border border-slate-200 hover:border-slate-400 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between lg:col-span-2"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mb-1.5">
                Facility Triage & Matching Engine
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combines emergency condition requirements, on-duty surgical and specialist coverage, blood unit availability, and live transit distance to identify your highest-suitability hospital.
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
              <span>Launch Triage Matcher</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity / Session State */}
      {(lastEmergencyObj || recentSearches.length > 0 || recentRecs.length > 0) && (
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recent Session Activity
            </span>
            <span className="text-[11px] text-slate-400">Stored locally on your device</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {lastEmergencyObj && (
              <button
                type="button"
                onClick={() => {
                  onSelectEmergency(lastEmergencyObj.id);
                  onNavigate('emergency');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold hover:bg-rose-100"
              >
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>Last Triage: {lastEmergencyObj.title}</span>
              </button>
            )}

            {recentRecs.length > 0 && (
              <button
                type="button"
                onClick={() => onNavigate('recommendation')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100"
              >
                <Compass className="w-3 h-3 text-emerald-600" />
                <span>Last Match: {recentRecs[0].hospitalName}</span>
              </button>
            )}

            {recentSearches.slice(0, 3).map((term, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate('hospitals')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 text-xs font-medium hover:bg-slate-100"
              >
                <Search className="w-3 h-3 text-slate-400" />
                <span>"{term}"</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Safety & Protocol Notice */}
      <Disclaimer variant="general" />
    </div>
  );
};
