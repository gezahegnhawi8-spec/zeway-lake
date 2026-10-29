import React from 'react';
import { Sun, Wind, Waves, BellRing, ShieldAlert, Sparkles, Clock, QrCode } from 'lucide-react';
import { RESORT_INFO } from '../../data/mockData';

export default function GuestHeader({
  currentRoom,
  activeRequestsCount,
  onOpenActiveRequests,
  onOpenEmergency,
  onOpenQR
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-teal-800 text-sand-50 rounded-b-3xl sm:rounded-3xl shadow-luxury border-b border-teal-700/60 p-5 sm:p-7">
      
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="#cfb17d" strokeWidth="2" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="#cfb17d" strokeWidth="2" />
        </svg>
      </div>

      {/* Top Meta: Room Badge & QR Badge */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sand-500/20 border border-sand-400/40 text-sand-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{currentRoom.name}</span>
          </span>
          <span className="hidden sm:inline text-xs text-sand-300/70 font-serif italic">
            {currentRoom.type}
          </span>
        </div>

        <button
          onClick={onOpenQR}
          className="flex items-center space-x-1 text-[11px] text-sand-300 hover:text-white bg-teal-800/80 px-2.5 py-1 rounded-full border border-teal-700/80 transition"
        >
          <QrCode className="w-3.5 h-3.5 text-sand-400" />
          <span>Switch Room</span>
        </button>
      </div>

      {/* Main Greeting */}
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sand-400 text-xs tracking-widest uppercase font-semibold">
            እንኳን ደህና መጡ • Selamta
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-sand-100 tracking-tight">
          Welcome, {currentRoom.guest.split(' ')[0]}
        </h1>
        <p className="text-xs sm:text-sm text-teal-200/90 mt-1 max-w-md">
          Personalized lakeside concierge. Touch any service below to dispatch to our resort team.
        </p>
      </div>

      {/* Lake Ziway Live Conditions Capsule */}
      <div className="relative z-10 mt-5 grid grid-cols-3 gap-2 bg-teal-950/70 backdrop-blur-md rounded-2xl p-3 border border-teal-800/80 text-center">
        <div className="flex flex-col items-center justify-center p-1 border-r border-teal-800/60">
          <div className="flex items-center space-x-1 text-sand-300 text-xs">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-sand-100">{RESORT_INFO.weather.temp}</span>
          </div>
          <span className="text-[10px] text-teal-300/75 mt-0.5">Sunny Breeze</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1 border-r border-teal-800/60">
          <div className="flex items-center space-x-1 text-sand-300 text-xs">
            <Waves className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-sand-100 text-[11px]">Calm Waters</span>
          </div>
          <span className="text-[10px] text-teal-300/75 mt-0.5">Boating Safe</span>
        </div>

        <div className="flex flex-col items-center justify-center p-1">
          <div className="flex items-center space-x-1 text-sand-300 text-xs">
            <Clock className="w-3.5 h-3.5 text-sand-400" />
            <span className="font-semibold text-sand-100 text-[11px]">Sunset 18:15</span>
          </div>
          <span className="text-[10px] text-teal-300/75 mt-0.5">Golden Hour</span>
        </div>
      </div>

      {/* Floating Action Bar: Active Requests & Emergency */}
      <div className="relative z-10 mt-4 flex items-center gap-2">
        {/* Active Requests Tracker Pill */}
        <button
          onClick={onOpenActiveRequests}
          className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition ${
            activeRequestsCount > 0
              ? 'bg-sand-500/20 hover:bg-sand-500/30 border-sand-400/50 text-sand-100 shadow-sm'
              : 'bg-teal-900/60 hover:bg-teal-900/90 border-teal-700/60 text-teal-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BellRing className={`w-4 h-4 ${activeRequestsCount > 0 ? 'text-sand-300 animate-bounce' : 'text-teal-400'}`} />
            <span>
              {activeRequestsCount > 0
                ? `${activeRequestsCount} Active ${activeRequestsCount === 1 ? 'Request' : 'Requests'}`
                : 'No Active Requests'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-sand-300">
            View Live Status →
          </span>
        </button>

        {/* Instant Emergency Button */}
        <button
          onClick={onOpenEmergency}
          className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-200 hover:text-white text-xs font-semibold transition shadow-sm"
          title="Emergency or Urgent Medical Assistance"
        >
          <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="hidden xs:inline">SOS</span>
        </button>
      </div>

    </div>
  );
}

