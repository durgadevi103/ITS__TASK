import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, CheckCircle, Clock, AlertTriangle, 
  Send, History, Hourglass, ArrowRight 
} from 'lucide-react';
import LeaveBalanceCard from './LeaveBalanceCard';

export const LeaveDashboard = ({ stats, allowance, requests = [], onNavigateToTab }) => {
  // Take last 3 requests as "Recent requests"
  const recentRequests = requests.slice(0, 3);

  // SVG Area Chart Data Points (Deterministic points representing requests trend over months)
  const areaPoints = "10,90 40,75 70,80 100,50 130,45 160,65 190,30 220,20 250,35 280,10 310,15 340,5";

  return (
    <div className="space-y-6">
      {/* 1. Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 text-white rounded-3xl p-5 border border-white/10 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 rotate-45 transform" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-100">Total Submissions</span>
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black">{stats.total_submissions}</span>
            <p className="text-[10px] text-indigo-100/80 font-bold mt-1">Submitted requests this calendar year</p>
          </div>
        </motion.div>

        {/* Approved Leaves */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-3xl p-5 border border-white/10 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 rotate-45 transform" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">Approved Requests</span>
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black">{stats.approved_leaves}</span>
            <p className="text-[10px] text-emerald-100/80 font-bold mt-1">Approved & recorded leaves</p>
          </div>
        </motion.div>

        {/* Pending Approval */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white rounded-3xl p-5 border border-white/10 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 rotate-45 transform" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-100">Pending Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black">{stats.pending_leaves}</span>
            <p className="text-[10px] text-amber-100/80 font-bold mt-1">Awaiting manager verification</p>
          </div>
        </motion.div>

        {/* Rejected Leaves */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 text-white rounded-3xl p-5 border border-white/10 shadow-lg relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 rotate-45 transform" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-100">Rejected Requests</span>
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black">{stats.rejected_leaves}</span>
            <p className="text-[10px] text-rose-100/80 font-bold mt-1">Declined or closed entries</p>
          </div>
        </motion.div>
      </div>

      {/* 2. Leave Balance Cards */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Your Leave Allowances</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allowance.map((item) => (
            <LeaveBalanceCard
              key={item.key}
              type={item.type}
              balanceKey={item.key}
              total={item.total}
              used={item.used}
              remaining={item.remaining}
              gradient={item.gradient}
              color={item.color}
            />
          ))}
        </div>
      </div>

      {/* 3. Charts & Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SVG Area Chart - Leave Trends */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-sm md:col-span-2">
          <h4 className="text-sm font-extrabold text-slate-800 mb-4">Leave Utilization Trend</h4>
          <div className="relative w-full h-44 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <svg viewBox="0 0 350 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="350" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="50" x2="350" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="350" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Trend Path Area */}
              <path d={`M 10,100 L ${areaPoints} L 340,100 Z`} fill="url(#areaGrad)" />
              {/* Trend line */}
              <polyline points={areaPoints} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="flex justify-between text-[8px] font-black text-slate-400 mt-2 px-1">
              <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* SVG Pie Chart - Request Breakdown */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <h4 className="text-sm font-extrabold text-slate-800 mb-2">Request Status Share</h4>
          <div className="flex items-center justify-center flex-1 h-32 relative">
            <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
              {/* Mock pie slices: Approved (60%), Pending (25%), Rejected (15%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="150.7 251.2" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="62.8 251.2" strokeDashoffset="-150.7" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="37.7 251.2" strokeDashoffset="-213.5" />
            </svg>
          </div>
          <div className="grid grid-cols-3 text-[9px] font-black text-slate-500 text-center gap-1 mt-2">
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-1" />
              <span>Approved</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mb-1" />
              <span>Pending</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mb-1" />
              <span>Rejected</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions & Recent Requests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-slate-800 pb-2 border-b border-slate-100">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => onNavigateToTab('apply')}
              className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-slate-200/50 hover:border-blue-200 text-blue-700 transition cursor-pointer text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <Send size={15} />
                Apply for Leave
              </span>
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => onNavigateToTab('history')}
              className="flex items-center justify-between p-3 rounded-2xl bg-teal-50/50 hover:bg-teal-50 border border-slate-200/50 hover:border-teal-200 text-teal-700 transition cursor-pointer text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <History size={15} />
                View Leave History
              </span>
              <ArrowRight size={13} />
            </button>

            <button
              onClick={() => onNavigateToTab('permission')}
              className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-slate-200/50 hover:border-amber-200 text-amber-700 transition cursor-pointer text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <Hourglass size={15} />
                Request Permission
              </span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Recent Leave Requests mini-list */}
        <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-sm md:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-sm font-extrabold text-slate-800">Recent Leave Requests</h4>
            <button
              onClick={() => onNavigateToTab('requests')}
              className="text-xs font-extrabold text-blue-600 hover:underline cursor-pointer"
            >
              View My Requests
            </button>
          </div>

          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                No leave requests found.
              </div>
            ) : (
              recentRequests.map((req) => {
                let badge = 'bg-amber-50 text-amber-700 border-amber-100';
                if (req.leave_status === 'Approved') badge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                if (req.leave_status === 'Rejected') badge = 'bg-rose-50 text-rose-700 border-rose-100';

                return (
                  <div key={req.leave_id} className="flex justify-between items-center p-3 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition">
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-extrabold text-slate-800">{req.leave_type}</h5>
                      <p className="text-[10px] text-slate-400 font-bold">
                        {new Date(req.leave_from).toLocaleDateString()} - {new Date(req.leave_to).toLocaleDateString()} • {req.leave_days} {req.leave_days === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-full ${badge}`}>
                      {req.leave_status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;
