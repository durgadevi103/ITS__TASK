import React from 'react';
import { LayoutDashboard, FileSpreadsheet, CalendarDays, History, Hourglass, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const LeaveTabs = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Leave Dashboard', icon: LayoutDashboard },
    { id: 'apply', label: 'Submit Leave Request', icon: FileSpreadsheet },
    { id: 'history', label: 'Leave History', icon: History },
    { id: 'permission', label: 'Leave Permission', icon: Hourglass }
  ];

  return (
    <div className="border-b border-slate-200 mb-6 bg-white/50 backdrop-blur rounded-2xl p-1.5 flex flex-wrap gap-1 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-250 cursor-pointer ${
              isActive ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {/* Sliding Pill Background Animation */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default LeaveTabs;
