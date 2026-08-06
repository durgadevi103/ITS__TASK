import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity } from 'lucide-react';

// Animated Ticker for Donut Center
const DonutCenterCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = Number(value) || 0;
    const duration = 1000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = progress * (2 - progress);
      setCount(Math.floor(eased * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return <span className="text-2xl font-black text-slate-800 tracking-tight">{count}</span>;
};

// Render sector with outward translation offset on hover
const renderActiveSector = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  // Calculate midpoint angle to offset segment outward
  const RADIAN = Math.PI / 180;
  const midAngle = (startAngle + endAngle) / 2;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  
  const shiftX = 4 * cos;
  const shiftY = 4 * sin;

  return (
    <g>
      <defs>
        <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <Sector
        cx={cx + shiftX}
        cy={cy + shiftY}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 2}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        filter="url(#activeGlow)"
        style={{ transition: 'all 0.2s ease' }}
      />
    </g>
  );
};

export const RequestShareChart = ({ stats, requests = [] }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const cancelledCount = requests.filter(r => r.leave_status === 'Cancelled').length;
  const total = (stats?.total_submissions || 0) + cancelledCount;

  // Prepare status distribution data
  const data = useMemo(() => {
    return [
      { name: 'Approved', value: stats?.approved_leaves || 0, color: '#10b981' },
      { name: 'Pending', value: stats?.pending_leaves || 0, color: '#f59e0b' },
      { name: 'Rejected', value: stats?.rejected_leaves || 0, color: '#ef4444' },
      { name: 'Cancelled', value: cancelledCount, color: '#64748b' }
    ].filter(item => item.value > 0);
  }, [stats, cancelledCount]);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  // Stagger entry configurations
  const legendVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.15,
        type: 'spring',
        stiffness: 260,
        damping: 22
      }
    })
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[170px] relative select-none">
      
      {/* Background radial lighting glow */}
      <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none" />

      {/* Donut Canvas */}
      <motion.div
        initial={{ rotate: -15, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative w-36 h-36 shrink-0"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveSector}
              data={data.length === 0 ? [{ name: 'Empty', value: 1, color: '#e2e8f0' }] : data}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={50}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              isAnimationActive={true}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {(data.length === 0 ? [{ name: 'Empty', value: 1, color: '#e2e8f0' }] : data).map((entry, index) => {
                const isHovered = activeIndex === index;
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: isHovered ? `drop-shadow(0 0 5px ${entry.color}88)` : 'none',
                      transition: 'all 0.25s ease'
                    }}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Floating count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="text-blue-500/30"
          >
            <Sparkles size={12} />
          </motion.div>
          <DonutCenterCounter value={total} />
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">
            Total Requests
          </span>
        </div>
      </motion.div>

      {/* Legend list */}
      <div className="flex-1 space-y-2 w-full">
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
                className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 ${
                  isHovered ? 'bg-slate-50 border-slate-200 shadow-sm scale-[1.01]' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200" 
                    style={{ 
                      backgroundColor: item.color,
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                    }} 
                  />
                  <span className={`text-xs font-bold transition-colors ${
                    isHovered ? 'text-slate-800 font-black' : 'text-slate-600'
                  }`}>{item.name}</span>
                </div>
                
                <div className="flex items-baseline gap-1 text-right font-extrabold text-xs">
                  <span className="text-slate-800">{item.value}</span>
                  <span className="text-[9px] text-slate-400">({percent}%)</span>
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
