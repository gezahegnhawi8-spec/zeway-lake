import React from 'react';
import { 
  Coffee, 
  Compass, 
  Feather, 
  Waves, 
  Sparkles, 
  Utensils, 
  BellRing, 
  Sparkle, 
  Wrench, 
  Briefcase, 
  ShieldAlert,
  ChevronRight,
  Clock
} from 'lucide-react';

const iconMap = {
  Coffee,
  Compass,
  Feather,
  Waves,
  Sparkles,
  Utensils,
  BellRing,
  Sparkle,
  Wrench,
  Briefcase,
  ShieldAlert,
};

export default function ServiceCard({ service, onSelect }) {
  const IconComponent = iconMap[service.icon] || Sparkles;
  const isLakeSpecific = service.category === "Lake Ziway Signature";
  const isEmergency = service.isEmergency;

  return (
    <div
      onClick={() => onSelect(service)}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
        isEmergency
          ? 'bg-gradient-to-br from-red-950/80 via-red-900/40 to-slate-900 border-2 border-red-600/80 hover:border-red-500 shadow-red-950/40'
          : isLakeSpecific
          ? 'bg-gradient-to-br from-teal-900/95 via-teal-950 to-teal-900 border border-teal-700/60 hover:border-sand-400/80 shadow-md'
          : 'bg-sand-50/95 dark:bg-slate-900 border border-sand-200/90 dark:border-slate-800 hover:border-teal-600/60 shadow-sm'
      }`}
    >
      {/* Visual Accent Top Bar */}
      <div className={`h-1.5 w-full ${
        isEmergency 
          ? 'bg-red-500 animate-pulse' 
          : isLakeSpecific 
          ? 'bg-gradient-to-r from-sand-400 via-teal-400 to-amber-500' 
          : 'bg-teal-700/60'
      }`} />

      {/* Image Banner Header with gradient overlay */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/50 to-transparent" />

        {/* Badge tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-md ${
            isEmergency
              ? 'bg-red-600 text-white font-extrabold animate-pulse'
              : isLakeSpecific
              ? 'bg-sand-400 text-teal-950 font-bold'
              : 'bg-teal-950/80 text-sand-200 border border-teal-700/70'
          }`}>
            {service.badge}
          </span>
        </div>

        {/* Floating Icon */}
        <div className="absolute bottom-2.5 left-3 flex items-center space-x-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md ${
            isEmergency
              ? 'bg-red-600 text-white'
              : isLakeSpecific
              ? 'bg-teal-800/90 border border-sand-400/50 text-sand-300'
              : 'bg-teal-900/90 border border-teal-700 text-teal-200'
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-sand-300/90 font-medium block">
              {service.department}
            </span>
            <span className="text-xs text-sand-400/90 font-serif italic block -mt-0.5">
              {service.amharicTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <h3 className={`text-base sm:text-lg font-serif font-bold tracking-tight line-clamp-1 ${
            isEmergency
              ? 'text-red-200'
              : isLakeSpecific
              ? 'text-sand-100 group-hover:text-sand-300'
              : 'text-slate-900 dark:text-sand-100 group-hover:text-teal-700'
          }`}>
            {service.title}
          </h3>
          <ChevronRight className="w-4 h-4 text-sand-400 group-hover:translate-x-1 transition-transform shrink-0 ml-1 mt-1" />
        </div>

        <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
          isLakeSpecific || isEmergency ? 'text-teal-200/80' : 'text-slate-600 dark:text-slate-400'
        }`}>
          {service.tagline}
        </p>

        {/* Options preview chips */}
        <div className="mt-3.5 pt-3 border-t border-teal-800/40 dark:border-slate-800 flex flex-wrap gap-1.5">
          {service.options.slice(0, 2).map((opt) => (
            <span
              key={opt.id}
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium truncate max-w-[180px] ${
                isLakeSpecific
                  ? 'bg-teal-950/80 text-sand-200 border border-teal-800/80'
                  : 'bg-sand-100 dark:bg-slate-800 text-slate-700 dark:text-sand-200 border border-sand-200 dark:border-slate-700'
              }`}
            >
              • {opt.label.split('(')[0]}
            </span>
          ))}
          {service.options.length > 2 && (
            <span className="text-[10px] text-sand-400 font-semibold self-center">
              +{service.options.length - 2} more
            </span>
          )}
        </div>

        {/* CTA Footer */}
        <div className="mt-3 flex items-center justify-between text-xs pt-1">
          <span className={`font-semibold text-[11px] ${
            isEmergency ? 'text-red-300' : 'text-sand-400'
          }`}>
            {isEmergency ? 'Dispatch Immediately' : 'Customize & Request'}
          </span>
          <span className={`text-[11px] font-bold ${
            isEmergency ? 'text-red-400' : 'text-teal-400 group-hover:text-sand-300'
          }`}>
            Touch to Open →
          </span>
        </div>
      </div>
    </div>
  );
}

