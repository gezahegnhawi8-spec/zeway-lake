import React, { useState } from 'react';
import { X, ShieldAlert, PhoneCall, AlertTriangle, HeartPulse, LifeBuoy, MapPin } from 'lucide-react';

export default function EmergencyModal({
  isOpen,
  onClose,
  currentRoom,
  onTriggerEmergency,
}) {
  if (!isOpen) return null;

  const [selectedType, setSelectedType] = useState('Medical Assistance');
  const [extraNote, setExtraNote] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const emergencyOptions = [
    {
      id: 'medical',
      label: 'Medical Assistance / Doctor',
      desc: 'On-call nurse, doctor, first aid kit, oxygen or allergy care',
      icon: HeartPulse,
      color: 'text-red-500',
    },
    {
      id: 'water_rescue',
      label: 'Lakeside / Pier Rescue',
      desc: 'Lifeguard dispatch to dock, boat slip or swimming area',
      icon: LifeBuoy,
      color: 'text-amber-500',
    },
    {
      id: 'security',
      label: 'Security & Safety Escort',
      desc: 'Immediate uniformed security response to your villa',
      icon: ShieldAlert,
      color: 'text-blue-500',
    },
    {
      id: 'urgent_facility',
      label: 'Fire / Hazard / Utility Hazard',
      desc: 'Urgent engineering and fire safety intervention',
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
  ];

  const handleDispatch = () => {
    setDispatched(true);

    const emergencyRequest = {
      id: `EMG-${Math.floor(100 + Math.random() * 900)}`,
      room: currentRoom.name,
      guestName: currentRoom.guest,
      serviceId: 'emergency',
      serviceTitle: `URGENT: ${selectedType}`,
      department: 'Emergency Services',
      details: `${selectedType} requested at ${currentRoom.name}. Notes: "${extraNote || 'Urgent guest dispatch'}"`,
      timeRequested: 'Just now',
      timestamp: Date.now(),
      status: 'Pending',
      priority: 'Urgent',
      assignedTo: 'Resort Emergency Team',
      notes: 'AUTOMATIC HIGH PRIORITY SIREN DISPATCHED',
    };

    onTriggerEmergency(emergencyRequest);

    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Red Alert Header */}
        <div className="p-5 bg-gradient-to-r from-red-700 to-red-850 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-900/80 border border-white/40 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider font-serif">
                Resort Emergency Dispatch
              </h2>
              <p className="text-xs text-red-200">
                Priority 1 Direct Line • Lake Ziway Safety
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-900/60 hover:bg-red-900 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room confirmation */}
        <div className="bg-red-50 dark:bg-red-950/40 p-3 border-b border-red-200 dark:border-red-900 flex items-center justify-between text-xs text-red-900 dark:text-red-200">
          <div className="flex items-center space-x-1.5 font-bold">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>Target Location: {currentRoom.name}</span>
          </div>
          <span className="font-mono">{currentRoom.guest}</span>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          <p className="text-xs font-bold text-slate-700 dark:text-sand-200 uppercase tracking-wider">
            Select Nature of Emergency:
          </p>

          <div className="space-y-2">
            {emergencyOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = selectedType === opt.label;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedType(opt.label)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 ${
                    isSelected
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/60 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                  }`}
                >
                  <IconComp className={`w-5 h-5 shrink-0 mt-0.5 ${opt.color}`} />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-sand-100">
                      {opt.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border mt-1 flex items-center justify-center ${
                    isSelected ? 'border-red-600 bg-red-600' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-sand-200 block mb-1">
              Immediate Symptom or Urgency Detail (Optional)
            </label>
            <input
              type="text"
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
              placeholder="e.g. Chest tightness, fell near dock, allergic reaction..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-sand-100"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleDispatch}
              disabled={dispatched}
              className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-lg uppercase flex items-center justify-center space-x-2 animate-pulse"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{dispatched ? 'Dispatching Emergency Unit...' : 'Dispatch Immediate Help'}</span>
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-2">
              Resort staff will receive high-priority alarm notification instantly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

