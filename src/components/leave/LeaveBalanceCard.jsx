import React from 'react';
import { motion } from 'framer-motion';
import { CalendarRange, ShieldAlert, HeartPulse, Sparkles } from 'lucide-react';

const iconMap = {
  CL: CalendarRange,
  SL: HeartPulse,
  PL: ShieldAlert,
  ML: Sparkles
};

export const LeaveBalanceCard = ({ type, balanceKey, total, used, remaining, gradient, color }) => {
  const Icon = iconMap[balanceKey] || CalendarRange;
  const progressPercent = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-3xl p-5 text-white overflow-hidden shadow-lg bg-gradient-to-br ${gradient} border border-white/10`}
    >
      {/* Glossy Overlay Sparkle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 rotate-45 transform pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
          {type.split(' ')[0]}
        </span>
        <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
          <Icon size={16} className="text-white" />
        </div>
      </div>

      {/* Main Balances */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tight">{remaining}</span>
        <span className="text-xs font-semibold text-white/70">/ {total} Days Left</span>
      </div>

      <p className="text-xs text-white/90 mt-1 font-bold">{type}</p>

      {/* Progress Bar */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-white/80">
          <span>Used: {used} d</span>
          <span>{Math.round(progressPercent)}% Used</span>
        </div>
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LeaveBalanceCard;
