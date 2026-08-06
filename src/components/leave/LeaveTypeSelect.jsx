import React from 'react';
import { CalendarRange } from 'lucide-react';

export const LeaveTypeSelect = ({ value, onChange }) => {
  const types = [
    { label: 'Casual Leave (CL)', value: 'Casual Leave (CL)' },
    { label: 'Sick Leave (SL)', value: 'Sick Leave (SL)' },
    { label: 'Privilege Leave (PL)', value: 'Privilege Leave (PL)' },
    { label: 'Maternity Leave (ML)', value: 'Maternity Leave (ML)' }
  ];

  return (
    <div className="space-y-1.5">
      <label htmlFor="leaveType" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Leave Type</label>
      <div className="relative">
        <select
          id="leaveType"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 pr-10 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
          required
        >
          <option value="" disabled>Choose Leave Type</option>
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        
        {/* Custom Chevron Indicator */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
          <CalendarRange size={16} />
        </div>
      </div>
    </div>
  );
};

export default LeaveTypeSelect;
