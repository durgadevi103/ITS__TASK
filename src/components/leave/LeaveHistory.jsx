import React from 'react';
import { CalendarRange, Info } from 'lucide-react';
import LeaveTable from './LeaveTable';

export const LeaveHistory = ({ requests = [], onUpdateStatus, loading = false }) => {
  return (
    <div className="space-y-6">
      {/* Informative Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-inner">
          <Info size={18} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-slate-800">Global Leave Registry</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Below is the list of all leave requests submitted across all departments. Administrators and Managers can use the action buttons (✓/✗) on pending requests to approve or reject them. All dates are displayed in employee local timezones.
          </p>
        </div>
      </div>

      {/* Main Leave Data Table */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading leave register...</span>
        </div>
      ) : (
        <LeaveTable 
          data={requests} 
          onUpdateStatus={onUpdateStatus} 
          isAdmin={true} 
        />
      )}
    </div>
  );
};

export default LeaveHistory;
