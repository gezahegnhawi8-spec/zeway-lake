import React from 'react';
import { 
  Compass, 
  Smartphone, 
  LayoutDashboard, 
  QrCode, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  Key, 
  Maximize2, 
  Minimize2,
  Sparkles,
  Waves
} from 'lucide-react';

export default function Navbar({
  activeView,
  setActiveView,
  isPhoneFrame,
  setIsPhoneFrame,
  currentRoom,
  setCurrentRoom,
  rooms,
  onOpenQR,
  soundEnabled,
  setSoundEnabled,
  onSimulateRequest,
  pendingCount,
  urgentCount,
}) {
  return (
    <header className="sticky top-0 z-40 bg-teal-950/95 backdrop-blur-md border-b border-teal-800/60 text-sand-100 shadow-luxury tibeb-border-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo & Resort Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('guest')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sand-400 via-sand-500 to-amber-700 flex items-center justify-center shadow-glow-sand p-0.5">
              <div className="w-full h-full bg-teal-950 rounded-[10px] flex items-center justify-center">
                <Waves className="w-6 h-6 text-sand-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif tracking-widest text-lg sm:text-xl font-bold text-sand-100 uppercase">
                  DAMBAL
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-teal-800/80 text-sand-300 border border-teal-700">
                  Lake Ziway
                </span>
              </div>
              <p className="text-[11px] text-teal-300/80 font-medium tracking-wider hidden sm:block">
                Luxury Rift Valley Sanctuary • ሐይቅ ዳምባል
              </p>
            </div>
          </div>

          {/* Primary View Switcher: Guest Portal vs Staff Dashboard */}
          <div className="flex items-center bg-teal-900/80 p-1 rounded-xl border border-teal-800/90 shadow-inner">
            <button
              onClick={() => setActiveView('guest')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeView === 'guest'
                  ? 'bg-gradient-to-r from-sand-500 to-sand-600 text-teal-950 shadow-md font-bold'
                  : 'text-sand-200 hover:text-white hover:bg-teal-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Guest Portal</span>
            </button>

            <button
              onClick={() => setActiveView('staff')}
              className={`relative flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeView === 'staff'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md font-bold'
                  : 'text-sand-200 hover:text-white hover:bg-teal-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Staff Desk</span>
              {pendingCount > 0 && (
                <span className={`inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold rounded-full ${
                  urgentCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-sand-400 text-teal-950'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Utility Tools */}
          <div className="flex items-center space-x-2">
            
            {/* Room Selector (Visible in Guest View) */}
            {activeView === 'guest' && (
              <div className="hidden md:flex items-center space-x-1.5 bg-teal-900/60 border border-teal-800 px-2.5 py-1.5 rounded-lg text-xs">
                <Key className="w-3.5 h-3.5 text-sand-400" />
                <select
                  value={currentRoom.id}
                  onChange={(e) => {
                    const found = rooms.find(r => r.id === e.target.value);
                    if (found) setCurrentRoom(found);
                  }}
                  className="bg-transparent text-sand-100 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id} className="bg-teal-950 text-sand-100">
                      {room.name} ({room.guest.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Mobile View Toggle (Phone Frame vs Full Screen) */}
            {activeView === 'guest' && (
              <button
                onClick={() => setIsPhoneFrame(!isPhoneFrame)}
                title={isPhoneFrame ? "Switch to Full Screen View" : "Switch to Mobile Device Frame"}
                className="hidden lg:flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded-lg bg-teal-900/70 hover:bg-teal-800 text-sand-200 border border-teal-800/80 transition"
              >
                {isPhoneFrame ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-sand-300" />
                    <span>Full View</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-sand-300" />
                    <span>Phone Frame</span>
                  </>
                )}
              </button>
            )}

            {/* QR Code Scanner / Card Button */}
            <button
              onClick={onOpenQR}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-sand-500/20 hover:bg-sand-500/30 text-sand-200 border border-sand-500/40 rounded-lg text-xs transition font-medium"
              title="View Villa QR Codes to test guest mobile scanning"
            >
              <QrCode className="w-3.5 h-3.5 text-sand-400" />
              <span className="hidden sm:inline">QR Scan</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute notification bells" : "Enable notification bells"}
              className="p-1.5 text-teal-300 hover:text-white hover:bg-teal-800/60 rounded-lg transition"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-sand-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-teal-500" />
              )}
            </button>

            {/* Quick Demo Simulator Button */}
            <button
              onClick={onSimulateRequest}
              title="Simulate a real-time incoming guest request"
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition border border-teal-600/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-sand-300 animate-spin" />
              <span>Simulate Guest</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

