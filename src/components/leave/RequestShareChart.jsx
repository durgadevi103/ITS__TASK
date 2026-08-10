import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, CheckCircle2, Clock, XCircle, Ban } from 'lucide-react';

// Animated Ticker for Donut Center with fast snappy easeOut animation
const DonutCenterCounter = ({ value, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value) || 0;
    const duration = 600; // ms for a snappy counting flow

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = progress * (2 - progress); // easeOutQuad
      setCount(Math.floor(eased * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span 
      className="text-3xl font-black tracking-tight transition-colors duration-300"
      style={{ color: color || '#1e293b' }}
    >
      {count}
    </span>
  );
};

// Render active sector with gorgeous gradient overlay and outer projection offset
const renderActiveSector = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, name } = props;
  
  // Midpoint angle calculation for offset
  const RADIAN = Math.PI / 180;
  const midAngle = (startAngle + endAngle) / 2;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  
  const shiftX = 5 * cos;
  const shiftY = 5 * sin;

  return (
    <g>
      <Sector
        cx={cx + shiftX}
        cy={cy + shiftY}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={name ? `url(#grad-${name})` : fill}
        filter="url(#activeGlow)"
        style={{ 
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer'
        }}
      />
    </g>
  );
};

export const RequestShareChart = ({ stats, requests = [] }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const cancelledCount = requests.filter(r => r.leave_status === 'Cancelled').length;

  // Prepare distribution details
  const data = useMemo(() => {
    return [
      { name: 'Approved', value: stats?.approved_leaves || 0, color: '#10b981' },
      { name: 'Pending', value: stats?.pending_leaves || 0, color: '#f59e0b' },
      { name: 'Rejected', value: stats?.rejected_leaves || 0, color: '#ef4444' },
      { name: 'Cancelled', value: cancelledCount, color: '#64748b' }
    ].filter(item => item.value > 0);
  }, [stats, cancelledCount]);

  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  // Memoize center configuration based on active index
  const centerData = useMemo(() => {
    if (activeIndex !== -1 && data[activeIndex]) {
      const activeItem = data[activeIndex];
      let Icon = Sparkles;
      if (activeItem.name === 'Approved') Icon = CheckCircle2;
      else if (activeItem.name === 'Pending') Icon = Clock;
      else if (activeItem.name === 'Rejected') Icon = XCircle;
      else if (activeItem.name === 'Cancelled') Icon = Ban;
      
      return {
        label: activeItem.name,
        value: activeItem.value,
        color: activeItem.color,
        Icon
      };
    }
    return {
      label: 'Total Requests',
      value: total,
      color: '#3b82f6',
      Icon: Activity
    };
  }, [activeIndex, data, total]);

  // Legend list staggered animations
  const legendVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.12,
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    })
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 min-h-[190px] relative select-none p-2">
      
      {/* Background dynamic glow responsive to hovered slice */}
      <motion.div
        animate={{
          backgroundColor: activeIndex !== -1 ? `${data[activeIndex]?.color}15` : 'rgba(59, 130, 246, 0.04)',
          scale: activeIndex !== -1 ? 1.25 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute top-1/2 left-[28%] sm:left-[22%] w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"
      />

      {/* Donut Chart Container */}
      <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
        
        {/* Concentric rotating outer decoration ring */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg 
            className="w-[148px] h-[148px]" 
            viewBox="0 0 100 100"
            style={{ animation: 'spin 80s linear infinite' }}
          >
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="rgba(148, 163, 184, 0.15)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
          </svg>
        </div>

        {/* Concentric rotating inner counter decoration ring */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg 
            className="w-[104px] h-[104px]" 
            viewBox="0 0 100 100" 
            style={{ animation: 'spin 40s linear infinite reverse' }}
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(148, 163, 184, 0.12)"
              strokeWidth="0.8"
              strokeDasharray="2 3"
            />
          </svg>
        </div>

        {/* The Recharts Pie Canvas */}
        <motion.div
          initial={{ rotate: -30, opacity: 0, scale: 0.85 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-36 h-36 relative z-10 cursor-pointer"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="grad-Approved" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="grad-Pending" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="grad-Rejected" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <linearGradient id="grad-Cancelled" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="grad-Empty" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <filter id="activeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.12" />
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveSector}
                data={data.length === 0 ? [{ name: 'Empty', value: 1, color: '#e2e8f0' }] : data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={52}
                paddingAngle={data.length > 1 ? 5 : 0}
                dataKey="value"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {(data.length === 0 ? [{ name: 'Empty', value: 1, color: '#e2e8f0' }] : data).map((entry, index) => {
                  const isHovered = activeIndex === index;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Empty' ? 'url(#grad-Empty)' : `url(#grad-${entry.name})`}
                      style={{
                        filter: isHovered ? `drop-shadow(0 0 6px ${entry.color}a0)` : 'none',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Glassmorphic inner center card content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={centerData.label}
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center px-2"
              >
                <div className="relative mb-0.5">
                  <centerData.Icon 
                    size={15} 
                    style={{ color: centerData.color }} 
                    className="transition-all duration-300 filter drop-shadow-sm"
                  />
                  {activeIndex === -1 && (
                    <motion.div 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full rounded-full blur-[1px]"
                      style={{ backgroundColor: centerData.color }}
                    />
                  )}
                </div>
                
                <DonutCenterCounter value={centerData.value} color={centerData.color} />
                
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5 whitespace-nowrap">
                  {centerData.label}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Legend list with Interactive Highlights and Animated Progress Tracks */}
      <div className="flex-1 space-y-2.5 w-full">
        {data.length === 0 ? (
          <p className="text-[10px] text-slate-400 font-bold uppercase text-center py-4">
            No submissions registered
          </p>
        ) : (
          data.map((item, idx) => {
            const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
            const isHovered = activeIndex === idx;

            return (
              <motion.div
                key={item.name}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={legendVariants}
                onMouseEnter={(e) => handleMouseEnter(e, idx)}
                onMouseLeave={handleMouseLeave}
                className={`flex flex-col gap-1.5 p-2 px-3.5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  isHovered 
                    ? 'bg-slate-50/90 border-slate-200 shadow-sm translate-x-1.5' 
                    : 'border-transparent hover:bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300" 
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: isHovered ? `0 0 10px ${item.color}` : 'none',
                        transform: isHovered ? 'scale(1.25)' : 'scale(1)'
                      }} 
                    />
                    <span className={`text-xs font-bold transition-colors duration-300 ${
                      isHovered ? 'text-slate-800 font-extrabold' : 'text-slate-500'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-1 text-right font-extrabold text-xs text-slate-800">
                    <span>{item.value}</span>
                    <span className="text-[9px] text-slate-400 font-medium">({percent}%)</span>
                  </div>
                </div>

                {/* Animated progress track for visual density */}
                <div className="h-1.5 w-full bg-slate-100/80 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${item.color}cc, ${item.color})`,
                      boxShadow: isHovered ? `0 0 6px ${item.color}60` : 'none'
                    }}
                  />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default RequestShareChart;
