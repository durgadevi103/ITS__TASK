import React from 'react';
import { CalendarRange, Sparkles, Pin } from 'lucide-react';

export const HolidayCard = () => {
  const holidays = [
    { name: 'Holi', date: '03, Mar', day: 'Tuesday', type: 'Public Holiday', color: 'bg-rose-50 border-rose-100 text-rose-700' },
    { name: 'Good Friday', date: '19, Mar', day: 'Friday', type: 'Public Holiday', color: 'bg-amber-50 border-amber-100 text-amber-700' },
    { name: 'Idul-Fitr', date: '08, Apr', day: 'Wednesday', type: 'Public Holiday', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
    { name: 'Independence Day', date: '15, Aug', day: 'Saturday', type: 'National Holiday', color: 'bg-blue-50 border-blue-100 text-blue-700' }
  ];

  const events = [
    { name: 'Q3 Town Hall & Meet', date: '25, Aug', time: '03:00 PM', desc: 'Global strategy updates' },
    { name: 'Annual Hackathon 2026', date: '12, Sep', time: 'All Day', desc: 'Teams building new innovations' }
  ];

  return (
    <div className="space-y-4">
      {/* Holidays List */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md">
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
          <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <CalendarRange size={16} className="text-rose-500" />
            Upcoming Holidays
          </h4>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full select-none cursor-pointer hover:bg-blue-100">
            View All
          </span>
        </div>
        
        <div className="space-y-2.5">
          {holidays.map((h, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl border flex items-center justify-between ${h.color} hover:scale-[1.01] transition-transform duration-200`}
            >
              <div>
                <h5 className="text-xs font-black tracking-tight">{h.name}</h5>
                <p className="text-[9px] font-bold opacity-80 mt-0.5">{h.type} • {h.day}</p>
              </div>
              <span className="text-[10px] font-black text-right">{h.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Company Events List */}
      <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md">
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
          <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-500 animate-pulse" />
            Company Events
          </h4>
        </div>
        
        <div className="space-y-3">
          {events.map((e, index) => (
            <div key={index} className="flex gap-3 items-start group">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-black uppercase text-slate-400">Date</span>
                <span className="text-[10px] font-extrabold text-slate-700">{e.date.split(',')[0]}</span>
              </div>
              <div className="space-y-0.5 flex-1">
                <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                  {e.name}
                  <Pin size={10} className="text-slate-400 rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h5>
                <p className="text-[10px] font-semibold text-slate-400">{e.time} • {e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolidayCard;
