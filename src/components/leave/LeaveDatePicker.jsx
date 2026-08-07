import React from 'react';
import { Calendar } from 'lucide-react';

export const LeaveDatePicker = ({ fromDate, toDate, onFromDateChange, onToDateChange, totalDays }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* From Date */}
        <div className="space-y-1 relative">
          <label htmlFor="fromDate" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">From Date</label>
          <div className="relative">
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80"
              required
            />
          </div>
        </div>

        {/* To Date */}
        <div className="space-y-1 relative">
          <label htmlFor="toDate" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">To Date</label>
          <div className="relative">
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              min={fromDate}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-80"
              required
            />
          </div>
        </div>
      </div>

      {/* Calculated Days badge */}
      {totalDays > 0 && (
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-2.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-600" />
            <span className="text-[11px] font-semibold text-slate-600">Calculated Duration:</span>
          </div>
          <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg shadow-sm">
            {totalDays} {totalDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      )}
    </div>
  );
};

export default LeaveDatePicker;
