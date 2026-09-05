import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  PhoneCall,
  ShieldAlert,
  MapPin,
  Droplet,
  Stethoscope,
  Award,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { EmergencyCategory, Hospital, UserLocation, CallTarget } from './types';
import { Navbar, NavPage } from './components/Navbar';
import { Home } from './pages/Home';
import { EmergencyPage } from './pages/Emergency';
import { HospitalsPage } from './pages/Hospitals';
import { BloodAvailabilityPage } from './pages/BloodAvailability';
import { ServicesPage } from './pages/Services';
import { RecommendationPage } from './pages/Recommendation';
import { HospitalDetailsModal } from './components/HospitalDetailsModal';
import { AboutModal } from './components/AboutModal';
import { CallModal } from './components/CallModal';
import { getEmergency } from './services/storageService';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('home');
  const [userLocation, setUserLocation] = useState<UserLocation | null>({
    latitude: 12.9716,
    longitude: 77.5946,
    label: 'Central Metro (Default)'
  });
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [activeCallTarget, setActiveCallTarget] = useState<CallTarget | null>(null);

  // Cross-page parameters
  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState<EmergencyCategory | ''>(() => {
    return getEmergency() || '';
  });
  const [hospitalsServiceFilter, setHospitalsServiceFilter] = useState<string>('');
  const [hospitalsEmergencyOnly, setHospitalsEmergencyOnly] = useState<boolean>(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleNavigate = (page: NavPage) => {
    setActivePage(page);
  };

  const handleSelectEmergencyFromHome = (emergencyId: string) => {
    setSelectedEmergencyCategory(emergencyId as EmergencyCategory);
    setActivePage('emergency');
  };

  const handleNavigateToHospitalsFromEmergency = (emergencyService?: string) => {
    if (emergencyService) {
      setHospitalsServiceFilter(emergencyService);
    }
    setHospitalsEmergencyOnly(true);
    setActivePage('hospitals');
  };

  const handleNavigateToRecommendationFromEmergency = (emergencyId: EmergencyCategory) => {
    setSelectedEmergencyCategory(emergencyId);
    setActivePage('recommendation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        userLocation={userLocation}
        onLocationChange={(loc) => setUserLocation(loc)}
        onStartCall={setActiveCallTarget}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activePage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectEmergency={handleSelectEmergencyFromHome}
            userLocation={userLocation}
            onStartCall={setActiveCallTarget}
          />
        )}

        {activePage === 'emergency' && (
          <EmergencyPage
            userLocation={userLocation}
            selectedEmergencyId={selectedEmergencyCategory}
            onSelectEmergency={(id) => setSelectedEmergencyCategory(id)}
            onNavigateToHospitals={handleNavigateToHospitalsFromEmergency}
            onNavigateToRecommendation={handleNavigateToRecommendationFromEmergency}
            onViewHospitalDetails={(h) => setSelectedHospitalForModal(h)}
            onStartCall={setActiveCallTarget}
          />
        )}

        {activePage === 'hospitals' && (
          <HospitalsPage
            userLocation={userLocation}
            onLocationChange={(loc) => setUserLocation(loc)}
            onViewDetails={(h) => setSelectedHospitalForModal(h)}
            initialServiceFilter={hospitalsServiceFilter}
            initialEmergencyOnly={hospitalsEmergencyOnly}
            onStartCall={setActiveCallTarget}
          />
        )}

        {activePage === 'blood' && (
          <BloodAvailabilityPage
            userLocation={userLocation}
            onViewHospital={(h) => setSelectedHospitalForModal(h)}
            onStartCall={setActiveCallTarget}
          />
        )}

        {activePage === 'services' && (
          <ServicesPage
            userLocation={userLocation}
            onViewHospital={(h) => setSelectedHospitalForModal(h)}
            onStartCall={setActiveCallTarget}
          />
        )}

        {activePage === 'recommendation' && (
          <RecommendationPage
            userLocation={userLocation}
            onLocationChange={(loc) => setUserLocation(loc)}
            onViewDetails={(h) => setSelectedHospitalForModal(h)}
            initialEmergencyId={selectedEmergencyCategory}
            onStartCall={setActiveCallTarget}
          />
        )}
      </main>

      {/* Hospital Details Modal */}
      <HospitalDetailsModal
        hospital={selectedHospitalForModal}
        userLocation={userLocation}
        onClose={() => setSelectedHospitalForModal(null)}
        onStartCall={setActiveCallTarget}
      />

      {/* About & Algorithm Help Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Direct Call / Dialer Modal */}
      <CallModal
        target={activeCallTarget}
        onClose={() => setActiveCallTarget(null)}
      />

      {/* Application Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  CareRoute
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Emergency Healthcare Access & Hospital Dispatch Directory
              </p>
            </div>

            {/* Quick Footer Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => handleNavigate('emergency')}
                className="text-rose-700 hover:text-rose-800"
              >
                Emergency Triage
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('hospitals')}
                className="hover:text-slate-900"
              >
                Hospital Directory
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('blood')}
                className="hover:text-slate-900"
              >
                Blood Reserves
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('services')}
                className="hover:text-slate-900"
              >
                Specialties & On-Call
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('recommendation')}
                className="hover:text-slate-900"
              >
                Facility Matcher
              </button>
              <button
                type="button"
                onClick={() => setIsAboutModalOpen(true)}
                className="text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Protocol Info</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} CareRoute Health Systems. Central Medical Dispatch & Regional Facility Network.
            </p>
            <p className="text-center sm:text-right text-[11px] text-slate-400 max-w-lg leading-relaxed">
              CareRoute provides navigational assistance and directory verification. Always contact emergency dispatch (911 / 112) immediately in life-threatening events.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
