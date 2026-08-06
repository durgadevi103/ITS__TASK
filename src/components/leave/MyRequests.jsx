import React, { useMemo } from 'react';
import { Briefcase, CalendarDays } from 'lucide-react';
import LeaveTable from './LeaveTable';

export const MyRequests = ({ requests = [], currentUser, loading = false }) => {
  const currentEmpId = currentUser?.emp_id || currentUser?.employee_id;

  // Filter requests to show only current user's leaves
  const filteredRequests = useMemo(() => {
    if (!currentEmpId) return [];
    return requests.filter(req => String(req.emp_id) === String(currentEmpId));
  }, [requests, currentEmpId]);

  return (
    <div className="space-y-6">
      {/* Summary Info Widget */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-3xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-inner">
          <CalendarDays size={18} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-slate-800">My Leave Requests</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Track the status of all your submitted time-off requests. Once a manager reviews and updates your request, the status badge will automatically update to Approved or Rejected.
          </p>
        </div>
      </div>

      {/* Main Leave Table (Actions disabled) */}
      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading requests history...</span>
        </div>
      ) : (
        <LeaveTable 
          data={filteredRequests} 
          onUpdateStatus={() => {}} 
          isAdmin={false} 
        />
      )}
    </div>
  );
};

export default MyRequests;
