import React from 'react';
import { CalendarRange } from 'lucide-react';
import { motion } from 'framer-motion';

export const HolidayCard = () => {
  const holidays = [
    { name: 'Holi', date: '03, Mar', day: 'Tuesday', type: 'Public Holiday', color: 'bg-rose-50 border-rose-100 text-rose-700' },
    { name: 'Good Friday', date: '19, Mar', day: 'Friday', type: 'Public Holiday', color: 'bg-amber-50 border-amber-100 text-amber-700' },
    { name: 'Idul-Fitr', date: '08, Apr', day: 'Wednesday', type: 'Public Holiday', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
    { name: 'Independence Day', date: '15, Aug', day: 'Saturday', type: 'National Holiday', color: 'bg-blue-50 border-blue-100 text-blue-700' }
  ];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="premium-glossy-card premium-glossy-card-hover shimmer-shine-overlay border-beam-card rounded-2xl p-4 border-white/40 shadow-sm"
      style={{
        '--beam-color': '#f43f5e',
        '--beam-speed': '5s',
        '--beam-dwell': '0.5s'
      }}
    >
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <CalendarRange size={14} className="text-rose-500" />
          Upcoming Holidays
        </h4>
        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full select-none cursor-pointer hover:bg-blue-100 transition-colors">
          View All
        </span>
      </div>
      
      <div className="space-y-2">
        {holidays.map((h, index) => (
          <motion.div
            key={index}
            whileHover={{ x: 4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`p-2 px-2.5 rounded-xl border flex items-center justify-between ${h.color} cursor-pointer`}
          >
            <div>
              <h5 className="text-[11px] font-black tracking-tight">{h.name}</h5>
              <p className="text-[8px] font-bold opacity-80 mt-0">{h.type} • {h.day}</p>
            </div>
            <span className="text-[9px] font-black text-right">{h.date}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HolidayCard;
