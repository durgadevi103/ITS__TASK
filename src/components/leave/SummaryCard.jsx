import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const SummaryCard = ({ stats }) => {
  const cards = [
    { label: 'Total Taken', value: stats?.approved_leaves || 0, icon: BarChart3, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Remaining Leave', value: 134 - (stats?.approved_leaves || 0), icon: PieChart, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Pending Requests', value: stats?.pending_leaves || 0, icon: AlertCircle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Approved Requests', value: stats?.approved_leaves || 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Rejected Requests', value: stats?.rejected_leaves || 0, icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-100' }
  ];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="premium-glossy-card premium-glossy-card-hover shimmer-shine-overlay border-beam-card rounded-2xl p-4 border-white/40 shadow-sm"
      style={{
        '--beam-color': '#06b6d4',
        '--beam-speed': '4.5s',
        '--beam-dwell': '0s'
      }}
    >
      <h4 className="text-xs font-extrabold text-slate-800 mb-2 pb-1.5 border-b border-slate-100 uppercase tracking-wider">
        Monthly Summary
      </h4>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className={`p-2 px-2.5 rounded-xl border flex flex-col justify-between gap-1 shadow-sm transition-all ${card.color} cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold tracking-tight uppercase opacity-85">{card.label}</span>
                <Icon size={12} className="opacity-70" />
              </div>
              <span className="text-lg font-black">{card.value}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SummaryCard;
