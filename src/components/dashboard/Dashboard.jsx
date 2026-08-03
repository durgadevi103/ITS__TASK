import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Users,
  UserPlus,
  Building2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit,
  Trash,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Activity,
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  Filter,
  BarChart3,
  LineChart as LineChartIcon,
  Plus,
  Download,
  Check,
  ChevronUp,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';

import api from '../../api/axios';

// Animated Number Counter Component
const AnimatedCounter = ({ value, duration = 1.2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const incrementTime = 20;
    const steps = totalMiliseconds / incrementTime;
    const stepValue = (end - start) / steps;

    let current = start;
    const timer = setInterval(() => {
      current += stepValue;
      if ((stepValue > 0 && current >= end) || (stepValue < 0 && current <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// 3D Tilt Card with Mouse-Following Radial Spotlight
const TiltSpotlightCard = ({ children, className = "", spotlightColor = "rgba(59, 130, 246, 0.15)" }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const pctX = mouseX / width - 0.5;
    const pctY = mouseY / height - 0.5;

    x.set(pctX);
    y.set(pctY);

    setMousePosition({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {/* Spotlight Radial Overlay */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 40%)`
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext() || {};
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [newHiresCount, setNewHiresCount] = useState(0);
  const [deptCount, setDeptCount] = useState(0);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);
  const [tableFilter, setTableFilter] = useState('All'); // 'All' | 'New Hire' | 'Promoted'
  const [timeframe, setTimeframe] = useState('Last 7 Days');
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'
  const [expandedRow, setExpandedRow] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live stats from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let employeesList = [];

        // Fetch employees
        try {
          const empRes = await api.get('/employee/list');
          if (empRes.data.success && empRes.data.list) {
            employeesList = empRes.data.list;
            setEmployees(employeesList);
            setEmployeeCount(employeesList.length);

            const recentNum = Math.min(5, employeesList.length);
            setNewHiresCount(recentNum);
          }
        } catch (err) {
          console.error("Error fetching employees", err);
        }

        // Fetch departments
        try {
          const deptRes = await api.get('/department/list/100/0');
          const listData = deptRes.data.data || deptRes.data.list;
          if (deptRes.data.success && listData) {
            setDepartments(listData);
            setDeptCount(listData.length);
          } else {
            const deptResAlt = await api.get('/department/list');
            const listDataAlt = deptResAlt.data.list || deptResAlt.data.data;
            if (deptResAlt.data.success && listDataAlt) {
              setDepartments(listDataAlt);
              setDeptCount(listDataAlt.length);
            }
          }
        } catch (err) {
          console.error("Error fetching departments", err);
          const local = sessionStorage.getItem('departmentsData');
          if (local) {
            const parsed = JSON.parse(local);
            setDepartments(parsed);
            setDeptCount(parsed.length);
          } else {
            setDeptCount(3);
          }
        }

        // Generate recent updates
        if (employeesList.length > 0) {
          const sorted = [...employeesList].sort((a, b) => b.employee_id - a.employee_id);
          const today = new Date();
          const mappedUpdates = sorted.slice(0, 5).map((emp, idx) => ({
            id: emp.employee_id,
            name: emp.emp_name,
            email: emp.emp_email || `${emp.emp_name.toLowerCase().replace(/\s+/g, '')}@company.com`,
            phone: emp.emp_ph_no || '9876543210',
            department: emp.emp_dept || 'General',
            position: emp.emp_designation || emp.emp_desigation || 'Executive',
            date: new Date(today.getTime() - idx * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: idx % 2 === 0 ? 'New Hire' : 'Promoted',
            avatar: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.emp_name)}&background=2563eb&color=fff&bold=true`
          }));
          setRecentUpdates(mappedUpdates);
        } else {
          setRecentUpdates([
            { id: 1, name: 'Jane Doe', email: 'jane.doe@company.com', phone: '9876543210', department: 'Marketing', position: 'Marketing Specialist', date: 'May 15, 2025', status: 'New Hire' },
            { id: 2, name: 'Mike Smith', email: 'mike.smith@company.com', phone: '9876543211', department: 'Finance', position: 'Financial Analyst', date: 'May 16, 2025', status: 'Promoted' },
            { id: 3, name: 'Sarah Jenkins', email: 'sarah.j@company.com', phone: '9876543212', department: 'IT', position: 'Senior Developer', date: 'May 17, 2025', status: 'New Hire' }
          ]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data from backend", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Department statistics
  const deptStats = useMemo(() => {
    if (employees.length === 0) return [];
    const counts = {};
    employees.forEach(emp => {
      const dName = emp.emp_dept || 'General';
      counts[dName] = (counts[dName] || 0) + 1;
    });

    return Object.keys(counts).map(name => ({
      name,
      count: counts[name],
      percentage: Math.round((counts[name] / employees.length) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [employees]);

  // Attendance chart points
  const chartDays = [
    { day: 'Sat', x: 70, presentY: 140, absentY: 130, presentPct: 78, absentPct: 22, barH: 100 },
    { day: 'Sun', x: 170, presentY: 190, absentY: 70, presentPct: 42, absentPct: 58, barH: 50 },
    { day: 'Mon', x: 270, presentY: 120, absentY: 130, presentPct: 86, absentPct: 14, barH: 120 },
    { day: 'Tue', x: 370, presentY: 55, absentY: 130, presentPct: 98, absentPct: 2, barH: 150 },
    { day: 'Wed', x: 470, presentY: 80, absentY: 150, presentPct: 92, absentPct: 8, barH: 135 },
    { day: 'Thu', x: 570, presentY: 140, absentY: 85, presentPct: 75, absentPct: 25, barH: 95 },
    { day: 'Fri', x: 660, presentY: 180, absentY: 110, presentPct: 60, absentPct: 40, barH: 70 },
  ];

  // Filtered Table Updates
  const filteredUpdates = useMemo(() => {
    const hasSearchQuery = searchQuery && searchQuery.trim();

    // Map all employees to the update format for searching, or use recentUpdates if not searching
    let baseList = [];
    if (hasSearchQuery) {
      if (employees.length > 0) {
        const sorted = [...employees].sort((a, b) => b.employee_id - a.employee_id);
        const today = new Date();
        baseList = sorted.map((emp, idx) => ({
          id: emp.employee_id,
          name: emp.emp_name,
          email: emp.emp_email || `${emp.emp_name.toLowerCase().replace(/\s+/g, '')}@company.com`,
          phone: emp.emp_ph_no || '9876543210',
          department: emp.emp_dept || 'General',
          position: emp.emp_designation || emp.emp_desigation || 'Executive',
          date: new Date(today.getTime() - idx * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: idx % 2 === 0 ? 'New Hire' : 'Promoted',
          avatar: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.emp_name)}&background=2563eb&color=fff&bold=true`
        }));
      } else {
        baseList = recentUpdates;
      }
    } else {
      baseList = recentUpdates;
    }

    let list = baseList;
    if (tableFilter !== 'All') {
      list = list.filter(item => item.status === tableFilter);
    }
    if (hasSearchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.department && item.department.toLowerCase().includes(q)) ||
        (item.position && item.position.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q))
      );
    }
    return list;
  }, [recentUpdates, employees, tableFilter, searchQuery]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-3 bg-slate-50/60 h-[calc(100vh-4.2rem)] space-y-3 sm:space-y-4 text-slate-800 overflow-y-auto"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Header with Dynamic Shimmer Gradient */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-7 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        {/* Decorative Motion Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -bottom-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
              Executive Dashboard
            </h1>
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="p-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-amber-300 inline-block shadow-xs"
            >
              <Sparkles size={18} />
            </motion.span>
          </div>
          <p className="text-xs text-blue-200/80 font-medium max-w-lg">
            Real-time workforce statistics, automated department ratios, and live attendance metrics.
          </p>
        </div>

        {/* Quick Actions Floating Toolbar & Clock */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/add-employee')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Staff</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => showToast("Exporting Analytics Report PDF...")}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Download size={15} />
            <span>Export</span>
          </motion.button>

          {/* Live System Time */}
          <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs font-bold text-blue-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Clock size={14} className="text-blue-300" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Row - 3D Tilt Cards with Progress Rings */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

        {/* Metric 1: Total Staff */}
        <motion.div variants={itemVariants}>
          <TiltSpotlightCard spotlightColor="rgba(59, 130, 246, 0.18)" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Staff</span>
              <div className="relative w-11 h-11 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#eff6ff" strokeWidth="3.5" />
                  <motion.circle
                    initial={{ strokeDasharray: "0 113" }}
                    animate={{ strokeDasharray: "90 113" }}
                    transition={{ duration: 1.5 }}
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                <Users size={17} className="text-blue-600 absolute" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">
                  <AnimatedCounter value={employeeCount} />
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">Active headcount</span>
              </div>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                <TrendingUp size={11} />
                +5.2%
              </span>
            </div>
          </TiltSpotlightCard>
        </motion.div>

        {/* Metric 2: New Hires */}
        <motion.div variants={itemVariants}>
          <TiltSpotlightCard spotlightColor="rgba(16, 185, 129, 0.18)" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">New Hires</span>
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#ecfdf5" strokeWidth="3.5" />
                  <motion.circle
                    initial={{ strokeDasharray: "0 113" }}
                    animate={{ strokeDasharray: "80 113" }}
                    transition={{ duration: 1.5 }}
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                <UserPlus size={17} className="text-emerald-600 absolute" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">
                  <AnimatedCounter value={newHiresCount} />
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">This month</span>
              </div>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                <TrendingUp size={11} />
                +10%
              </span>
            </div>
          </TiltSpotlightCard>
        </motion.div>

        {/* Metric 3: Departments */}
        <motion.div variants={itemVariants}>
          <TiltSpotlightCard spotlightColor="rgba(168, 85, 247, 0.18)" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Departments</span>
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#faf5ff" strokeWidth="3.5" />
                  <motion.circle
                    initial={{ strokeDasharray: "0 113" }}
                    animate={{ strokeDasharray: "100 113" }}
                    transition={{ duration: 1.5 }}
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                <Building2 size={17} className="text-purple-600 absolute" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">
                  <AnimatedCounter value={deptCount} />
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">Active divisions</span>
              </div>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                <Layers size={11} />
                Stable
              </span>
            </div>
          </TiltSpotlightCard>
        </motion.div>

        {/* Metric 4: On-Time Arrival Rate */}
        <motion.div variants={itemVariants}>
          <TiltSpotlightCard spotlightColor="rgba(245, 158, 11, 0.18)" className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">On-Time Rate</span>
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#fffbeb" strokeWidth="3.5" />
                  <motion.circle
                    initial={{ strokeDasharray: "0 113" }}
                    animate={{ strokeDasharray: "110 113" }}
                    transition={{ duration: 1.5 }}
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                <Zap size={17} className="text-amber-600 absolute" />
              </div>
            </div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">
                  98.4%
                </span>
                <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">Daily average</span>
              </div>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200/80">
                <CheckCircle2 size={11} />
                High
              </span>
            </div>
          </TiltSpotlightCard>
        </motion.div>

      </motion.div>

      {/* Charts Grid - With Mode Toggle (Line vs Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Interactive Chart Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs lg:col-span-2 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Activity size={18} className="text-emerald-500 animate-pulse" />
                Attendance Analytics
              </h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Move cursor over graph to inspect daily present/absent data</p>
            </div>

            {/* Chart Type Toggle & Timeframe */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${chartType === 'line' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  title="Line View"
                >
                  <LineChartIcon size={15} />
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${chartType === 'bar' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  title="Bar View"
                >
                  <BarChart3 size={15} />
                </button>
              </div>

              <div className="relative hidden sm:block">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="bg-slate-50 hover:bg-slate-100 text-[10px] font-extrabold text-slate-700 pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 outline-none transition cursor-pointer appearance-none"
                >
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
                <ChevronDown size={12} className="text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="relative w-full h-64 pt-6 select-none">

            {/* Tooltip Card */}
            <AnimatePresence>
              {hoveredDay && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{ left: `${(hoveredDay.x / 700) * 100}%` }}
                  className="absolute top-2 -translate-x-1/2 z-30 bg-slate-950 text-white p-3 rounded-2xl shadow-2xl border border-slate-800 pointer-events-none text-center min-w-[130px] backdrop-blur-md"
                >
                  <p className="text-[11px] font-black text-blue-400 border-b border-slate-800 pb-1 mb-1.5 uppercase tracking-wider">
                    {hoveredDay.day} Attendance
                  </p>
                  <div className="space-y-1 text-[11px] font-bold">
                    <div className="flex justify-between items-center text-emerald-400">
                      <span>Present:</span>
                      <span>{hoveredDay.presentPct}%</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-400">
                      <span>Absent:</span>
                      <span>{hoveredDay.absentPct}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              <line x1="50" y1="20" x2="670" y2="20" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="50" y1="60" x2="670" y2="60" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="50" y1="100" x2="670" y2="100" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="50" y1="140" x2="670" y2="140" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="50" y1="180" x2="670" y2="180" stroke="#f1f5f9" strokeDasharray="4" />

              {/* Y Axis */}
              <text x="30" y="24" className="text-[10px] font-extrabold fill-slate-400">100%</text>
              <text x="30" y="64" className="text-[10px] font-extrabold fill-slate-400">80%</text>
              <text x="30" y="104" className="text-[10px] font-extrabold fill-slate-400">50%</text>
              <text x="30" y="144" className="text-[10px] font-extrabold fill-slate-400">30%</text>
              <text x="30" y="184" className="text-[10px] font-extrabold fill-slate-400">10%</text>

              {/* Interactive Guideline */}
              {hoveredDay && (
                <line
                  x1={hoveredDay.x}
                  y1="20"
                  x2={hoveredDay.x}
                  y2="210"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* X Axis Labels */}
              {chartDays.map((d) => (
                <text
                  key={d.day}
                  x={d.x}
                  y="235"
                  textAnchor="middle"
                  className={`text-[11px] font-black cursor-pointer transition-colors duration-150 ${hoveredDay?.day === d.day ? 'fill-blue-600' : 'fill-slate-400'
                    }`}
                >
                  {d.day}
                </text>
              ))}

              {/* Line View Rendering */}
              {chartType === 'line' ? (
                <>
                  <path
                    d="M 70 140 C 120 120, 150 180, 170 190 C 220 210, 250 140, 270 130 C 320 110, 350 70, 370 65 C 420 50, 450 70, 470 90 C 520 130, 550 160, 570 150 C 620 130, 640 180, 660 190 L 660 210 L 70 210 Z"
                    fill="url(#gradPresent)"
                  />
                  <path
                    d="M 70 130 C 120 110, 150 75, 170 70 C 220 65, 250 110, 270 130 C 320 160, 350 135, 370 130 C 420 120, 450 150, 470 150 C 520 150, 550 100, 570 85 C 620 50, 640 85, 660 110 L 660 210 L 70 210 Z"
                    fill="url(#gradAbsent)"
                  />

                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    d="M 70 130 C 120 110, 150 75, 170 70 C 220 65, 250 110, 270 130 C 320 160, 350 135, 370 130 C 420 120, 450 150, 470 150 C 520 150, 550 100, 570 85 C 620 50, 640 85, 660 110"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
                    d="M 70 140 C 120 120, 150 180, 170 190 C 220 210, 250 140, 270 130 C 320 110, 350 70, 370 65 C 420 50, 450 70, 470 90 C 520 130, 550 160, 570 150 C 620 130, 640 180, 660 190"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {chartDays.map((d) => (
                    <g
                      key={d.day}
                      onMouseEnter={() => setHoveredDay(d)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={d.x}
                        cy={d.presentY}
                        r={hoveredDay?.day === d.day ? "8" : "5"}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-200"
                      />
                      <circle
                        cx={d.x}
                        cy={d.absentY}
                        r={hoveredDay?.day === d.day ? "8" : "5"}
                        fill="#f43f5e"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="transition-all duration-200"
                      />
                    </g>
                  ))}
                </>
              ) : (
                /* Bar View Rendering */
                <g>
                  {chartDays.map((d, idx) => (
                    <g
                      key={d.day}
                      onMouseEnter={() => setHoveredDay(d)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="cursor-pointer"
                    >
                      <motion.rect
                        initial={{ height: 0, y: 210 }}
                        animate={{ height: d.barH, y: 210 - d.barH }}
                        transition={{ duration: 0.8, delay: idx * 0.08 }}
                        x={d.x - 14}
                        width="28"
                        rx="6"
                        fill={hoveredDay?.day === d.day ? '#2563eb' : '#3b82f6'}
                        className="transition-colors duration-200"
                      />
                    </g>
                  ))}
                </g>
              )}
            </svg>


          </div>
        </motion.div>

        {/* Dynamic Department Donut Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-black text-slate-900 text-base">Department Ratio</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Staff distribution by division</p>
            </div>
          </div>

          {/* Animated Donut SVG */}
          <div className="relative flex items-center justify-center h-48 select-none my-2">
            <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="55" fill="none" stroke="#f1f5f9" strokeWidth="18" />

              {(() => {
                let accumulatedPercent = 0;
                const colors = ['#3b82f6', '#06b6d4', '#eab308', '#a855f7', '#ec4899', '#10b981', '#f97316'];
                return deptStats.map((stat, idx) => {
                  const pct = stat.percentage;
                  const strokeDasharray = `${(345.5 * pct) / 100} ${345.5 - (345.5 * pct) / 100}`;
                  const strokeDashoffset = -((345.5 * accumulatedPercent) / 100);
                  accumulatedPercent += pct;
                  const isHovered = hoveredDept?.name === stat.name;
                  return (
                    <motion.circle
                      key={stat.name}
                      initial={{ strokeDasharray: "0 345.5" }}
                      animate={{ strokeDasharray }}
                      transition={{ duration: 1.2, delay: idx * 0.15 }}
                      cx="80"
                      cy="80"
                      r="55"
                      fill="none"
                      stroke={colors[idx % colors.length]}
                      strokeWidth={isHovered ? "24" : "18"}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredDept(stat)}
                      onMouseLeave={() => setHoveredDept(null)}
                      className="cursor-pointer transition-all duration-200"
                    />
                  );
                });
              })()}
            </svg>

            {/* Center Stat */}
            <div className="absolute text-center">
              <AnimatePresence mode="wait">
                {hoveredDept ? (
                  <motion.div
                    key={hoveredDept.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="block text-2xl font-black text-blue-600 leading-none">{hoveredDept.percentage}%</span>
                    <span className="text-[10px] font-black text-slate-800 tracking-wider uppercase mt-1 block truncate max-w-[90px]">{hoveredDept.name}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="total"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="block text-3xl font-black text-slate-900 leading-none">{employeeCount}</span>
                    <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase mt-1 block">Staff</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Department Legend Chips */}
          <div className="grid grid-cols-3 text-center gap-1.5 mt-2">
            {(() => {
              const colors = ['#3b82f6', '#06b6d4', '#eab308', '#a855f7', '#ec4899', '#10b981', '#f97316'];
              if (deptStats.length === 0) {
                return (
                  <div className="col-span-3 text-slate-400 text-[10px] font-bold">
                    No department data
                  </div>
                );
              }
              return deptStats.slice(0, 3).map((stat, idx) => (
                <div
                  key={stat.name}
                  onMouseEnter={() => setHoveredDept(stat)}
                  onMouseLeave={() => setHoveredDept(null)}
                  className={`truncate p-1.5 rounded-xl border transition cursor-pointer ${hoveredDept?.name === stat.name ? 'bg-blue-50 border-blue-200' : 'bg-slate-50/50 border-slate-100'
                    }`}
                >
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 truncate max-w-full" title={stat.name}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: colors[idx % colors.length] }} />
                    {stat.name}
                  </span>
                  <span className="block text-xs font-black text-slate-900 mt-0.5">{stat.percentage}%</span>
                </div>
              ));
            })()}
          </div>
        </motion.div>

      </div>

      {/* Recent Activity Table Card with Expandable Rows & Gliding Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div>
            <h2 className="font-black text-slate-900 text-base">Recent Employee Updates</h2>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Click any row to expand details or manage employee profiles</p>
          </div>

          {/* Gliding Filter Pill Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto relative">
            {['All', 'New Hire', 'Promoted'].map((tab) => {
              const isActive = tableFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setTableFilter(tab)}
                  className="relative px-3 py-1 text-xs font-extrabold transition-colors cursor-pointer z-10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tableFilterPill"
                      className="absolute inset-0 bg-white rounded-lg shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-blue-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}>
                    {tab}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Viewport */}
        <div className="w-full overflow-x-auto select-none mt-3">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Position</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              <AnimatePresence mode="popLayout">
                {filteredUpdates.map((item, idx) => {
                  const isExpanded = expandedRow === item.id;
                  return (
                    <React.Fragment key={item.id || idx}>
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                        className={`hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer ${isExpanded ? 'bg-blue-50/30' : ''
                          }`}
                      >
                        {/* Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200/80 shadow-xs"
                            />
                            <div>
                              <span className="font-extrabold text-slate-900 block">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{item.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{item.department}</td>

                        {/* Position */}
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{item.position}</td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 font-semibold">{item.date}</td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wide ${item.status === 'New Hire'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs'
                              : 'bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs'
                            }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate('/employees')}
                              className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition cursor-pointer"
                              title="View Profile"
                            >
                              <Edit size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition cursor-pointer"
                              title="Toggle Details"
                            >
                              <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>

                      {/* Accordion Expanded Detail Drawer */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr className="bg-slate-50/60">
                            <td colSpan={6} className="p-0">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 border-t border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold"
                              >
                                <div className="flex items-center gap-6">
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Mail size={14} className="text-slate-400" />
                                    <span>{item.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Phone size={14} className="text-slate-400" />
                                    <span>{item.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Briefcase size={14} className="text-slate-400" />
                                    <span>{item.position} • {item.department}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/employees')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-xs transition cursor-pointer"
                                  >
                                    View Full Employee Card
                                  </motion.button>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;



