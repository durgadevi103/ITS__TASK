import React from 'react';
import { AlertCircle } from 'lucide-react';

export const PrioritySelect = ({ value, onChange }) => {
  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200 active:ring-slate-500/20' },
    { id: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200 active:ring-amber-500/20' },
    { id: 'high', label: 'High', color: 'bg-rose-50 text-rose-700 border-rose-200 active:ring-rose-500/20' }
  ];

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Priority</label>
      <div className="flex gap-1.5">
        {priorities.map((item) => {
          const isSelected = value === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-xs font-extrabold border transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? `${item.color} ring-2 ring-offset-2 ring-slate-900 border-transparent shadow-sm` 
                  : 'bg-white text-slate-650 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertCircle size={13} className={isSelected ? 'animate-bounce' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PrioritySelect;
