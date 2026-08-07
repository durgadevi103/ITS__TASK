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
      whileHover={{ 
        y: -6, 
        scale: 1.02, 
        boxShadow: '0 20px 35px -5px rgba(59, 130, 246, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
        borderColor: 'rgba(255, 255, 255, 0.4)'
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-3xl p-5 text-white overflow-hidden shadow-lg bg-gradient-to-br ${gradient} border border-white/20 backdrop-blur-xl shimmer-shine-overlay border-beam-card group cursor-pointer`}
      style={{
        '--beam-color': 'rgba(255, 255, 255, 0.95)',
        '--beam-speed': '4.5s',
        '--beam-dwell': '0.5s'
      }}
    >
      {/* Glossy Overlay Sparkle / Diagonal Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8 rotate-45 transform pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-white bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 shadow-inner">
          {type.split(' ')[0]}
        </span>
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:rotate-12 transition-transform duration-300">
          <Icon size={16} className="text-white" />
        </div>
      </div>

      {/* Main Balances */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tight drop-shadow-md">{remaining}</span>
        <span className="text-xs font-bold text-white/80">/ {total} Days Left</span>
      </div>

      <p className="text-xs text-white/95 mt-1 font-bold tracking-wide drop-shadow-sm">{type}</p>

      {/* Progress Bar */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-white/90">
          <span>Used: {used} d</span>
          <span>{Math.round(progressPercent)}% Used</span>
        </div>
        <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden p-[1px]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-white via-white/90 to-white rounded-full shadow-inner animate-[pulse_3s_infinite]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LeaveBalanceCard;
