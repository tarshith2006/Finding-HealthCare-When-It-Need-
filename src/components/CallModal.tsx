import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  PhoneCall,
  PhoneOff,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Volume2,
  VolumeX,
  ShieldAlert,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { CallTarget } from '../types';
import {
  cleanPhoneNumber,
  formatPhoneDisplay,
  triggerDeviceDial,
  copyToClipboard,
  getWhatsAppUrl,
  audioFeedback
} from '../services/callService';

interface CallModalProps {
  target: CallTarget | null;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ target, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dial' | 'qr'>('dial');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [callStatus, setCallStatus] = useState<'dialing' | 'ringing' | 'connected'>('dialing');
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!target) return;

    // Immediately trigger safe device dialing
    triggerDeviceDial(target.phoneNumber);

    // Start ring sound if not muted
    if (!isAudioMuted) {
      audioFeedback.startRing();
    }

    // Generate QR code for mobile camera scanning
    const cleanPhone = cleanPhoneNumber(target.phoneNumber);
    QRCode.toDataURL(`tel:${cleanPhone}`, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error', err));

    // Progression of call status
    const ringTimeout = setTimeout(() => {
      setCallStatus('ringing');
    }, 1200);

    const connectTimeout = setTimeout(() => {
      setCallStatus('connected');
    }, 4000);

    // Call duration timer
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(ringTimeout);
      clearTimeout(connectTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      audioFeedback.stopRing();
    };
  }, [target]);

  const toggleMute = () => {
    if (isAudioMuted) {
      audioFeedback.startRing();
      setIsAudioMuted(false);
    } else {
      audioFeedback.stopRing();
      setIsAudioMuted(true);
    }
  };

  const handleManualRedial = () => {
    if (!target) return;
    triggerDeviceDial(target.phoneNumber);
    if (!isAudioMuted) {
      audioFeedback.startRing();
    }
  };

  const handleCopy = async () => {
    if (!target) return;
    const clean = cleanPhoneNumber(target.phoneNumber);
    const success = await copyToClipboard(clean);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleEndCall = () => {
    audioFeedback.stopRing();
    onClose();
  };

  if (!target) return null;

  const formattedNumber = formatPhoneDisplay(target.phoneNumber);
  const cleanNumber = cleanPhoneNumber(target.phoneNumber);
  const isEmergency = target.isEmergency || target.phoneNumber.includes('911') || target.phoneNumber === '112' || target.phoneNumber === '108';

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="care-route-call-dialog"
        className="bg-slate-900 border border-slate-700/80 text-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
      >
        {/* Top Header & Status */}
        <div
          className={`p-6 text-center relative overflow-hidden ${
            isEmergency ? 'bg-rose-950/70 border-b border-rose-900/50' : 'bg-slate-800/60 border-b border-slate-800'
          }`}
        >
          {/* Subtle audio mute toggle button */}
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            title={isAudioMuted ? 'Unmute Call Audio' : 'Mute Call Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
          </button>

          {/* Animated Pulsing Phone Icon */}
          <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <span
              className={`absolute inset-0 rounded-full animate-ping opacity-40 ${
                isEmergency ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            <span
              className={`absolute inset-2 rounded-full animate-pulse opacity-60 ${
                isEmergency ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            />
            <div
              className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                isEmergency ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              <PhoneCall className="w-7 h-7 animate-bounce" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/10 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {callStatus === 'dialing' && 'Connecting Line...'}
              {callStatus === 'ringing' && 'Ringing Destination...'}
              {callStatus === 'connected' && `Active Call • ${formatTimer(elapsedSeconds)}`}
            </div>

            <h2 id="call-modal-title" className="text-xl font-black tracking-tight text-white line-clamp-1">
              {target.title}
            </h2>

            {target.department && (
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                {target.department}
              </p>
            )}

            {target.subtitle && (
              <p className="text-xs text-slate-400 line-clamp-1">{target.subtitle}</p>
            )}
          </div>

          {/* Large, High-Contrast Phone Number */}
          <div className="mt-4 py-2 px-4 bg-black/40 rounded-2xl border border-white/10 inline-flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-wider font-mono">
              {formattedNumber}
            </span>
          </div>
        </div>

        {/* Modal Body: Switch between Direct Dial and Scan QR */}
        <div className="p-5 space-y-4">
          {/* Tab Selector */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('dial')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'dial' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Direct Dial</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'qr' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan to Call on Phone</span>
            </button>
          </div>

          {activeTab === 'dial' ? (
            <div className="space-y-3">
              {/* Device prompt banner */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Call Signal Transmitted</span>
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Your device's phone dialer has been triggered. If Google Chrome shows a protocol permission prompt, select <strong>"Make a call"</strong> or <strong>"Open Phone"</strong>.
                </p>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="call-modal-redial-btn"
                  onClick={handleManualRedial}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Redial Now</span>
                </button>

                <button
                  type="button"
                  id="call-modal-copy-btn"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Number'}</span>
                </button>
              </div>

              {/* WhatsApp Alternative */}
              <a
                href={getWhatsAppUrl(target.phoneNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Facility via WhatsApp</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-xs text-slate-300">
                Point your mobile phone camera at this QR code to dial <strong>{formattedNumber}</strong> instantly from your phone:
              </p>

              <div className="bg-white p-3 rounded-2xl inline-block shadow-md">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt={`Scan to call ${formattedNumber}`}
                    className="w-44 h-44 mx-auto rounded-lg"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                    Generating Code...
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                Compatible with iOS Camera, Android Lens & any QR scanner.
              </p>
            </div>
          )}

          {/* Facility Location Details if provided */}
          {target.address && (
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span className="truncate">{target.address}</span>
            </div>
          )}
        </div>

        {/* Modal Footer: End Call Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>CareRoute Emergency Dispatch</span>
          </span>

          <button
            type="button"
            id="call-modal-end-btn"
            onClick={handleEndCall}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End / Close Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
