import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Search,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  CalendarDays,
  FileText,
  Check,
  X,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

// Animated sparkline drawing itself for visual aesthetic
const Sparkline = ({ strokeColor }) => (
  <svg className="w-16 h-8 opacity-45 shrink-0" viewBox="0 0 100 30" fill="none">
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.4, ease: "easeInOut" }}
      d="M0 25 Q15 5 30 18 T60 10 T90 20 L100 8"
      stroke={strokeColor}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// Smooth number counter component
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    const totalDuration = 800; // ms
    const increment = Math.ceil(end / 40) || 1;
    let stepTime = Math.abs(Math.floor(totalDuration / (end / increment)));
    stepTime = Math.max(12, Math.min(80, stepTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

// Premium Toast sub-component with countdown bar
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, x: 30 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: 30, transition: { duration: 0.25 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border overflow-hidden relative backdrop-blur-md ${toast.type === 'success'
          ? 'bg-emerald-50/95 border-emerald-100/80 text-emerald-800'
          : 'bg-rose-50/95 border-rose-100/80 text-rose-800'
        }`}
    >
      <div className="shrink-0 mt-0.5">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        ) : (
          <XCircle className="w-5 h-5 text-rose-600" />
        )}
      </div>
      <div className="flex-1 text-xs font-semibold leading-relaxed">
        {toast.message}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-650 transition cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Animated countdown indicator */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-0.5 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
      />
    </motion.div>
  );
};

const LeaveManagement = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [requests, setRequests] = useState([]);
  console.log("requests", requests)
  const [toasts, setToasts] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [empSearch, setEmpSearch] = useState('');
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const empRef = useRef(null);
  const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');

  // Table filter states
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [actionMenuId, setActionMenuId] = useState(null);


  // Helper for adding toast alerts
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // Fetch leave requests from backend
  const fetchLeaveRequests = async () => {
    try {
      const res = await api.get('/leave/get-list');
      console.log("API RESPONSE:", res.data.leavelist);
      if (res.data?.leavelist?.length) {
        setRequests(res.data.leavelist || []);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching leave requests from database", err);
      setRequests([]);
    }
  };

  // Fetch employees list from backend
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const res = await api.get('/employee/list/1000/0');
      if (res.data.success && res.data.list) {
        const mapped = res.data.list.map(emp => ({
          ...emp,
          employee_id: emp.emp_id || emp.employee_id,
          emp_name: emp.emp_name
        }));
        setEmployees(mapped);
        if (mapped.length > 0) {
          setSelectedEmpId(mapped[0].employee_id.toString());
        }
      }
    } catch (err) {
      console.error("Error fetching employees in Leave Manage", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0 && selectedEmpId) {
      const matched = employees.find(emp => emp.employee_id.toString() === selectedEmpId.toString());
      setEmpSearch(matched ? `${matched.emp_name} (ID: ${matched.employee_id})` : '');
    }
  }, [employees, selectedEmpId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (empRef.current && !empRef.current.contains(event.target)) {
        setShowEmpDropdown(false);
        const matched = employees.find(emp => emp.employee_id.toString() === selectedEmpId.toString());
        setEmpSearch(matched ? `${matched.emp_name} (ID: ${matched.employee_id})` : '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedEmpId, employees]);

  // Leave Balances computed dynamically
  const leaveBalances = useMemo(() => {
    const clUsed = requests
      .filter(r => r.leave_status === 'Approved' && r.leave_type?.includes('Casual'))
      .reduce((sum, r) => sum + (r.leave_days || 0), 0);
    const slUsed = requests
      .filter(r => r.leave_status === 'Approved' && r.leave_type?.includes('Sick'))
      .reduce((sum, r) => sum + (r.leave_days || 0), 0);
    const plUsed = requests
      .filter(r => r.leave_status === 'Approved' && r.leave_type?.includes('Privilege'))
      .reduce((sum, r) => sum + (r.leave_days || 0), 0);
    const mlUsed = requests
      .filter(r => r.leave_status === 'Approved' && r.leave_type?.includes('Maternity'))
      .reduce((sum, r) => sum + (r.leave_days || 0), 0);

    return {
      CL: { label: 'Casual Leave (CL)', used: clUsed, max: 12, color: 'bg-blue-600', gradient: 'from-blue-500 to-indigo-600', stroke: 'rgb(59, 130, 246)' },
      SL: { label: 'Sick Leave (SL)', used: slUsed, max: 12, color: 'bg-emerald-600', gradient: 'from-emerald-400 to-teal-600', stroke: 'rgb(16, 185, 129)' },
      PL: { label: 'Privilege Leave (PL)', used: plUsed, max: 20, color: 'bg-amber-500', gradient: 'from-amber-400 to-orange-500', stroke: 'rgb(245, 158, 11)' },
      ML: { label: 'Maternity Leave (ML)', used: mlUsed, max: 90, color: 'bg-purple-600', gradient: 'from-purple-500 to-pink-600', stroke: 'rgb(147, 51, 234)' }
    };
  }, [requests]);

  // Compute stats dynamically based on leaves list
  const stats = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter(r => r.leave_status === 'Approved').length;
    const pending = requests.filter(r => r.leave_status === 'Pending').length;
    const rejected = requests.filter(r => r.leave_status === 'Rejected').length;
    const approvedPct = total > 0 ? ((approved / total) * 100).toFixed(1) : '0.0';
    const pendingPct = total > 0 ? ((pending / total) * 100).toFixed(1) : '0.0';
    const rejectedPct = total > 0 ? ((rejected / total) * 100).toFixed(1) : '0.0';

    return {
      total,
      approved,
      pending,
      rejected,
      approvedPct,
      pendingPct,
      rejectedPct
    };
  }, [requests]);

  // Compute number of days between two dates
  const calculatedDays = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [fromDate, toDate]);

  // Handle leave application
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedEmpId && employees.length > 0) {
      showToast('Please select an employee.', 'error');
      return;
    }
    if (!fromDate || !toDate) {
      showToast('Please select both From and To dates.', 'error');
      return;
    }
    if (calculatedDays <= 0) {
      showToast('To date must be on or after From date.', 'error');
      return;
    }
    if (!reason.trim()) {
      showToast('Please provide a reason for the leave.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Get selected employee details
    let selectedEmp = null;
    if (employees.length > 0) {
      selectedEmp = employees.find(emp => emp.employee_id.toString() === selectedEmpId);
    }

    const newEmpName = selectedEmp ? selectedEmp.emp_name : '';

    const payload = {
      emp_id: selectedEmpId,
      emp_name: newEmpName,
      leave_type: leaveType,
      leave_from: fromDate,
      leave_to: toDate,
      leave_days: calculatedDays,
      leave_reason: reason,
      leave_status: 'Pending'
    };

    try {
      const res = await api.post('/leave/create', payload);
      if (res.data && res.data.success) {
        showToast('Leave request submitted successfully!', 'success');
        setFromDate('');
        setToDate('');
        setReason('');
        fetchLeaveRequests();
      } else {
        showToast('Failed to submit leave request to database.', 'error');
      }
    } catch (err) {
      console.error("Database save failed", err);
      showToast('Error saving leave request to database.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Perform actions on requests (Approve, Reject, Cancel)
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await api.put('/leave/status', { id: requestId, status: newStatus });
      if (res.data && res.data.success) {
        showToast(`Request ${newStatus.toLowerCase()} successfully!`, 'success');
        setActionMenuId(null);
        fetchLeaveRequests();
        // Sync selected request if in drawer
        if (selectedRequest && selectedRequest.leave_id === requestId) {
          setSelectedRequest(prev => ({ ...prev, leave_status: newStatus }));
        }
      } else {
        showToast(`Failed to update status in database.`, 'error');
      }
    } catch (err) {
      console.error("Database status change failed", err);
      showToast(`Error updating status in database.`, 'error');
    }
  };

  // Filtered requests based on search query and active tab
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesTab = activeTab === 'All' || req.leave_status === activeTab;
      const matchesSearch = req.emp_name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        req.emp_id?.toString().toLowerCase().includes(searchQuery?.toLowerCase()) ||
        req.leave_type?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        req.leave_reason?.toLowerCase().includes(searchQuery?.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage) || 1;
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredRequests.slice(start, end);
  }, [filteredRequests, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Framer Motion Animation Configs
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 18, stiffness: 120 }
    }
  };

  return (
    <div className="p-3 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] h-[calc(100vh-4.2rem)] text-slate-800 flex flex-col gap-3 select-none overflow-y-auto overflow-x-hidden relative">

      {/* Premium Floating Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-sm">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
          ))}
        </AnimatePresence>
      </div>

      {/* Unified Header & Filter Section */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        {/* Left Side: Breadcrumbs */}
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 leading-tight">Leaves</h1>
          <nav className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-1">
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-500">Leave Management</span>
          </nav>
        </div>

        {/* Right Side: Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end w-full">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs w-full">
            <Search size={14} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Leaves */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, shadow: "0 12px 30px rgba(0,0,0,0.06)" }}
          className="bg-white/85 border border-white/60 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.025)] backdrop-blur-md flex items-center justify-between transition-all duration-300"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Submissions</span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              <AnimatedNumber value={stats.total} />
            </div>
            <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-max">
              <TrendingUp className="w-3 h-3" /> 12% rise
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <CalendarDays className="w-5 h-5" />
            </div>
            <Sparkline strokeColor="#3b82f6" />
          </div>
        </motion.div>

        {/* Approved Leaves */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, shadow: "0 12px 30px rgba(0,0,0,0.06)" }}
          className="bg-white/85 border border-white/60 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.025)] backdrop-blur-md flex items-center justify-between transition-all duration-300"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Approved Leaves</span>
            <div className="text-3xl font-black text-emerald-600 tracking-tight">
              <AnimatedNumber value={stats.approved} />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full block w-max">
              {stats.approvedPct}% of total
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <Sparkline strokeColor="#10b981" />
          </div>
        </motion.div>

        {/* Pending Leaves */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, shadow: "0 12px 30px rgba(0,0,0,0.06)" }}
          className="bg-white/85 border border-white/60 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.025)] backdrop-blur-md flex items-center justify-between transition-all duration-300"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pending Review</span>
            <div className="text-3xl font-black text-amber-500 tracking-tight">
              <AnimatedNumber value={stats.pending} />
            </div>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full block w-max animate-pulse">
              {stats.pendingPct}% of total
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-50/70 border border-amber-100 text-amber-500 flex items-center justify-center shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <Sparkline strokeColor="#f59e0b" />
          </div>
        </motion.div>

        {/* Rejected Leaves */}
        <motion.div
          variants={cardVariants}
          whileHover={{ y: -4, shadow: "0 12px 30px rgba(0,0,0,0.06)" }}
          className="bg-white/85 border border-white/60 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.025)] backdrop-blur-md flex items-center justify-between transition-all duration-300"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rejected Leaves</span>
            <div className="text-3xl font-black text-rose-600 tracking-tight">
              <AnimatedNumber value={stats.rejected} />
            </div>
            <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full block w-max">
              {stats.rejectedPct}% of total
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-11 h-11 rounded-2xl bg-rose-50/70 border border-rose-100 text-rose-650 flex items-center justify-center shadow-inner">
              <XCircle className="w-5 h-5" />
            </div>
            <Sparkline strokeColor="#f43f5e" />
          </div>
        </motion.div>
      </motion.div>

      {/* Row 2: Form & Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="lg:col-span-8 bg-white/80 border border-white/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="border-b border-slate-100 pb-3 mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800 text-sm">Apply New Request</h2>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Submit leave parameters for review</p>
              </div>
              <FileText className="w-4 h-4 text-slate-350" />
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Employee choice */}
                <div className="flex flex-col relative" ref={empRef}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Employee Selection</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Search and select staff..."
                      value={empSearch}
                      onFocus={() => setShowEmpDropdown(true)}
                      onChange={(e) => {
                        setEmpSearch(e.target.value);
                        setShowEmpDropdown(true);
                        if (!e.target.value.trim()) {
                          setSelectedEmpId('');
                        }
                      }}
                      className="w-full bg-white border border-slate-200/90 rounded-2xl px-3 py-2.5 pr-8 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {empSearch ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEmpSearch('');
                          setSelectedEmpId('');
                          setShowEmpDropdown(true);
                        }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer text-base font-bold"
                      >
                        &times;
                      </button>
                    ) : (
                      <ChevronDown size={14} className="text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>

                  <AnimatePresence>
                    {showEmpDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-50 w-full top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-48 overflow-y-auto"
                      >
                        {loadingEmployees ? (
                          <div className="px-3.5 py-2.5 text-xs text-slate-400 font-bold">
                            Loading staff...
                          </div>
                        ) : employees.filter(emp => 
                          (emp.emp_name || '').toLowerCase().includes(empSearch.toLowerCase()) || 
                          (emp.employee_id || '').toString().toLowerCase().includes(empSearch.toLowerCase())
                        ).length === 0 ? (
                          <div className="px-3.5 py-2.5 text-xs text-slate-400 font-bold">
                            No Staff Found
                          </div>
                        ) : (
                          employees.filter(emp => 
                            (emp.emp_name || '').toLowerCase().includes(empSearch.toLowerCase()) || 
                            (emp.employee_id || '').toString().toLowerCase().includes(empSearch.toLowerCase())
                          ).map((emp) => (
                            <button
                              key={emp.employee_id}
                              type="button"
                              onClick={() => {
                                setSelectedEmpId(emp.employee_id.toString());
                                setEmpSearch(`${emp.emp_name} (ID: ${emp.employee_id})`);
                                setShowEmpDropdown(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 text-xs transition duration-100 hover:bg-blue-50 hover:text-blue-600 font-bold cursor-pointer ${
                                String(selectedEmpId) === String(emp.employee_id) ? 'bg-blue-50/50 text-blue-600 font-black' : 'text-slate-700'
                              }`}
                            >
                              {emp.emp_name} (ID: {emp.employee_id})
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Leave category */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Leave Type</label>
                  <div className="relative">
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full bg-white border border-slate-200/90 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
                    >
                      <option>Casual Leave (CL)</option>
                      <option>Sick Leave (SL)</option>
                      <option>Privilege Leave (PL)</option>
                      <option>Maternity Leave (ML)</option>
                    </select>
                    <ChevronDown size={14} className="text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Dates pickers */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 flex flex-col">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">From</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full bg-white border border-slate-200/90 rounded-2xl px-2.5 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="col-span-1 flex flex-col">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">To</label>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full bg-white border border-slate-200/90 rounded-2xl px-2.5 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Big animated calculated days tag */}
                  <div className="col-span-1 flex flex-col items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-center block w-full">Days</label>
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={calculatedDays}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ type: "spring", damping: 10, stiffness: 200 }}
                        className={`w-full text-center py-2 rounded-2xl text-xs font-black border transition-all duration-300 ${calculatedDays > 0
                            ? 'bg-blue-50/70 text-blue-600 border-blue-100 shadow-sm shadow-blue-500/5'
                            : 'bg-slate-50 text-slate-400 border-slate-100'
                          }`}
                      >
                        {calculatedDays}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

              </div>

              {/* Text reason */}
              <div className="flex flex-col">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Detailed Reason</label>
                <textarea
                  placeholder="Explain details of requested time off..."
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white border border-slate-200/90 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none shadow-inner"
                />
              </div>
            </form>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 mt-5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyLeave}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed glossy-shine"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={13} />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </motion.button>
          </div>
        </motion.div>

        {/* Balance cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="lg:col-span-4 bg-white/80 border border-white/60 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h2 className="font-bold text-slate-800 text-sm">Leave Allowances</h2>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Assigned quota for active year</p>
              </div>
              <div className="relative">
                <select className="bg-slate-50 border border-slate-200/80 rounded-xl pl-3 pr-7 py-1 text-[10px] font-black text-slate-650 outline-none hover:bg-slate-100 transition-colors duration-200 cursor-pointer appearance-none">
                  <option>2026-27</option>
                  <option>2025-26</option>
                </select>
                <ChevronDown size={11} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* List with progressive fill bars */}
            <div className="space-y-4.5">
              {Object.keys(leaveBalances).map(key => {
                const bal = leaveBalances[key];
                const percentage = Math.min(100, (bal.used / bal.max) * 100);
                return (
                  <motion.div
                    key={key}
                    className="space-y-2 p-1.5 hover:bg-slate-50/50 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <span className={`w-2 h-2 rounded-full ${bal.color}`} /> {bal.label}
                      </div>
                      <span className="font-black text-slate-900 tracking-tight">{bal.used} / {bal.max} <span className="text-[10px] text-slate-400 font-semibold">Days</span></span>
                    </div>
                    {/* Linear progressive bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${bal.gradient}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>


        </motion.div>

      </div>

      {/* Row 3: Request History */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 22 }}
        className="bg-white/80 border border-white/60 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] backdrop-blur-md flex flex-col justify-between"
      >

        {/* Table Title & Filter Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-4">

          {/* Tabs Filter */}
          <div className="flex gap-1.5 p-1 bg-slate-100/70 border border-slate-200/30 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-none max-w-max">
            {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-1.5 px-3.5 text-xs font-black rounded-xl transition duration-300 cursor-pointer ${activeTab === tab
                    ? 'text-blue-650'
                    : 'text-slate-500 hover:text-slate-750'
                  }`}
              >
                {/* layoutId creates a beautifully fluid sliding background pill */}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-white shadow-sm border border-slate-200/30 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Table Actions (Export) */}
          <div className="flex items-center gap-2 self-end">

            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black px-3.5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/10 cursor-pointer hover:scale-102">
              <Download size={12} /> Export
            </button>
          </div>

        </div>

        {/* Table Viewport */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">From</th>
                <th className="py-3.5 px-4">To</th>
                <th className="py-3.5 px-4 text-center">Days</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Applied On</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
              <AnimatePresence mode="popLayout">
                {currentTableData.length > 0 ? (
                  currentTableData.map((req, index) => (
                    <motion.tr
                      key={req.leave_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.22, delay: index * 0.04 }}
                      className="hover:bg-slate-50/50 transition-colors duration-150 cursor-pointer border-b border-slate-100/50 group"
                      onClick={() => setSelectedRequest(req)}
                    >
                      {/* Employee Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.emp_name)}&background=2563eb&color=fff&bold=true`}
                            alt={req.emp_name}
                            className="w-8.5 h-8.5 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                          />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-900 block group-hover:text-blue-600 transition-colors duration-150">{req.emp_name}</span>
                            <span className="text-[9.5px] text-slate-400 font-bold block mt-0.5">{req.emp_id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {req.leave_type}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 font-bold text-slate-600">{req.leave_from}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-600">{req.leave_to}</td>

                      {/* Total Days */}
                      <td className="py-3.5 px-4 font-black text-slate-900 text-center">{req.leave_days}</td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-[200px] truncate font-medium text-slate-500" title={req.reason}>
                        {req.leave_reason}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-black inline-flex items-center gap-1.5 border ${req.leave_status === 'Approved'
                            ? 'bg-emerald-50/70 text-emerald-600 border-emerald-100/50'
                            : req.leave_status === 'Pending'
                              ? 'bg-amber-50/70 text-amber-600 border-amber-100/50'
                              : req.leave_status === 'Rejected'
                                ? 'bg-rose-50/70 text-rose-600 border-rose-100/50'
                                : 'bg-slate-100/80 text-slate-500 border-slate-200/50'
                          }`}>
                          <span className={`w-1 h-1 rounded-full ${req.leave_status === 'Approved' ? 'bg-emerald-500' :
                              req.leave_status === 'Pending' ? 'bg-amber-500' :
                                req.leave_status === 'Rejected' ? 'bg-rose-500' : 'bg-slate-400'
                            }`} />
                          {req.leave_status}
                        </span>
                      </td>

                      {/* Applied date */}
                      <td className="py-3.5 px-4 font-bold text-slate-400">{req.applied_date}</td>

                      {/* Actions Menu */}
                      <td className="py-3.5 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActionMenuId(actionMenuId === req.leave_id ? null : req.leave_id)}
                          className="p-1.5 hover:bg-slate-100/70 text-slate-400 hover:text-slate-700 rounded-xl transition-all duration-150"
                        >
                          <MoreVertical size={14} />
                        </motion.button>

                        {/* Custom Dropdown Menu with Scale-Fade entrance */}
                        <AnimatePresence>
                          {actionMenuId === req.leave_id && (
                            <motion.div
                              initial={{ scale: 0.94, opacity: 0, y: -5 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0.94, opacity: 0, y: -5 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-6 mt-1.5 w-32 bg-white/95 border border-slate-100 rounded-2xl shadow-xl py-1.5 z-40 text-left backdrop-blur-md"
                            >
                              {req.leave_status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(req.leave_id, 'Approved')}
                                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50/50 transition-colors duration-150"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(req.leave_id, 'Rejected')}
                                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-colors duration-150"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {(req.leave_status === 'Pending' || req.leave_status === 'Approved') && (
                                <button
                                  onClick={() => handleStatusChange(req.leave_id, 'Cancelled')}
                                  className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors duration-150 border-t border-slate-50"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={() => setActionMenuId(null)}
                                className="w-full text-left px-3.5 py-1.5 text-[9.5px] font-black text-slate-400 hover:bg-slate-50 transition-colors duration-150"
                              >
                                Close Options
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>

                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="9" className="py-8 text-center text-slate-400 font-bold">
                      No leave requests found matching filters.
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Table Footer: Entries and Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-50 pt-4 mt-4">
            <span className="text-xs text-slate-400 font-bold">
              Showing {Math.min(filteredRequests.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredRequests.length, currentPage * rowsPerPage)} of {filteredRequests.length} entries
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer shadow-sm"
              >
                <ChevronLeft size={14} />
              </motion.button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer ${currentPage === idx + 1
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'border border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                >
                  {idx + 1}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer shadow-sm"
              >
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </div>
        )}

      </motion.div>

      {/* Floating Detailed View Drawer */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 pointer-events-auto"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white/95 backdrop-blur-md shadow-2xl border-l border-slate-100 z-50 overflow-y-auto pointer-events-auto flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Detailed View</span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">Leave Request Details</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-sm"
                  >
                    <X size={15} />
                  </motion.button>
                </div>

                {/* Profile card */}
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                    <img
                      src={selectedRequest.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.emp_name)}&background=2563eb&color=fff&bold=true`}
                      alt={selectedRequest.emp_name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                    />
                    <div className="leading-tight">
                      <h4 className="text-base font-black text-slate-900">{selectedRequest.emp_name}</h4>
                      <span className="text-xs font-bold text-slate-400 block mt-1">Employee ID: {selectedRequest.emp_id}</span>
                    </div>
                  </div>

                  {/* Leave details list */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Leave Category</span>
                        <span className="text-xs font-bold text-blue-650 block mt-1.5">{selectedRequest.leave_type}</span>
                      </div>
                      <div className="bg-slate-50/40 p-3 rounded-2xl border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Applied Date</span>
                        <span className="text-xs font-bold text-slate-650 block mt-1.5">{selectedRequest.applied_date}</span>
                      </div>
                    </div>

                    {/* Timeline card dates */}
                    <div className="bg-slate-50/40 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">From Date</span>
                        <span className="text-xs font-black text-slate-800">{selectedRequest.leave_from}</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <ChevronRight className="text-slate-350" size={16} />
                        <span className="bg-blue-100/60 text-blue-600 px-2.5 py-0.5 rounded-full text-[10px] font-black mt-1">
                          {selectedRequest.leave_days} {selectedRequest.leave_days === 1 ? 'day' : 'days'}
                        </span>
                      </div>

                      <div className="space-y-1 text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">To Date</span>
                        <span className="text-xs font-black text-slate-800">{selectedRequest.leave_to}</span>
                      </div>
                    </div>

                    {/* Reason block */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-1">Leave Reason</span>
                      <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-2xl text-xs font-bold italic text-slate-650 leading-relaxed shadow-sm">
                        "{selectedRequest.leave_reason}"
                      </div>
                    </div>

                    {/* Audit Progress Timeline */}
                    <div className="space-y-3.5 pt-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block pl-1">Request Audit Timeline</span>

                      <div className="relative border-l-2 border-slate-100 pl-5 ml-2.5 space-y-5 py-1">
                        {/* Step 1: Requested */}
                        <div className="relative">
                          <div className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-4 ring-emerald-50" />
                          <span className="text-[10px] font-black text-slate-800">Submitted</span>
                          <span className="text-[9.5px] text-slate-400 block font-semibold mt-0.5">Requested on {selectedRequest.applied_date} by employee</span>
                        </div>

                        {/* Step 2: Under Review */}
                        <div className="relative">
                          <div className={`absolute -left-[27px] top-0.5 w-3 h-3 rounded-full border-2 border-white ring-4 ${selectedRequest.leave_status === 'Pending'
                              ? 'bg-amber-500 ring-amber-50 animate-pulse'
                              : 'bg-emerald-500 ring-emerald-50'
                            }`} />
                          <span className="text-[10px] font-black text-slate-800">Manager Under Review</span>
                          <span className="text-[9.5px] text-slate-400 block font-semibold mt-0.5">Automatically routed for approvals</span>
                        </div>

                        {/* Step 3: Decision */}
                        <div className="relative">
                          <div className={`absolute -left-[27px] top-0.5 w-3 h-3 rounded-full border-2 border-white ring-4 ${selectedRequest.leave_status === 'Approved' ? 'bg-emerald-500 ring-emerald-50' :
                              selectedRequest.leave_status === 'Rejected' ? 'bg-rose-500 ring-rose-50' :
                                selectedRequest.leave_status === 'Cancelled' ? 'bg-slate-400 ring-slate-100' :
                                  'bg-slate-200 ring-slate-50'
                            }`} />
                          <span className="text-[10px] font-black text-slate-800">Decision Outcome</span>
                          <span className="text-[9.5px] text-slate-400 block font-semibold mt-0.5">
                            {selectedRequest.leave_status === 'Pending' && 'Awaiting final decision from administration'}
                            {selectedRequest.leave_status === 'Approved' && 'Approved by administrator'}
                            {selectedRequest.leave_status === 'Rejected' && 'Rejected by administrator'}
                            {selectedRequest.leave_status === 'Cancelled' && 'Request retracted/cancelled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions inside Drawer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {selectedRequest.leave_status === 'Pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleStatusChange(selectedRequest.leave_id, 'Approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md shadow-emerald-500/10 cursor-pointer flex items-center gap-1.5"
                      >
                        <Check size={14} /> Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleStatusChange(selectedRequest.leave_id, 'Rejected')}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md shadow-rose-500/10 cursor-pointer flex items-center gap-1.5"
                      >
                        <X size={14} /> Reject
                      </motion.button>
                    </>
                  )}
                  {(selectedRequest.leave_status === 'Pending' || selectedRequest.leave_status === 'Approved') && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleStatusChange(selectedRequest.leave_id, 'Cancelled')}
                      className="border border-slate-200 hover:bg-slate-100 text-slate-650 px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer"
                    >
                      Cancel Request
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRequest(null)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-md"
                >
                  Close Drawer
                </motion.button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LeaveManagement;
