import React from 'react';
import { Sun, SunMoon, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ShiftSelector = ({ value, onChange }) => {
  const options = [
    { id: 'full', label: 'Full Day', icon: Sun },
    { id: 'first_half', label: 'First Half', icon: SunMoon },
    { id: 'second_half', label: 'Second Half', icon: Moon }
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Shift</label>
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`relative flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'text-blue-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeShiftPill"
                  className="absolute inset-0 bg-white border border-slate-200/50 rounded-xl shadow-sm z-0"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <Icon size={14} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftSelector;
