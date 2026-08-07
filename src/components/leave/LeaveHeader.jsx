import React from 'react';

export const LeaveHeader = ({ title, activeTab }) => {
  return (
    <div className="mb-2 relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title || "Leave Management"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 max-w-2xl">
            Apply for leave, track vacation allowance, and request hourly checkout permissions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/85 backdrop-blur border border-slate-200/80 px-2.5 py-1 rounded-2xl shadow-sm self-start">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-slate-600 capitalize">
            Current Section: <span className="text-blue-600">{activeTab?.replace('-', ' ') || 'Dashboard'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveHeader;
