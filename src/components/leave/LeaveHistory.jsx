import React from 'react';
import { CalendarRange, Info } from 'lucide-react';
import LeaveTable from './LeaveTable';

export const LeaveHistory = ({ requests = [], onUpdateStatus, loading = false }) => {
  return (
    <div className="space-y-4">

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
