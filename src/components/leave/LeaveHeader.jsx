import React from 'react';
import { Calendar, ChevronRight, Home, Users } from 'lucide-react';

export const LeaveHeader = ({ title, subtitle, activeTab }) => {
  return (
    <div className="mb-6 relative">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 select-none">
        <span className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer">
          <Home size={13} />
          Home
        </span>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer">
          <Users size={13} />
          Core HR
        </span>
        <ChevronRight size={12} className="text-slate-400" />
        <span className="text-slate-700 font-bold flex items-center gap-1">
          <Calendar size={13} className="text-blue-600" />
          Leave Management
        </span>
      </nav>

      {/* Main Title & Tagline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {title || "Leave Management"}
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm animate-pulse">
              Enterprise v2.0
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {subtitle || "Track allowances, request approvals, and manage company time-off accounts."}
          </p>
        </div>
        
        {/* Active view status */}
        <div className="flex items-center gap-2 bg-white/85 backdrop-blur border border-slate-200/80 px-3 py-1.5 rounded-2xl shadow-sm self-start">
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
