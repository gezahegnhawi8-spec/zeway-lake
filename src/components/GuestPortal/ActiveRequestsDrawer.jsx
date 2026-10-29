import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, User, MessageSquare, ChevronRight, Bell } from 'lucide-react';

export default function ActiveRequestsDrawer({
  isOpen,
  onClose,
  requests,
  onCancelRequest,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-teal-950/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-sand-50 dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-sand-300 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-5 bg-teal-950 text-sand-50 flex items-center justify-between border-b border-teal-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-sand-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-sand-100">
                Your Service Tracker
              </h2>
              <p className="text-[11px] text-teal-300">
                Live status from Lake Ziway Resort Desk
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

        {/* Request List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {requests.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-sand-200/80 dark:bg-slate-800 mx-auto flex items-center justify-center mb-3 text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-800 dark:text-sand-100">
                No Active Requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Explore our Ethiopian coffee ceremonies, boat tours, dining, and spa services to place an order.
              </p>
            </div>
          ) : (
            requests.map((req) => {
              const isPending = req.status === 'Pending';
              const isInProgress = req.status === 'In Progress';
              const isCompleted = req.status === 'Completed';
              const isUrgent = req.priority === 'Urgent';

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUrgent
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-400'
                      : isInProgress
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 shadow-sm'
                      : isCompleted
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                      : 'bg-white dark:bg-slate-800/90 border-sand-300 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {/* Top Bar: ID, Time & Status Pill */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      {req.id}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        isUrgent
                          ? 'bg-red-600 text-white animate-pulse'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                          : isInProgress
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-sand-100">
                    {req.serviceTitle}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {req.details}
                  </p>

                  {/* Stepper Progress Bar */}
                  <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-slate-700/80">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1.5">
                      <span className={isPending || isInProgress || isCompleted ? 'text-teal-700 dark:text-teal-400 font-bold' : ''}>
                        1. Received
                      </span>
                      <span className={isInProgress || isCompleted ? 'text-teal-700 dark:text-teal-400 font-bold' : ''}>
                        2. Preparing
                      </span>
                      <span className={isCompleted ? 'text-teal-700 dark:text-teal-400 font-bold' : ''}>
                        3. Completed
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-sand-400 h-full transition-all duration-500"
                        style={{
                          width: isCompleted ? '100%' : isInProgress ? '66%' : '33%',
                        }}
                      />
                    </div>
                  </div>

                  {/* Staff Assignment & Notes */}
                  <div className="mt-3 flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span className="text-[11px]">
                        Staff: <strong className="text-slate-800 dark:text-sand-200">{req.assignedTo || 'Assigning...'}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{req.timeRequested}</span>
                    </span>
                  </div>

                  {req.notes && (
                    <div className="mt-2.5 p-2 rounded-lg bg-sand-100/70 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-400 border border-sand-200 dark:border-slate-700/60 flex items-start space-x-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{req.notes}</span>
                    </div>
                  )}

                  {/* Cancel Request button if pending */}
                  {isPending && (
                    <button
                      onClick={() => onCancelRequest(req.id)}
                      className="mt-2 text-[10px] font-semibold text-red-600 hover:text-red-700 hover:underline"
                    >
                      Cancel this request
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-slate-950 border-t border-sand-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Need urgent assistance? Tap the SOS button in the header or call Ext. 0 on your villa phone.
          </p>
        </div>

      </div>
    </div>
  );
}

