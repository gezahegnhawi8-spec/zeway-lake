import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Check, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ArrowRight, 
  Coffee, 
  Compass, 
  Feather, 
  Waves, 
  Sparkles, 
  Utensils, 
  ShieldAlert, 
  Eye, 
  ChevronRight,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

export default function RequestTable({
  requests,
  onStatusChange,
  onSelectRequest,
  onAssignStaff,
  rooms = [],
}) {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('ALL');
  const [selectedWingFilter, setSelectedWingFilter] = useState('ALL');

  const departments = [
    { id: 'ALL', label: 'All Departments' },
    { id: 'Lake Ziway Signature', label: 'Lake Ziway Tours & Coffee' },
    { id: 'Culinary & Dining', label: 'Culinary & In-Villa Dining' },
    { id: 'Housekeeping', label: 'Housekeeping' },
    { id: 'Spa & Wellness', label: 'Lakeside Spa' },
    { id: 'Engineering', label: 'Engineering' },
    { id: 'Emergency Services', label: 'Emergency / SOS' },
  ];

  const statuses = ['ALL', 'Pending', 'In Progress', 'Completed'];

  const wings = [
    { id: 'ALL', label: 'All Wings' },
    { id: 'Pelican Shore', label: 'Pelican Shore (Waterfront Villas)' },
    { id: 'Debre Sina Wing', label: 'Debre Sina Wing (Suites)' },
    { id: 'Tulu Gudo Garden', label: 'Tulu Gudo Garden (Eco Lodges)' },
    { id: 'Heron Bay', label: 'Heron Bay (Deluxe Chalets)' },
  ];

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    // Dept match
    const deptMatch =
      selectedDept === 'ALL'
        ? true
        : selectedDept === 'Lake Ziway Signature'
        ? ['traditional-coffee', 'lake-tour', 'bird-watching', 'water-sports'].includes(req.serviceId)
        : req.department === selectedDept;

    // Status match
    const statusMatch = selectedStatus === 'ALL' ? true : req.status === selectedStatus;

    // Room match
    const roomMatch = selectedRoomFilter === 'ALL' ? true : req.room.toLowerCase().includes(selectedRoomFilter.toLowerCase());

    // Search query match
    const query = searchQuery.toLowerCase();
    const queryMatch =
      !query ||
      req.id.toLowerCase().includes(query) ||
      req.room.toLowerCase().includes(query) ||
      req.guestName.toLowerCase().includes(query) ||
      req.serviceTitle.toLowerCase().includes(query) ||
      (req.details && req.details.toLowerCase().includes(query));

    return deptMatch && statusMatch && roomMatch && queryMatch;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-sand-200/90 dark:border-slate-800 shadow-luxury overflow-hidden">
      
      {/* Control Toolbar */}
      <div className="p-4 sm:p-5 border-b border-sand-200 dark:border-slate-800 bg-sand-50/70 dark:bg-slate-900/60 space-y-3">
        
        {/* Top line: Search and Room Filter across 50 rooms */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, room, guest name, Ethiopian service..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-sand-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
              Villa / Suite Filter:
            </span>
            <select
              value={selectedRoomFilter}
              onChange={(e) => setSelectedRoomFilter(e.target.value)}
              className="p-2 text-xs rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-sand-100 max-w-[220px]"
            >
              <option value="ALL">All 50 Lake Villas & Suites</option>
              {rooms.length > 0 ? (
                rooms.map((r) => (
                  <option key={r.id} value={r.number || r.name}>
                    {r.name} ({r.guest.split(' ')[0]})
                  </option>
                ))
              ) : (
                <>
                  <option value="101">Villa 101 - Pelican Sanctuary</option>
                  <option value="104">Villa 104 - Debre Sina Haven</option>
                  <option value="203">Suite 203 - Monastic Heritage</option>
                  <option value="305">Lodge 305 - Acacia Whispers</option>
                  <option value="410">Chalet 410 - Heron Bay Grand</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {departments.map((dept) => {
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition font-semibold ${
                  isSelected
                    ? 'bg-teal-800 text-sand-100 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-sand-200 dark:border-slate-700 hover:border-teal-500'
                }`}
              >
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* Status Filter Sub-Bar */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedStatus === status
                    ? 'bg-sand-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-sand-200/50 dark:hover:bg-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-teal-800 dark:text-teal-400">{filteredRequests.length}</strong> of {requests.length} requests
          </span>
        </div>

      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sand-100/70 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-sand-300 border-b border-sand-200 dark:border-slate-800">
              <th className="py-3 px-4">Ticket & Villa</th>
              <th className="py-3 px-4">Service & Amharic</th>
              <th className="py-3 px-4">Custom Details</th>
              <th className="py-3 px-4">Requested</th>
              <th className="py-3 px-4">Assigned Staff</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200 dark:divide-slate-800 text-xs">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-teal-600 mb-2" />
                    <p className="font-serif text-sm font-semibold text-slate-700 dark:text-sand-200">
                      No matching requests in this view
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Submissions from guests will appear here instantly via Socket.io.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const isUrgent = req.priority === 'Urgent';
                const isPending = req.status === 'Pending';
                const isInProgress = req.status === 'In Progress';
                const isCompleted = req.status === 'Completed';

                return (
                  <tr
                    key={req.id}
                    className={`hover:bg-sand-50/90 dark:hover:bg-slate-800/50 transition cursor-pointer ${
                      isUrgent ? 'bg-red-50/60 dark:bg-red-950/20' : ''
                    }`}
                    onClick={() => onSelectRequest(req)}
                  >
                    {/* Ticket & Villa */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {isUrgent && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                        )}
                        <div>
                          <span className="font-mono font-bold text-slate-900 dark:text-sand-100 block">
                            {req.id}
                          </span>
                          <span className="font-semibold text-teal-800 dark:text-teal-400 block text-[11px]">
                            {req.room}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {req.guestName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Service Title */}
                    <td className="py-3.5 px-4">
                      <div className="max-w-[200px]">
                        <span className="font-serif font-bold text-slate-900 dark:text-sand-100 block truncate">
                          {req.serviceTitle}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-sand-600 dark:text-sand-400 block">
                          {req.department}
                        </span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-xs leading-relaxed">
                        {req.details}
                      </p>
                    </td>

                    {/* Requested Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-sand-500" />
                        <span>{req.timeRequested}</span>
                      </div>
                    </td>

                    {/* Assigned Staff */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                        req.assignedTo === 'Unassigned'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      }`}>
                        <UserCheck className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">{req.assignedTo}</span>
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                          isUrgent
                            ? 'bg-red-600 text-white font-extrabold animate-pulse'
                            : isPending
                            ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                            : isInProgress
                            ? 'bg-teal-700 text-white shadow-sm'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* Operational Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {isPending && (
                          <button
                            onClick={() => onStatusChange(req.id, 'In Progress', 'Resort Staff')}
                            className="px-2.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                            title="Accept request and dispatch staff"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        )}

                        {isInProgress && (
                          <button
                            onClick={() => onStatusChange(req.id, 'Completed')}
                            className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                            title="Mark service completed"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </button>
                        )}

                        {isCompleted && (
                          <button
                            onClick={() => onStatusChange(req.id, 'In Progress')}
                            className="px-2 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-sand-300 text-[11px]"
                            title="Re-open request"
                          >
                            Re-open
                          </button>
                        )}

                        <button
                          onClick={() => onSelectRequest(req)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 dark:hover:text-sand-200 rounded-lg transition"
                          title="View complete ticket & guest profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-sand-200 dark:divide-slate-800">
        {filteredRequests.map((req) => {
          const isUrgent = req.priority === 'Urgent';
          const isPending = req.status === 'Pending';
          const isInProgress = req.status === 'In Progress';
          const isCompleted = req.status === 'Completed';

          return (
            <div
              key={req.id}
              className={`p-4 space-y-2.5 ${isUrgent ? 'bg-red-50/70 dark:bg-red-950/30' : ''}`}
              onClick={() => onSelectRequest(req)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono font-bold text-xs text-slate-700 dark:text-sand-300">
                    {req.id}
                  </span>
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-400">
                    • {req.room}
                  </span>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    isUrgent
                      ? 'bg-red-600 text-white animate-pulse'
                      : isPending
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                      : isInProgress
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-sand-100">
                {req.serviceTitle}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {req.details}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                <span>Staff: <strong>{req.assignedTo}</strong></span>
                <span>{req.timeRequested}</span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                {isPending && (
                  <button
                    onClick={() => onStatusChange(req.id, 'In Progress', 'Resort Staff')}
                    className="flex-1 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Accept & Dispatch</span>
                  </button>
                )}
                {isInProgress && (
                  <button
                    onClick={() => onStatusChange(req.id, 'Completed')}
                    className="flex-1 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </button>
                )}
                <button
                  onClick={() => onSelectRequest(req)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-sand-200 rounded-xl text-xs font-semibold"
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
