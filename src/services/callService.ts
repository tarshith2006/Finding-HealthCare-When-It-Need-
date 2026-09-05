import { UserLocation } from '../types';

/**
 * Strips non-digit characters except leading plus sign.
 * Example: "+1 (555) 911-0101" -> "+15559110101"
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Formats a clean phone number for crisp, human-readable display.
 */
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return '';
  const clean = cleanPhoneNumber(phone);

  // Short emergency codes like 911, 112, 108, 999
  if (clean.length <= 4) {
    return clean;
  }

  // 10-digit North American
  if (clean.length === 10) {
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
  }
  // 11-digit North American with +1 or 1
  if (clean.length === 11 && clean.startsWith('1')) {
    return `+1 (${clean.slice(1, 4)}) ${clean.slice(4, 7)}-${clean.slice(7)}`;
  }
  if (clean.startsWith('+1') && clean.length === 12) {
    return `+1 (${clean.slice(2, 5)}) ${clean.slice(5, 8)}-${clean.slice(8)}`;
  }

  // General international
  return phone;
}

/**
 * Returns regional emergency dispatch numbers based on user's localized coordinates/city.
 */
export function getEmergencyHotlines(userLocation?: UserLocation | null): {
  primary: { number: string; label: string; desc: string };
  secondary?: { number: string; label: string; desc: string };
} {
  const city = (userLocation?.city || userLocation?.label || '').toLowerCase();
  const isIndia =
    city.includes('bengaluru') ||
    city.includes('bangalore') ||
    city.includes('mumbai') ||
    city.includes('delhi') ||
    city.includes('hyderabad') ||
    city.includes('chennai') ||
    (userLocation?.latitude && userLocation.latitude > 8 && userLocation.latitude < 37 && userLocation.longitude > 68 && userLocation.longitude < 97);

  const isUK =
    city.includes('london') ||
    city.includes('uk') ||
    (userLocation?.latitude && userLocation.latitude > 49 && userLocation.latitude < 61 && userLocation.longitude > -9 && userLocation.longitude < 2);

  if (isIndia) {
    return {
      primary: {
        number: '108',
        label: '108 (Ambulance / Medical Emergency)',
        desc: 'Direct National Emergency Medical Ambulance Service'
      },
      secondary: {
        number: '112',
        label: '112 (National Unified Emergency)',
        desc: 'All-in-one Police, Fire & Medical Dispatch'
      }
    };
  }

  if (isUK) {
    return {
      primary: {
        number: '999',
        label: '999 (Emergency Services)',
        desc: 'Direct NHS Ambulance & Medical Response'
      },
      secondary: {
        number: '112',
        label: '112 (European Emergency Number)',
        desc: 'Alternative Emergency Services Dispatch'
      }
    };
  }

  // Default North America / International
  return {
    primary: {
      number: '911',
      label: '911 (Emergency Dispatch)',
      desc: 'Immediate Ambulance & Paramedic Dispatch'
    },
    secondary: {
      number: '112',
      label: '112 (International Emergency)',
      desc: 'Global GSM Emergency Standard'
    }
  };
}

/**
 * Safely triggers native telephony dialing WITHOUT navigating the page or
 * opening a blank page/tab in Google Chrome or embedded iframes.
 */
export function triggerDeviceDial(phone: string): boolean {
  const clean = cleanPhoneNumber(phone);
  if (!clean) return false;

  const telUri = `tel:${clean}`;

  // Strategy 1: Hidden iframe invocation.
  // In Chrome and sandboxed frames, setting an invisible iframe's src to tel:
  // prompts the OS telephony handler without affecting top or frame navigation.
  try {
    let frame = document.getElementById('careroute-telephony-frame') as HTMLIFrameElement | null;
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'careroute-telephony-frame';
      frame.style.display = 'none';
      frame.style.position = 'absolute';
      frame.style.width = '0px';
      frame.style.height = '0px';
      frame.style.border = 'none';
      document.body.appendChild(frame);
    }
    frame.src = telUri;
    return true;
  } catch (err) {
    console.warn('Iframe dialing error:', err);
  }

  // Strategy 2: Programmatic anchor click without target="_blank"
  try {
    const link = document.createElement('a');
    link.href = telUri;
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      try {
        document.body.removeChild(link);
      } catch {}
    }, 1000);
    return true;
  } catch (err) {
    console.error('Anchor dialing error:', err);
    return false;
  }
}

/**
 * Copies phone number to system clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}

  // Fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Creates a WhatsApp direct call/chat link with an optional emergency announcement message.
 */
export function getWhatsAppUrl(phone: string, customMessage?: string): string {
  const clean = cleanPhoneNumber(phone).replace(/^\+/, '');
  const defaultMsg = encodeURIComponent(
    customMessage || 'Urgent: Requesting emergency medical intake / ambulance confirmation via CareRoute.'
  );
  return `https://wa.me/${clean}?text=${defaultMsg}`;
}

/**
 * Web Audio API synthesizer for realistic ringback feedback.
 * Provides immediate audible confirmation that the connection is active.
 */
class TelephonyAudioFeedback {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private intervalId: any = null;

  startRing() {
    if (this.isPlaying) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.isPlaying = true;

      const playBurst = () => {
        if (!this.ctx || !this.isPlaying) return;

        try {
          const now = this.ctx.currentTime;
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          // Standard North American/International Ringback: 440 Hz + 480 Hz
          osc1.frequency.setValueAtTime(440, now);
          osc2.frequency.setValueAtTime(480, now);

          // Gentle fade in and out (1.8 second ring)
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
          gain.gain.setValueAtTime(0.08, now + 1.7);
          gain.gain.linearRampToValueAtTime(0, now + 1.8);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 1.8);
          osc2.stop(now + 1.8);
        } catch {}
      };

      // Play first burst immediately
      playBurst();
      // Repeat burst every 3.5 seconds
      this.intervalId = setInterval(() => {
        if (this.isPlaying) {
          playBurst();
        }
      }, 3500);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  stopRing() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    try {
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
      }
    } catch {}
    this.ctx = null;
  }
}

export const audioFeedback = new TelephonyAudioFeedback();
