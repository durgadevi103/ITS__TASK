import React from 'react';
import { HelpCircle } from 'lucide-react';

export const ReasonSelect = ({ value, onChange }) => {
  const reasons = [
    { label: 'Sickness / Medical Treatment', value: 'Sickness' },
    { label: 'Family Gathering / Celebration', value: 'Family Gathering' },
    { label: 'Urgent work at home', value: 'Urgent work at home' },
    { label: 'Vacation / Personal Travel', value: 'Vacation' },
    { label: 'Bereavement / Family Emergency', value: 'Family Emergency' },
    { label: 'Other Reason', value: 'Other' }
  ];

  return (
    <div className="space-y-1">
      <label htmlFor="leaveReason" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reason for Leave</label>
      <div className="relative">
        <select
          id="leaveReason"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 pr-9 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
          required
        >
          <option value="" disabled>Select Reason</option>
          {reasons.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
          <HelpCircle size={14} />
        </div>
      </div>
    </div>
  );
};

export default ReasonSelect;
