import React from 'react';

export const LeaveHeader = ({ title, activeTab }) => {
  return (
    <div className="mb-6 relative">
      {/* Main Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {title || "Leave Management"}
          </h1>
        </div>
        
        {/* Active view status */}
        <div className="flex items-center gap-2 bg-white/85 backdrop-blur border border-slate-200/80 px-3 py-5 rounded-2xl shadow-sm self-start">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-600 capitalize">
            Current Section: <span className="text-blue-600">{activeTab?.replace('-', ' ') || 'Dashboard'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveHeader;
