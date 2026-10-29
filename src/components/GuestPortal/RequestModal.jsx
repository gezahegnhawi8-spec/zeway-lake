import React, { useState } from 'react';
import { X, Clock, MapPin, Check, Sparkles, Send, Coffee, Compass, Feather, Waves, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RequestModal({
  service,
  currentRoom,
  onClose,
  onSubmitRequest,
}) {
  if (!service) return null;

  // Selected primary option
  const [selectedOption, setSelectedOption] = useState(service.options[0]?.id || '');
  
  // Customization states
  const [selectedRoast, setSelectedRoast] = useState(service.roastLevels?.[0] || '');
  const [selectedGuide, setSelectedGuide] = useState(service.guides?.[0] || '');
  const [selectedVessel, setSelectedVessel] = useState(service.vesselTypes?.[0] || '');
  const [selectedSides, setSelectedSides] = useState(service.sides ? [service.sides[0], service.sides[1]] : []);
  const [scheduleTime, setScheduleTime] = useState('Immediate (within 15-20 mins)');
  const [guestNotes, setGuestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSide = (side) => {
    if (selectedSides.includes(side)) {
      setSelectedSides(selectedSides.filter(s => s !== side));
    } else {
      setSelectedSides([...selectedSides, side]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const activeOptionObj = service.options.find(o => o.id === selectedOption) || service.options[0];

    // Build comprehensive description details
    const detailParts = [];
    if (activeOptionObj) detailParts.push(activeOptionObj.label);
    if (selectedRoast) detailParts.push(`Roast: ${selectedRoast}`);
    if (selectedSides.length > 0) detailParts.push(`Sides/Pairings: ${selectedSides.join(', ')}`);
    if (selectedVessel) detailParts.push(`Vessel: ${selectedVessel}`);
    if (selectedGuide) detailParts.push(`Guide: ${selectedGuide}`);
    if (scheduleTime) detailParts.push(`Timing: ${scheduleTime}`);
    if (guestNotes.trim()) detailParts.push(`Note: "${guestNotes.trim()}"`);

    const newRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      room: currentRoom.name,
      guestName: currentRoom.guest,
      serviceId: service.id,
      serviceTitle: service.title,
      department: service.department,
      details: detailParts.join(' • '),
      timeRequested: 'Just now',
      timestamp: Date.now(),
      status: 'Pending',
      priority: service.isEmergency ? 'Urgent' : 'Normal',
      assignedTo: 'Unassigned',
      notes: guestNotes.trim() || 'Awaiting staff acknowledgement.',
    };

    setTimeout(() => {
      // Trigger luxury confetti burst
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#cfb17d', '#157583', '#0a343b', '#e1cea9'],
        });
      } catch (err) {
        // Safe fallback
      }

      onSubmitRequest(newRequest);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const isLakeSpecific = service.category === "Lake Ziway Signature";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-teal-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-sand-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-sand-300 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header Image & Bar */}
        <div className="relative h-32 sm:h-36 w-full">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-teal-950/80 text-sand-200 hover:text-white flex items-center justify-center border border-teal-700/60 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-sand-300 px-2 py-0.5 rounded bg-teal-900/80 border border-teal-700 inline-block mb-1">
              {service.department}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-sand-100">
              {service.title}
            </h2>
            <p className="text-xs text-sand-300 font-serif italic">
              {service.amharicTitle}
            </p>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Destination Villa Confirmation */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-teal-900/10 border border-teal-800/20 text-xs">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">Service Destination</span>
                <span className="font-bold text-slate-800 dark:text-sand-100">{currentRoom.name}</span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              {currentRoom.guest.split(' ')[0]}
            </span>
          </div>

          {/* Service Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {service.description}
          </p>

          {/* Option Selector (Radios) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-sand-200 block">
              Choose Service Package / Option
            </label>
            <div className="grid grid-cols-1 gap-2">
              {service.options.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedOption === opt.id
                      ? 'bg-teal-50 dark:bg-teal-900/40 border-teal-600 text-teal-950 dark:text-sand-100 font-semibold shadow-sm'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedOption === opt.id ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                    }`}>
                      {selectedOption === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span>{opt.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-teal-700 dark:text-sand-300 block">{opt.price}</span>
                    <span className="text-[10px] text-slate-400 block">{opt.prepTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ethiopian Coffee Ceremony Specifics */}
          {service.id === 'traditional-coffee' && (
            <div className="p-3.5 rounded-xl bg-sand-100/70 dark:bg-slate-800/60 border border-sand-300 dark:border-slate-700 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-sand-200 block mb-1">
                  Bean Roast Selection
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {service.roastLevels.map((roast) => (
                    <button
                      key={roast}
                      type="button"
                      onClick={() => setSelectedRoast(roast)}
                      className={`text-[11px] p-2 rounded-lg text-left transition border ${
                        selectedRoast === roast
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-600 text-amber-950 dark:text-amber-200 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {roast}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-sand-200 block mb-1">
                  Complimentary Accompaniments (Include)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {service.sides.map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => toggleSide(side)}
                      className={`text-[11px] p-2 rounded-lg flex items-center justify-between transition border ${
                        selectedSides.includes(side)
                          ? 'bg-teal-100 dark:bg-teal-950/60 border-teal-600 text-teal-900 dark:text-teal-200 font-semibold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <span className="truncate">{side}</span>
                      {selectedSides.includes(side) && <Check className="w-3.5 h-3.5 text-teal-700 ml-1 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Lake Tour Boat & Guide Specifics */}
          {service.id === 'lake-tour' && (
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-slate-800/60 border border-teal-200 dark:border-slate-700 space-y-3">
              <div>
                <label className="text-xs font-bold text-teal-950 dark:text-sand-200 block mb-1">
                  Preferred Vessel
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {service.vesselTypes.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVessel(v)}
                      className={`text-[11px] p-2 rounded-lg text-center transition border ${
                        selectedVessel === v
                          ? 'bg-teal-700 text-white font-bold border-teal-800'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {v.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-teal-950 dark:text-sand-200 block mb-1">
                  Guide Language
                </label>
                <select
                  value={selectedGuide}
                  onChange={(e) => setSelectedGuide(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-sand-100"
                >
                  {service.guides.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Scheduling / Timing */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-sand-200 block mb-1">
              Desired Timing
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                'Immediate (within 15-20 mins)',
                '14:00 (Afternoon)',
                '17:30 (Sunset)',
                'Tomorrow 07:00',
              ].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setScheduleTime(time)}
                  className={`text-[11px] p-2 rounded-lg text-center transition border ${
                    scheduleTime === time
                      ? 'bg-sand-500 text-white font-bold border-sand-600'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {time.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Special Lakeside Instructions */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-sand-200 block mb-1">
              Special Instructions or Location Details
            </label>
            <textarea
              rows={2}
              value={guestNotes}
              onChange={(e) => setGuestNotes(e.target.value)}
              placeholder="e.g. Please set up on the private veranda; extra frankincense; iced water on the side..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-sand-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 ${
                service.isEmergency
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : isLakeSpecific
                  ? 'bg-gradient-to-r from-teal-700 via-teal-800 to-teal-950 hover:from-teal-600 hover:to-teal-800 text-sand-100 shadow-glow-teal'
                  : 'bg-gradient-to-r from-sand-500 to-amber-700 hover:from-sand-400 hover:to-amber-600 text-white'
              }`}
            >
              <Send className="w-4 h-4 text-sand-300" />
              <span>{isSubmitting ? 'Transmitting to Resort Staff...' : 'Send Request to Resort Desk'}</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2">
              Instant notification dispatched to Lake Ziway Staff Dashboard
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}

