import React from 'react';
import {
  Car,
  HeartPulse,
  Brain,
  Baby,
  Flame,
  ShieldAlert,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { EmergencyOption } from '../types';

interface EmergencyCardProps {
  option: EmergencyOption;
  isSelected: boolean;
  onSelect: (option: EmergencyOption) => void;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  option,
  isSelected,
  onSelect
}) => {
  const getIcon = () => {
    switch (option.iconName) {
      case 'Car':
        return <Car className="w-6 h-6" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6" />;
      case 'Brain':
        return <Brain className="w-6 h-6" />;
      case 'Baby':
        return <Baby className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      default:
        return <ShieldAlert className="w-6 h-6" />;
    }
  };

  return (
    <div
      id={`emergency-card-${option.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(option)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(option);
        }
      }}
      aria-pressed={isSelected}
      className={`group relative text-left rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-rose-50/60 border-rose-500 ring-4 ring-rose-500/10 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`p-3 rounded-xl transition-colors ${
              isSelected
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'
            }`}
          >
            {getIcon()}
          </div>
          {isSelected && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-900 transition-colors mb-1.5">
          {option.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {option.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Required Healthcare Services:
        </span>
        <div className="flex flex-wrap gap-1">
          {option.requiredServices.map((srv) => (
            <span
              key={srv}
              className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                isSelected
                  ? 'bg-rose-100 text-rose-900'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {srv}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
