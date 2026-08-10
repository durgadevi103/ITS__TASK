import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';

const barFill = '#2563eb';
const barHoverFill = '#1d4ed8';
const accentGlow = '#3b82f6';
const topShade = '#93c5fd';
const sideShade = '#1e40af';
const axisTextColor = '#64748b';
const uniqueBarColors = ['#2563eb', '#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#64748b', '#0f172a'];

const CustomBar = (props) => {
  const {
    x,
    y,
    width,
    height,
    fill,
    index,
    isHovered,
    // Recharts custom properties to prevent React warnings
    stackedBarStart,
    tooltipPosition,
    parentViewBox,
    originalDataIndex,
    isActive,
    dataKey,
    animationElapsedTime,
    isAnimating,
    isEntrance,
    layout,
    background,
    radius,
    hide,
    ...gProps
  } = props;

  if (height <= 0 || width <= 0) {
    return null;
  }

  const depth = Math.max(7, Math.min(12, width * 0.18));
  const topHeight = Math.max(5, Math.min(8, height * 0.08));
  const colorIndex = index % uniqueBarColors.length;
  const baseColor = uniqueBarColors[colorIndex] || barFill;
  const hoverColor = isHovered ? '#0f172a' : baseColor;
  const mainFill = isHovered ? hoverColor : baseColor;
  const topFill = isHovered ? '#ffffff' : '#dbeafe';
  const sideFill = isHovered ? '#334155' : '#1d4ed8';

  return (
    <g {...gProps}>
      <rect
        x={x + width - depth}
        y={y + topHeight}
        width={depth}
        height={Math.max(height - topHeight, 0)}
        rx={6}
        fill={sideFill}
        opacity={0.9}
      />
      <rect
        x={x}
        y={y - topHeight}
        width={width}
        height={topHeight}
        rx={6}
        fill={topFill}
        opacity={0.95}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={mainFill}
        filter="url(#barShadow)"
      />
      <rect
        x={x + 2}
        y={y + 2}
        width={width - 4}
        height={Math.max(2, Math.min(6, height * 0.18))}
        rx={5}
        fill="rgba(255,255,255,0.24)"
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const value = Number(payload[0]?.value || 0);
  const requestCount = Number(payload[0]?.payload?.requests || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-lg shadow-slate-200/70 backdrop-blur"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value} {value === 1 ? 'day' : 'days'}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        {requestCount} approved request{requestCount === 1 ? '' : 's'}
      </p>
    </motion.div>
  );
};

const LoadingState = () => (
  <div className="flex h-full items-end justify-between gap-2 px-1 pb-2 pt-2">
    {Array.from({ length: 6 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ height: 24, opacity: 0.5 }}
        animate={{ height: [24, 90 + (index % 3) * 28, 24], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.3, repeat: Infinity, delay: index * 0.08, ease: 'easeInOut' }}
        className="w-full rounded-t-2xl bg-slate-200"
      />
    ))}
  </div>
);

export const LeaveTrendChart = ({ requests = [], isLoading = false, error = null }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const safeRequests = Array.isArray(requests) ? requests : [];

    return months.map((month, index) => {
      const filtered = safeRequests.filter((request) => {
        const leaveDate = new Date(request?.leave_from);

        return (
          !Number.isNaN(leaveDate.getTime()) &&
          leaveDate.getMonth() === index &&
          leaveDate.getFullYear() === currentYear &&
          request?.leave_status === 'Approved'
        );
      });

      const daysCount = filtered.reduce((sum, request) => sum + (Number(request?.leave_days) || 0), 0);

      return {
        month,
        days: Number(daysCount.toFixed(1)),
        requests: filtered.length,
      };
    });
  }, [requests]);

  const hasData = chartData.some((item) => item.days > 0);
  const maxValue = Math.max(...chartData.map((item) => item.days), 1);
  const yAxisMax = Math.max(10, Math.ceil(maxValue / 5) * 5);

  if (isLoading) {
    return (
      <div className="relative h-64 w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div className="mb-3 h-3 w-24 animate-pulse rounded-full bg-slate-200" />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-500">
        Unable to load leave data.
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-500">
        No data available
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 p-2 sm:p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 6, left: -10, bottom: 4 }}
        >
          <defs>
            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#3b82f6" floodOpacity="0.24" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: axisTextColor, fontSize: 11, fontWeight: 600 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: axisTextColor, fontSize: 10 }}
            width={34}
            domain={[0, yAxisMax]}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} />
          <Bar
            dataKey="days"
            maxBarSize={42}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
            shape={(props) => (
              <CustomBar
                {...props}
                isHovered={hoveredIndex === props.index}
                index={props.index}
              />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeaveTrendChart;
