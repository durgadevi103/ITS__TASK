import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, CheckCircle2, Clock, XCircle, Ban 
} from 'lucide-react';

// Animated Ticker Counting up from 0 to value
const CountUp = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value) || 0;
    const duration = 1200; // ms for a smooth layout animation

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Easing function - easeOutQuad
      const easedProgress = progress * (2 - progress);
      setCount(Math.floor(easedProgress * endValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <span>{count}</span>;
};

export const DashboardStatsGrid = ({ stats, requests = [] }) => {
  const cancelledCount = requests.filter(r => r.leave_status === 'Cancelled').length;

  const cards = [
    {
      title: 'Total Requests',
      value: stats?.total_submissions || 0,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      bgGlow: 'bg-blue-500/10',
      borderColor: 'hover:border-blue-500/50',
      shadow: 'hover:shadow-blue-500/25'
    },
    {
      title: 'Approved',
      value: stats?.approved_leaves || 0,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      bgGlow: 'bg-emerald-500/10',
      borderColor: 'hover:border-emerald-500/50',
      shadow: 'hover:shadow-emerald-500/25'
    },
    {
      title: 'Pending',
      value: stats?.pending_leaves || 0,
      icon: Clock,
      color: 'from-amber-400 to-orange-500',
      bgGlow: 'bg-amber-500/10',
      borderColor: 'hover:border-amber-500/50',
      shadow: 'hover:shadow-amber-500/25'
    },
    {
      title: 'Rejected',
      value: stats?.rejected_leaves || 0,
      icon: XCircle,
      color: 'from-rose-500 to-pink-600',
      bgGlow: 'bg-rose-500/10',
      borderColor: 'hover:border-rose-500/50',
      shadow: 'hover:shadow-rose-500/25'
    },
    {
      title: 'Cancelled',
      value: cancelledCount,
      icon: Ban,
      color: 'from-slate-500 to-zinc-600',
      bgGlow: 'bg-slate-500/10',
      borderColor: 'hover:border-slate-500/50',
      shadow: 'hover:shadow-slate-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`premium-glossy-card premium-glossy-card-hover shimmer-shine-overlay border-beam-card rounded-3xl p-5 cursor-pointer group transition-all duration-300 border-white/40 ${card.borderColor} ${card.shadow}`}
            style={{
              '--beam-color': card.title === 'Approved' ? '#10b981' : card.title === 'Pending' ? '#f59e0b' : card.title === 'Rejected' ? '#ef4444' : card.title === 'Cancelled' ? '#64748b' : '#3b82f6',
              '--beam-speed': '5s',
              '--beam-dwell': `${idx * 0.4}s`
            }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

            {/* Loop-animated floating background blob */}
            <motion.div
              animate={{ 
                x: [0, 8, -6, 0],
                y: [0, -10, 8, 0],
                scale: [1, 1.15, 0.9, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 8 + idx * 2, 
                ease: 'easeInOut' 
              }}
              className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10 blur-xl ${card.bgGlow}`}
            />

            <div className="flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
                  {card.title}
                </span>

                {/* Floating Spring Icon */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3.5, 
                    delay: idx * 0.4, 
                    ease: "easeInOut" 
                  }}
                  className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:rotate-12 transition-transform duration-300`}
                >
                  <Icon size={16} />
                </motion.div>
              </div>

              {/* Counts display */}
              <div className="mt-1">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                  <CountUp value={card.value} />
                </h3>
                <p className="text-[9px] font-black text-slate-400 mt-1.5 uppercase tracking-widest">
                  Active entries
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStatsGrid;
