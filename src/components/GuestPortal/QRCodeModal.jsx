import React from 'react';
import { X, QrCode, Sparkles, Check, ExternalLink, Printer } from 'lucide-react';

export default function QRCodeModal({
  isOpen,
  onClose,
  currentRoom,
  rooms,
  onSelectRoom,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-sand-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-sand-300 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 bg-teal-950 text-sand-50 flex items-center justify-between border-b border-teal-800 tibeb-border-top">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sand-500/30 flex items-center justify-center text-sand-300">
              <QrCode className="w-5 h-5 text-sand-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-sand-100">
                In-Villa QR Keycard & Scanner
              </h2>
              <p className="text-[11px] text-teal-300">
                Guests scan this acrylic stand in their villa to open the portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-teal-900 text-sand-300 hover:text-white flex items-center justify-center border border-teal-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic Luxury QR Card Display */}
        <div className="p-6">
          <div className="relative mx-auto max-w-xs bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 p-6 rounded-2xl border-2 border-sand-400/70 shadow-2xl text-center text-sand-100">
            {/* Top Logo */}
            <div className="text-[10px] uppercase font-bold tracking-widest text-sand-400 mb-1">
              DAMBAL LAKESIDE RESORT & SPA
            </div>
            <div className="text-xs font-serif text-sand-200">
              Lake Ziway • Great Rift Valley
            </div>
            <div className="tibeb-accent-bar w-24 mx-auto my-3" />

            {/* Stylized QR Code Graphic */}
            <div className="bg-white p-4 rounded-xl shadow-inner mx-auto w-44 h-44 flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-teal-950">
                {/* 3 Corner Eyes */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="#0a343b" strokeWidth="6" />
                <rect x="12" y="12" width="14" height="14" rx="2" fill="#0a343b" />
                
                <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="#0a343b" strokeWidth="6" />
                <rect x="74" y="12" width="14" height="14" rx="2" fill="#0a343b" />

                <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="#0a343b" strokeWidth="6" />
                <rect x="12" y="74" width="14" height="14" rx="2" fill="#0a343b" />

                {/* Data Matrix Dots */}
                <rect x="38" y="10" width="8" height="8" fill="#157583" />
                <rect x="50" y="10" width="8" height="8" fill="#c07228" />
                <rect x="42" y="24" width="8" height="8" fill="#0a343b" />
                <rect x="10" y="42" width="8" height="8" fill="#157583" />
                <rect x="22" y="46" width="8" height="8" fill="#0a343b" />
                <rect x="36" y="40" width="10" height="10" fill="#0a343b" />
                <rect x="54" y="42" width="8" height="8" fill="#c07228" />
                <rect x="68" y="42" width="8" height="8" fill="#157583" />
                <rect x="82" y="46" width="8" height="8" fill="#0a343b" />
                <rect x="40" y="56" width="8" height="8" fill="#157583" />
                <rect x="52" y="56" width="8" height="8" fill="#0a343b" />
                <rect x="38" y="72" width="8" height="8" fill="#0a343b" />
                <rect x="50" y="72" width="8" height="8" fill="#157583" />
                <rect x="68" y="70" width="8" height="8" fill="#0a343b" />
                <rect x="80" y="80" width="10" height="10" fill="#c07228" />

                {/* Center Badge Icon */}
                <circle cx="50" cy="50" r="13" fill="#ffffff" />
                <circle cx="50" cy="50" r="10" fill="#0a343b" />
                <path d="M45 52 L50 45 L55 52 Z" fill="#cfb17d" />
              </svg>
            </div>

            {/* Room Designation */}
            <div className="mt-4">
              <span className="text-[10px] tracking-widest text-teal-300 uppercase block font-semibold">
                Villa QR Access
              </span>
              <h3 className="font-serif text-base font-bold text-sand-100">
                {currentRoom.name}
              </h3>
              <p className="text-[11px] text-sand-300/80">
                Registered to: {currentRoom.guest}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-teal-800 text-[10px] text-teal-300">
              Point phone camera here to order coffee ceremonies, lake boat tours, dining, & room service.
            </div>
          </div>

          {/* Quick Room Switcher Tabs for Demo Testing */}
          <div className="mt-6">
            <label className="text-xs font-bold text-slate-700 dark:text-sand-200 uppercase tracking-wider block mb-2">
              Switch Room / Villa for Simulation:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rooms.map((r) => {
                const isActive = r.id === currentRoom.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectRoom(r);
                      onClose();
                    }}
                    className={`p-2.5 rounded-xl text-left border transition text-xs flex items-center justify-between ${
                      isActive
                        ? 'bg-teal-700 text-white border-teal-800 font-bold shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-500'
                    }`}
                  >
                    <div>
                      <span className="block font-medium truncate">{r.name}</span>
                      <span className="text-[10px] opacity-75">{r.guest}</span>
                    </div>
                    {isActive && <Check className="w-4 h-4 ml-1 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

