import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  PhoneCall,
  Send,
  Sparkles,
  Tag
} from 'lucide-react';

const DEFAULT_STAFF = [
  "Selamawit Tadesse (Master Buna Hostess)",
  "Captain Abebe Kebede (Chief Marine Navigator)",
  "Chef Dawit Worku (Executive Chef)",
  "Nurse Tigist Haile (Chief Medical Officer)",
  "Kassahun Berhanu (Lead Systems & Engineering)",
  "Mulugeta Desta (Watersports & Kayak Ranger)",
  "Almaz Tefera (Executive Housekeeper)",
  "Yohannes Girma (Chief Concierge)",
  "Solomon Wolde (Lakefront Security)",
  "Hiwot Assefa (Zoma Spa Director)",
  "Fikadu Lemma (Ornithology Ranger)",
  "Genet Alemu (In-Villa Dining Attendant)"
];

export default function RequestDetailsModal({
  request,
  onClose,
  onUpdateStatus,
  onUpdateStaff,
  onAddNote,
  staffList = []
}) {
  if (!request) return null;

  const [selectedStaff, setSelectedStaff] = useState(request.assignedTo || 'Unassigned');
  const [internalNote, setInternalNote] = useState('');

  const staffOptions = staffList.length > 0
    ? staffList.map(s => `${s.name} (${s.role.split('&')[0].trim()})`)
    : DEFAULT_STAFF;

  const handleStaffChange = (e) => {
    const val = e.target.value;
    setSelectedStaff(val);
    onUpdateStaff(request.id, val);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!internalNote.trim()) return;
    onAddNote(request.id, internalNote.trim());
    setInternalNote('');
  };

  const isUrgent = request.priority === 'Urgent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-sand-50 dark:bg-slate-900 rounded-3xl shadow-2xl border border-sand-300 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          isUrgent ? 'bg-gradient-to-r from-red-700 to-red-900' : 'bg-teal-950'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-900/80 border border-teal-700/60 flex items-center justify-center">
              {isUrgent ? <ShieldAlert className="w-6 h-6 text-red-300 animate-pulse" /> : <Tag className="w-5 h-5 text-sand-300" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded font-bold">
                  {request.id}
                </span>
                <span className="text-xs uppercase font-bold text-sand-300 tracking-wider">
                  {request.department}
                </span>
              </div>
              <h2 className="font-serif text-lg font-bold text-sand-100 mt-0.5">
                {request.serviceTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-sand-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Guest and Villa Meta */}
          <div className="grid grid-cols-2 gap-2 bg-teal-900/10 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-teal-800/20 dark:border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Destination
              </span>
              <span className="font-bold text-sm text-slate-800 dark:text-sand-100 block">
                {request.room}
              </span>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                Guest: {request.guestName}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Placed
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                {request.timeRequested}
              </span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 ${
                request.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : request.status === 'In Progress'
                  ? 'bg-teal-700 text-white'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {request.status}
              </span>
            </div>
          </div>

          {/* Request Details & Custom Preferences */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-sand-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Guest Specifications & Selections
            </span>
            <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
              {request.details}
            </p>
          </div>

          {/* Staff Assignment Section */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-sand-200 dark:border-slate-700 space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Assign Ethiopian Hospitality Staff
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={selectedStaff}
                onChange={handleStaffChange}
                className="flex-1 p-2 text-xs rounded-xl border border-sand-300 dark:border-slate-700 bg-sand-50 dark:bg-slate-900 text-slate-800 dark:text-sand-100 font-semibold"
              >
                <option value="Unassigned">-- Unassigned --</option>
                {staffOptions.map((staff, idx) => (
                  <option key={idx} value={staff}>
                    {staff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Internal Staff Notes Log */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-sand-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Internal Dispatch Log / Notes
            </span>
            {request.notes ? (
              <div className="p-2.5 rounded-xl bg-sand-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs border border-sand-200 dark:border-slate-700/60 leading-relaxed">
                {request.notes}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No notes logged yet.</p>
            )}

            {/* Append note form */}
            <form onSubmit={handleAddNote} className="flex items-center space-x-1.5 pt-1">
              <input
                type="text"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Log internal note (e.g. Catamaran fueled; table prepped)..."
                className="flex-1 p-2 text-xs rounded-xl border border-sand-300 dark:border-slate-700 bg-sand-50 dark:bg-slate-900 text-slate-800 dark:text-sand-100"
              />
              <button
                type="submit"
                className="p-2 bg-teal-800 hover:bg-teal-700 text-white rounded-xl transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Operational Workflow Action Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            {request.status !== 'In Progress' && (
              <button
                onClick={() => {
                  onUpdateStatus(request.id, 'In Progress', selectedStaff !== 'Unassigned' ? selectedStaff : 'Resort Staff');
                  onClose();
                }}
                className="py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Dispatch / In Progress</span>
              </button>
            )}

            {request.status !== 'Completed' && (
              <button
                onClick={() => {
                  onUpdateStatus(request.id, 'Completed');
                  onClose();
                }}
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Fulfilled</span>
              </button>
            )}

            {request.status === 'Completed' && (
              <button
                onClick={() => {
                  onUpdateStatus(request.id, 'Pending');
                  onClose();
                }}
                className="col-span-2 py-2 px-3 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-sand-300 rounded-xl font-semibold"
              >
                Reopen Ticket
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
