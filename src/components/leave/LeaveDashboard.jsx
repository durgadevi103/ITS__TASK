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
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-extrabold tracking-tight text-slate-800">Employee Performance Overview</h4>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Performance comparison across departments
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-blue-100/50 bg-blue-50 px-2.5 py-1 text-[9px] font-black text-blue-600">
              <ActivityIcon className="h-2.5 w-2.5" />
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
