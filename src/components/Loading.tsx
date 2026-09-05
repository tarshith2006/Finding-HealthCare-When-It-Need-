import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  subtext?: string;
  fullHeight?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading healthcare information...',
  subtext,
  fullHeight = false
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center text-center p-8 ${
        fullHeight ? 'min-h-[360px]' : 'py-12'
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-emerald-600 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-800">{message}</p>
      {subtext && <p className="mt-1 text-sm text-slate-500 max-w-sm">{subtext}</p>}
      <span className="sr-only">{message}</span>
    </div>
  );
};
