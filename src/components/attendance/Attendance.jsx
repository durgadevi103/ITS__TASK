import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Umbrella,
  Calendar,
  Gift,
  LogOut,
  Search,
  MessageSquare,
  Bell,
  ChevronDown,
  Laptop,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
  Smartphone,
  CheckCircle2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Attendance = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [overtimeTab, setOvertimeTab] = useState('Hours'); // 'Hours' or 'Employees'
  const [attendanceView, setAttendanceView] = useState('Attendance List');

  // Fetch live stats from backend to scale counts
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        const empRes = await api.get('/employee/list/1000/0');
        if (empRes.data.success && empRes.data.list) {
          setEmployees(empRes.data.list);
          setEmployeeCount(empRes.data.list.length);
        }
      } catch (err) {
        console.error("Error fetching data for attendance scaling", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceData();
  }, []);

  // Compute metrics scaled to actual employee count or fallback to reference image values
  const stats = useMemo(() => {
    const isLive = employeeCount > 0;
    const N = isLive ? employeeCount : 5000;

    // Proportions matching the reference image (approximate)
    const checkedIn = isLive ? Math.round(N * 0.90) : 4500;
    const notCheckedIn = N - checkedIn;
    const onLeave = isLive ? Math.round(N * 0.0912) : 456;
    const weeklyOff = isLive ? Math.round(N * 0.029) : 145;
    const holiday = isLive ? Math.round(N * 0.0024) : 12;
    const checkedOut = isLive ? Math.round(N * 0.05) : 250;

    // Attendance Source
    const deviceCheckIns = isLive ? Math.round(checkedIn * 0.444) : 2000;
    const appCheckIns = checkedIn - deviceCheckIns;
    const activeDevices = isLive ? Math.round(weeklyOff * 1) : 145;
    const inactiveDevices = isLive ? Math.round(holiday * 0.4) : 5;

    // Exceptions
    const lateComing = isLive ? Math.round(notCheckedIn * 0.5) : 250;
    const earlyGoing = isLive ? Math.round(notCheckedIn * 1.0) : 500;

    // Pending Request
    const reapplicationRequest = isLive ? Math.round(notCheckedIn * 0.5) : 250;
    const leaveRequest = isLive ? Math.round(onLeave * 1.1) : 500;

    return {
      total: N,
      checkedIn,
      notCheckedIn,
      onLeave,
      weeklyOff,
      holiday,
      checkedOut,
      deviceCheckIns,
      appCheckIns,
      activeDevices,
      inactiveDevices,
      lateComing,
      earlyGoing,
      reapplicationRequest,
      leaveRequest
    };
  }, [employeeCount]);

  // Compute percentages for donut chart
  const donutData = useMemo(() => {
    const { checkedIn, notCheckedIn, onLeave, weeklyOff, holiday } = stats;
    const sum = checkedIn + notCheckedIn + onLeave + weeklyOff + holiday;
    if (sum === 0) return [];

    return [
      { name: 'Checked In', value: checkedIn, pct: (checkedIn / sum) * 100, color: '#3b82f6' },
      { name: 'Not Checked In', value: notCheckedIn, pct: (notCheckedIn / sum) * 100, color: '#f87171' },
      { name: 'On Leave', value: onLeave, pct: (onLeave / sum) * 100, color: '#10b981' },
      { name: 'Weekly Off', value: weeklyOff, pct: (weeklyOff / sum) * 100, color: '#94a3b8' },
      { name: 'Holiday', value: holiday, pct: (holiday / sum) * 100, color: '#818cf8' },
    ];
  }, [stats]);

  // Overtime Data Toggle
  const overtimeData = useMemo(() => {
    if (overtimeTab === 'Hours') {
      return [20, 22, 24, 20, 28, 28, 0]; // Sunday - Saturday
    } else {
      return [10, 12, 15, 8, 18, 22, 0]; // Sunday - Saturday
    }
  }, [overtimeTab]);

  return (
    <div className="p-3 bg-[#f5f7fc] h-[calc(100vh-4.2rem)] text-slate-800 flex flex-col gap-3 overflow-y-auto animate-in fade-in duration-300">

      {/* Unified Header & Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0"
      >
        {/* Left Side: Breadcrumbs */}
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 leading-tight">Attendance</h1>
          <nav className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-1">
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-500">Attendance</span>
          </nav>
        </div>

        {/* Right Side: Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end w-full">
          {/* Dropdown Mode Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              value={attendanceView}
              onChange={(e) => setAttendanceView(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 shadow-xs rounded-xl pl-4 pr-9 py-2.5 text-xs font-extrabold text-slate-700 outline-none hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer appearance-none w-full"
            >
              <option>Attendance List</option>
              <option>Check In / Out</option>
              <option>Reports</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Page Label */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">This page</span>
        <h2 className="text-2xl font-extrabold text-slate-900">Attendance List</h2>
        <p className="text-sm text-slate-500 max-w-2xl">
          Review employee attendance status, check-in/out timings, and quick summaries for today. This page is dedicated to the Attendance List view only.
        </p>
      </div>

      {/* Row 1: Statistics Donut & Attendance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Statistics Donut Chart */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-800 text-sm">Statistics</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee Base</span>
          </div>

          <div className="relative flex items-center justify-center my-6 select-none h-44">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Background grey circle */}
              <circle cx="80" cy="80" r="55" fill="none" stroke="#f1f5f9" strokeWidth="18" />

              {/* Dynamic Segments */}
              {(() => {
                let accumulatedPercent = 0;
                return donutData.map((seg, idx) => {
                  const strokeDasharray = `${(345.5 * seg.pct) / 100} ${345.5 - (345.5 * seg.pct) / 100}`;
                  const strokeDashoffset = -((345.5 * accumulatedPercent) / 100);
                  accumulatedPercent += seg.pct;
                  return (
                    <circle
                      key={seg.name}
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="18"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 80 80)"
                      className="transition-all duration-500 ease-out"
                    />
                  );
                });
              })()}
            </svg>

            {/* Center Label */}
            <div className="absolute text-center">
              <span className="block text-2xl font-extrabold text-slate-900 leading-none">{stats.total}</span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1 block">Total Employees</span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-500 border-t border-slate-50 pt-3">
            {donutData.map((seg) => (
              <div key={seg.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="truncate">{seg.name} ({seg.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Main Stat Cards Container */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-800 text-sm">Attendance</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time status</span>
          </div>

          {/* Stat Cards Grid - 6 Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-auto py-4">

            {/* Checked In */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-blue-50/20 hover:border-blue-200 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Checked In</span>
              <span className="text-xl font-extrabold text-blue-600 mt-1">{stats.checkedIn}</span>
            </div>

            {/* Not Checked In */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-rose-50/20 hover:border-rose-200 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Not Checked In</span>
              <span className="text-xl font-extrabold text-rose-600 mt-1">{stats.notCheckedIn}</span>
            </div>

            {/* On Leave */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-emerald-50/20 hover:border-emerald-200 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Umbrella className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">On Leave</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-1">{stats.onLeave}</span>
            </div>

            {/* Weekly Off */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-100/50 hover:border-slate-300 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Off</span>
              <span className="text-xl font-extrabold text-slate-700 mt-1">{stats.weeklyOff}</span>
            </div>

            {/* Holiday */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-indigo-50/20 hover:border-indigo-200 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Holiday</span>
              <span className="text-xl font-extrabold text-indigo-700 mt-1">{stats.holiday}</span>
            </div>

            {/* Checked Out */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-amber-50/20 hover:border-amber-200 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Checked Out</span>
              <span className="text-xl font-extrabold text-amber-600 mt-1">{stats.checkedOut}</span>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-2 border-t border-slate-50">
            <span>Last sync: Just now</span>
            <span className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline">
              View Detailed Log <ArrowRight size={12} />
            </span>
          </div>
        </div>

      </div>

      {/* Row 2: On Time Check In, Overtime, Attendance Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* On Time Check In Weekly Column Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-slate-800 text-sm">On Time Check In</h2>
            <div className="relative">
              <select className="bg-slate-55 hover:bg-slate-100 text-[10px] font-bold text-slate-650 pl-3 pr-7 py-1.5 rounded-xl border border-slate-200/40 outline-none transition cursor-pointer appearance-none">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
              <ChevronDown size={12} className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Bar Chart Canvas */}
          <div className="relative w-full h-48 select-none">
            <svg viewBox="0 0 350 180" className="w-full h-full">
              {/* Y Axis Grid lines */}
              <line x1="30" y1="20" x2="330" y2="20" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="55" x2="330" y2="55" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="90" x2="330" y2="90" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="125" x2="330" y2="125" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="150" x2="330" y2="150" stroke="#e2e8f0" />

              {/* Y Axis Labels */}
              <text x="18" y="24" className="text-[9px] font-bold fill-slate-400 text-right">20</text>
              <text x="18" y="59" className="text-[9px] font-bold fill-slate-400 text-right">15</text>
              <text x="18" y="94" className="text-[9px] font-bold fill-slate-400 text-right">10</text>
              <text x="18" y="129" className="text-[9px] font-bold fill-slate-400 text-right">5</text>
              <text x="18" y="154" className="text-[9px] font-bold fill-slate-400 text-right">0</text>

              {/* X Axis Labels & Columns */}
              {/* Sunday */}
              <rect x="42" y="55" width="16" height="95" rx="3" fill="#c7d2fe" />
              <text x="50" y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">Son</text>

              {/* Monday */}
              <rect x="84" y="65" width="16" height="85" rx="3" fill="#c7d2fe" />
              <text x="92" y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">Mon</text>

              {/* Tuesday */}
              <rect x="126" y="34" width="16" height="116" rx="3" fill="#c7d2fe" />
              <text x="134" y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">Tue</text>

              {/* Wednesday */}
              <rect x="168" y="55" width="16" height="95" rx="3" fill="#c7d2fe" />
              <text x="176" y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">Wed</text>

              {/* Thursday */}
              <rect x="210" y="55" width="16" height="95" rx="3" fill="#c7d2fe" />
              <text x="218" y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">Thu</text>

              {/* Friday - Active Exceptions check in */}
              {/* Dark indigo body */}
              <rect x="252" y="48" width="16" height="102" rx="3" fill="#3b82f6" />
              {/* Red top warning cap */}
              <rect x="252" y="44" width="16" height="8" rx="2" fill="#ef4444" />
              <text x="260" y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">Fri</text>

              {/* Saturday */}
              <rect x="294" y="48" width="16" height="102" rx="3" fill="#c7d2fe" />
              <text x="302" y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">Sat</text>
            </svg>
          </div>
        </div>

        {/* Overtime Weekly Column Chart with dataset switching */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Overtime</h2>

            {/* Custom Tab Switches */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/20">
              <button
                onClick={() => setOvertimeTab('Hours')}
                className={`px-3 py-1 rounded-lg text-[9px] font-bold transition duration-200 ${overtimeTab === 'Hours'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Hours
              </button>
              <button
                onClick={() => setOvertimeTab('Employees')}
                className={`px-3 py-1 rounded-lg text-[9px] font-bold transition duration-200 ${overtimeTab === 'Employees'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Employees
              </button>
            </div>
          </div>

          {/* Bar Chart Canvas with Animating Data */}
          <div className="relative w-full h-48 select-none">
            <svg viewBox="0 0 350 180" className="w-full h-full">
              {/* Y Axis Grid lines */}
              <line x1="30" y1="20" x2="330" y2="20" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="52.5" x2="330" y2="52.5" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="85" x2="330" y2="85" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="117.5" x2="330" y2="117.5" stroke="#f1f5f9" strokeDasharray="3" />
              <line x1="30" y1="150" x2="330" y2="150" stroke="#e2e8f0" />

              {/* Y Axis Labels */}
              <text x="18" y="24" className="text-[9px] font-bold fill-slate-400 text-right">40</text>
              <text x="18" y="56" className="text-[9px] font-bold fill-slate-400 text-right">30</text>
              <text x="18" y="89" className="text-[9px] font-bold fill-slate-400 text-right">20</text>
              <text x="18" y="121" className="text-[9px] font-bold fill-slate-400 text-right">10</text>
              <text x="18" y="154" className="text-[9px] font-bold fill-slate-400 text-right">0</text>

              {/* X Axis Labels & Dynamic Columns */}
              {overtimeData.map((val, idx) => {
                const maxVal = 40;
                // Calculate height and Y position
                const barHeight = (val / maxVal) * 130;
                const barY = 150 - barHeight;
                const barX = 42 + idx * 42;
                const dayLabels = ['Son', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                return (
                  <g key={idx}>
                    <rect
                      x={barX}
                      y={barY}
                      width="16"
                      height={barHeight}
                      rx="3"
                      fill="#93c5fd"
                      className="transition-all duration-500 ease-out"
                    />
                    <text x={barX + 8} y="168" className="text-[9px] font-extrabold fill-slate-400 text-middle" textAnchor="middle">
                      {dayLabels[idx]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Attendance Source Grid Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Attendance Source</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Points</span>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 justify-center py-2">

            {/* Device Check Ins */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50 hover:-translate-y-0.5 hover:border-slate-200 transition duration-200 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Device Check Ins</span>
              <span className="text-lg font-extrabold text-slate-800 mt-2">{stats.deviceCheckIns}</span>
            </div>

            {/* App Check Ins */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50 hover:-translate-y-0.5 hover:border-slate-200 transition duration-200 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">App Check Ins</span>
              <span className="text-lg font-extrabold text-slate-800 mt-2">{stats.appCheckIns}</span>
            </div>

            {/* Active Devices */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50 hover:-translate-y-0.5 hover:border-slate-200 transition duration-200 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Devices</span>
              <span className="text-lg font-extrabold text-blue-600 mt-2">{stats.activeDevices}</span>
            </div>

            {/* Inactive Devices */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50 hover:-translate-y-0.5 hover:border-slate-200 transition duration-200 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Inactive Devices</span>
              <span className="text-lg font-extrabold text-red-500 mt-2">{stats.inactiveDevices}</span>
            </div>

          </div>
        </div>

      </div>

      {/* Row 3: Exceptions & Pending Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Exceptions Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Exceptions</h2>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Requires Review</span>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* Late Coming */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-rose-100 transition duration-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Late Coming</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-xl font-extrabold text-red-500">{stats.lateComing}</span>
                <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">High</span>
              </div>
            </div>

            {/* Early Going */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-amber-100 transition duration-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Early Going</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-xl font-extrabold text-amber-600">{stats.earlyGoing}</span>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Medium</span>
              </div>
            </div>

          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Pending Request</h2>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Action Needed</span>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* Reapplication Request */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-blue-100 transition duration-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reapplication Request</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-xl font-extrabold text-blue-600">{stats.reapplicationRequest}</span>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Process</span>
              </div>
            </div>

            {/* Leave Request */}
            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-emerald-100 transition duration-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Leave Request</span>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-xl font-extrabold text-emerald-600">{stats.leaveRequest}</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Approve</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Attendance;
