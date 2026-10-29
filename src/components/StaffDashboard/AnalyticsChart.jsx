import React from 'react';
import { BarChart3, Coffee, Compass, Utensils, Sparkles, Waves, Flame, Clock, Users } from 'lucide-react';

export default function AnalyticsChart({ requests, onClearCompleted, onSimulateSurge }) {
  const serviceStats = [
    { name: "Ethiopian Coffee Ceremony (Buna)", percent: 36, color: "bg-sand-500", icon: Coffee, count: "18 sessions" },
    { name: "Lake Ziway Tours (Tulu Gudo)", percent: 28, color: "bg-teal-600", icon: Compass, count: "14 cruises" },
    { name: "Fresh Tilapia & Dining", percent: 22, color: "bg-amber-600", icon: Utensils, count: "11 orders" },
    { name: "Zoma Lakeside Spa & Mud", percent: 14, color: "bg-emerald-600", icon: Sparkles, count: "7 guests" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      
      {/* Popular Lake Ziway Experiences Breakdown */}
      <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-3xl border border-sand-200/90 dark:border-slate-800 shadow-luxury">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-sand-100">
                Experience Popularity & Guest Demand
              </h3>
              <p className="text-[11px] text-slate-500">
                Real-time booking distribution across Lake Ziway resort amenities
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Today • Rift Season
          </span>
        </div>

        <div className="space-y-3.5">
          {serviceStats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-3.5 h-3.5 text-sand-500" />
                    <span className="font-semibold text-slate-800 dark:text-sand-200">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px]">{item.count}</span>
                    <span className="font-bold text-teal-800 dark:text-teal-400">{item.percent}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Operational Actions & Peak Time Widget */}
      <div className="p-5 bg-gradient-to-br from-teal-950 to-teal-900 text-sand-100 rounded-3xl border border-teal-800 shadow-luxury flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-sand-400" />
            <h4 className="font-serif font-bold text-sm text-sand-100">
              Peak Concierge Hours
            </h4>
          </div>
          <p className="text-xs text-teal-200/90 leading-relaxed mb-4">
            Dawn Birdwatching (06:30 - 08:30) and Golden Hour Sunset Boat Cruises (16:30 - 18:30) have the highest simultaneous staff deployment.
          </p>

          <div className="p-3 rounded-2xl bg-teal-900/60 border border-teal-800/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-teal-300">Average Fulfillment Time:</span>
              <strong className="text-sand-300">11m 45s</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-300">Active Boat Captains:</span>
              <strong className="text-sand-300">3 on lake</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-300">Buna Ceremony Hostesses:</span>
              <strong className="text-sand-300">2 active</strong>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 mt-2 border-t border-teal-800/80 flex items-center gap-2">
          <button
            onClick={onSimulateSurge}
            className="flex-1 py-2 px-3 bg-sand-500 hover:bg-sand-400 text-teal-950 rounded-xl text-xs font-bold transition shadow-sm"
          >
            + Test Guest Request
          </button>
          <button
            onClick={onClearCompleted}
            className="py-2 px-3 bg-teal-900 hover:bg-teal-800 text-sand-300 rounded-xl text-xs font-semibold border border-teal-700 transition"
          >
            Clear Fulfilled
          </button>
        </div>
      </div>

    </div>
  );
}

