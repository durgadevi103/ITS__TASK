import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Tooltip with blur filter, fade, scale, and spring slides
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.92, y: 8, filter: 'blur(4px)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 26 }}
        className="bg-slate-950/90 backdrop-blur-xl p-4 border border-slate-800/80 rounded-2xl shadow-2xl text-white select-none pointer-events-none"
      >
        <p className="text-[9px] font-black tracking-widest text-blue-400 uppercase">
          {label} Leaves
        </p>
        <div className="mt-2 space-y-1.5 min-w-[120px]">
          <div className="flex justify-between items-baseline gap-4 text-xs font-bold">
            <span className="text-slate-400">Total Duration:</span>
            <span className="text-white text-sm font-black">{payload[0].value} d</span>
          </div>
          <div className="flex justify-between items-center gap-4 text-[9px] font-semibold text-slate-500">
            <span>Approved count:</span>
            <span>{payload[0].payload.requests}</span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

// Glowing pulse dot for coordinates
const CustomActiveDot = (props) => {
  const { cx, cy, stroke, value, index, totalPoints } = props;
  
  if (value === 0) return null;

  const isLatest = index === totalPoints - 1;

  return (
    <g>
      {/* Outer Halo glow circle */}
      <circle cx={cx} cy={cy} r={isLatest ? 12 : 9} fill={stroke} fillOpacity={0.15}>
        <animate
          attributeName="r"
          values={isLatest ? "8;16;8" : "6;10;6"}
          dur={isLatest ? "2s" : "3s"}
          repeatCount="indefinite"
        />
      </circle>
      <circle 
        cx={cx} 
        cy={cy} 
        r={4.5} 
        fill={stroke} 
        stroke="#ffffff" 
        strokeWidth={2} 
        style={{ filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))' }} 
      />
    </g>
  );
};

export const LeaveTrendChart = ({ requests = [] }) => {
  // Aggregate data points by month dynamically
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, idx) => {
      const currentYear = new Date().getFullYear();
      
      const filtered = requests.filter(r => {
        const d = new Date(r.leave_from);
        return d.getMonth() === idx && d.getFullYear() === currentYear && r.leave_status === 'Approved';
      });

      const daysCount = filtered.reduce((sum, r) => sum + (Number(r.leave_days) || 0), 0);
      
      return {
        month,
        days: daysCount,
        requests: filtered.length
      };
    });
  }, [requests]);

  // Find index of last month with actual approved leaves
  const lastActiveIndex = useMemo(() => {
    let lastIdx = -1;
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].days > 0) {
        lastIdx = i;
        break;
      }
    }
    return lastIdx;
  }, [chartData]);

  return (
    <div className="relative w-full h-[240px]">
      
      {/* Dynamic breathing gradient linear overlay definition */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 15, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="premiumTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}>
                {/* Breathing keyframe animation */}
                <animate attributeName="stop-opacity" values="0.25;0.12;0.25" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Dotted Grid lines */}
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />

          {/* X Axis */}
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700' }}
            dy={8}
          />

          {/* Y Axis */}
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '700' }}
            dx={-8}
          />

          {/* Custom guide line */}
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#2563eb', strokeWidth: 1.5, strokeDasharray: '4 4' }}
          />

          {/* Bezier curve Area */}
          <Area
            type="monotone"
            dataKey="days"
            stroke="#2563eb"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#premiumTrendGrad)"
            activeDot={(props) => (
              <CustomActiveDot 
                {...props} 
                totalPoints={chartData.length} 
                index={props.index} 
              />
            )}
            dot={{ r: 0 }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaveTrendChart;
