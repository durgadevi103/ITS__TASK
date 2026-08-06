import React from 'react';
import { motion } from 'framer-motion';
import { 
  Send, History, Hourglass, ArrowRight, CalendarRange, Sparkles, PlusCircle 
} from 'lucide-react';
import DashboardStatsGrid from './DashboardStatsGrid';
import LeaveTrendChart from './LeaveTrendChart';
import RequestShareChart from './RequestShareChart';
import LeaveTable from './LeaveTable';

// Apple-style sequenced entrance animations
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.99, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 18
    }
  }
};

export const LeaveDashboard = ({ stats, allowance, requests = [], onNavigateToTab, onUpdateStatus }) => {
  const recentRequests = requests.slice(0, 5);

  const holidays = [
    { name: 'Holi', date: '03, Mar', day: 'Tuesday', type: 'Public Holiday', color: 'bg-rose-500/10 text-rose-700 border-rose-500/15' },
    { name: 'Good Friday', date: '19, Mar', day: 'Friday', type: 'Public Holiday', color: 'bg-amber-500/10 text-amber-700 border-amber-500/15' }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative pb-10"
    >
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none -z-10 animate-[floatUpSidebar_20s_infinite_ease-in-out]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none -z-10 animate-[floatDownSidebar_25s_infinite_ease-in-out]" />

      {/* 1. Summary Cards (Sequence 2) */}
      <motion.div variants={sectionVariants}>
        <DashboardStatsGrid stats={stats} requests={requests} />
      </motion.div>

      {/* 2. Charts Section (Sequence 3) */}
      <motion.div 
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Trend Area Chart Card */}
        <motion.div 
          whileHover={{ y: -4, border: '1px solid rgba(37, 99, 235, 0.25)' }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-md lg:col-span-2 relative group hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">Leave Utilization Trend</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Approved Days Taken</p>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full text-[9px] font-black text-blue-600">
              <ActivityIcon className="w-2.5 h-2.5" />
              <span>LIVE DATA</span>
            </div>
          </div>
          <LeaveTrendChart requests={requests} />
        </motion.div>

        {/* Donut Chart Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl"
        >
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">Request Share Distribution</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Approval Statuses</p>
          </div>
          <div className="my-auto py-2">
            <RequestShareChart stats={stats} requests={requests} />
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Holidays & Quick Actions & Table (Sequence 4-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Table submissions registry */}
        <motion.div 
          variants={sectionVariants}
          className="lg:col-span-8 space-y-4"
        >
          <div className="flex justify-between items-center px-1">
            <div>
              <h4 className="text-base font-extrabold text-slate-800 tracking-tight">Recent Submissions Registry</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manager actions log</p>
            </div>
            <button
              onClick={() => onNavigateToTab('requests')}
              className="text-xs font-black text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition uppercase tracking-wider"
            >
              View My Requests
            </button>
          </div>

          <LeaveTable 
            data={recentRequests} 
            onUpdateStatus={onUpdateStatus} 
            isAdmin={true} 
          />
        </motion.div>

        {/* Right: Actions and Holiday Widget */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Holidays */}
          <motion.div 
            variants={sectionVariants}
            className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4 hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <CalendarRange size={16} className="text-rose-500" />
                Upcoming Holidays
              </h4>
            </div>

            <div className="space-y-2.5">
              {holidays.map((h, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl border border-slate-100 flex items-center justify-between bg-white hover:scale-[1.01] hover:shadow-sm hover:border-slate-300/80 transition-all duration-200`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${h.color}`}>
                      {h.date.split(',')[0]}
                    </span>
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-800">{h.name}</h5>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{h.day} • {h.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions Buttons */}
          <motion.div 
            variants={sectionVariants}
            className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md space-y-4 hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl"
          >
            <h4 className="text-sm font-extrabold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              Quick Actions
            </h4>
            
            <div className="grid grid-cols-1 gap-2.5 relative">
              {/* Apply Leave with shimmering background */}
              <button
                onClick={() => onNavigateToTab('apply')}
                className="relative overflow-hidden flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-50 hover:to-indigo-50 border border-blue-100/60 text-blue-700 transition cursor-pointer text-xs font-black uppercase tracking-wider group"
              >
                <span className="flex items-center gap-2 relative z-10">
                  <Send size={15} />
                  Apply Leave
                </span>
                <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-250 relative z-10" />
              </button>

              {/* Leave History */}
              <button
                onClick={() => onNavigateToTab('history')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/50 hover:bg-teal-50 border border-teal-100/60 text-teal-700 transition cursor-pointer text-xs font-black uppercase tracking-wider group"
              >
                <span className="flex items-center gap-2">
                  <History size={15} />
                  Leave History
                </span>
                <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-250" />
              </button>

              {/* Permission */}
              <button
                onClick={() => onNavigateToTab('permission')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100/60 text-amber-700 transition cursor-pointer text-xs font-black uppercase tracking-wider group"
              >
                <span className="flex items-center gap-2">
                  <Hourglass size={15} />
                  Permission
                </span>
                <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-250" />
              </button>
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
};

// Internal mini activity pulse icon component
const ActivityIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default LeaveDashboard;
