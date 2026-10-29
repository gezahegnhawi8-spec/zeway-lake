import React from 'react';
import { Clock, ShieldAlert, Sparkles, Coffee, Compass, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export default function StaffStats({ requests }) {
  const pending = requests.filter(r => r.status === 'Pending').length;
  const inProgress = requests.filter(r => r.status === 'In Progress').length;
  const completed = requests.filter(r => r.status === 'Completed').length;
  const urgent = requests.filter(r => r.priority === 'Urgent' && r.status !== 'Completed').length;

  const coffeeCount = requests.filter(r => r.serviceId === 'traditional-coffee').length;
  const lakeToursCount = requests.filter(r => ['lake-tour', 'bird-watching', 'water-sports'].includes(r.serviceId)).length;

  const stats = [
    {
      label: 'Pending Requests',
      value: pending,
      subtext: 'Awaiting dispatch',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
    },
    {
      label: 'In Service / Active',
      value: inProgress,
      subtext: 'Staff deployed',
      icon: TrendingUp,
      color: 'from-teal-600 to-teal-700',
      badgeColor: 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200',
    },
    {
      label: 'Urgent SOS Alarms',
      value: urgent,
      subtext: urgent > 0 ? 'Action required immediately' : 'All clear',
      icon: ShieldAlert,
      color: 'from-red-600 to-red-700',
      badgeColor: urgent > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      label: 'Coffee Ceremonies',
      value: coffeeCount,
      subtext: 'Buna Tetu requests',
      icon: Coffee,
      color: 'from-sand-500 to-amber-800',
      badgeColor: 'bg-sand-100 text-sand-900 dark:bg-slate-800 dark:text-sand-300',
    },
    {
      label: 'Lake & Marina Tours',
      value: lakeToursCount,
      subtext: 'Boat & birding trips',
      icon: Compass,
      color: 'from-teal-700 to-teal-950',
      badgeColor: 'bg-teal-100 text-teal-900 dark:bg-slate-800 dark:text-teal-300',
    },
    {
      label: 'Completed Today',
      value: completed,
      subtext: 'Fulfillment: 98.4%',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-sand-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.badgeColor}`}>
                {stat.subtext}
              </span>
            </div>

            <div className="mt-1">
              <div className="text-2xl font-serif font-bold text-slate-900 dark:text-sand-100 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

