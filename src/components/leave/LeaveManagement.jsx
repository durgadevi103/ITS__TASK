import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Clock, Send, XCircle, Trash2, CheckCircle2, Info, PlusCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { useLeave } from '../../hooks/useLeave';
import LeaveHeader from './LeaveHeader';
import LeaveTabs from './LeaveTabs';
import DashboardStatsGrid from './DashboardStatsGrid';
import LeaveTrendChart from './LeaveTrendChart';
import RequestShareChart from './RequestShareChart';
import LeaveTable from './LeaveTable';
import EmployeeCard from './EmployeeCard';
import ShiftSelector from './ShiftSelector';
import LeaveDatePicker from './LeaveDatePicker';
import LeaveTypeSelect from './LeaveTypeSelect';
import ReasonSelect from './ReasonSelect';
import PrioritySelect from './PrioritySelect';
import AttachmentUpload from './AttachmentUpload';
import CommentBox from './CommentBox';
import LeaveCalendar from './LeaveCalendar';
import HolidayCard from './HolidayCard';
import SummaryCard from './SummaryCard';
import LeaveButtons from './LeaveButtons';
import LeaveBalanceCard from './LeaveBalanceCard';
import { calculateLeaveDays, formatDate } from '../../utils/leaveUtils';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.99, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 18
    }
  }
};

const DEFAULT_MONTHLY_HOURS = 2.0;

export const LeaveManagement = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse current user session', e);
      }
    }
    return {
      emp_id: 1,
      employee_id: 1,
      emp_name: 'Durgadevi',
      fullName: 'Durgadevi',
      emp_email: 'durga@company.com',
      email: 'durga@company.com',
      emp_dept: 'Engineering',
      emp_designation: 'Senior Frontend Engineer',
      phone: '+91 98765 43210'
    };
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    loading,
    leaveRequests,
    dashboardStats,
    allowance,
    submitLeaveRequest,
    updateLeaveStatus,
    employees,
    fetchAllowance,
    fetchLeaveRequests,
    fetchDashboardStats
  } = useLeave(currentUser);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Refresh stats and requests when switching tabs
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
      fetchLeaveRequests();
      if (currentUser?.emp_id || currentUser?.employee_id) {
        fetchAllowance(currentUser.emp_id || currentUser.employee_id);
      }
    } else if (activeTab === 'history') {
      fetchLeaveRequests();
    } else if (activeTab === 'apply') {
      if (currentUser?.emp_id || currentUser?.employee_id) {
        fetchAllowance(currentUser.emp_id || currentUser.employee_id);
      }
    }
  }, [activeTab, fetchDashboardStats, fetchLeaveRequests, fetchAllowance, currentUser]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <LeaveDashboardView
            stats={dashboardStats}
            allowance={allowance}
            requests={leaveRequests}
            onUpdateStatus={updateLeaveStatus}
          />
        );
      case 'apply':
        return (
          <LeaveSubmitView
            currentUser={currentUser}
            allowance={allowance}
            onSubmitRequest={submitLeaveRequest}
            onCancel={() => setActiveTab('dashboard')}
            leaveRequests={leaveRequests}
            stats={dashboardStats}
            employees={employees}
            fetchAllowance={fetchAllowance}
          />
        );
      case 'history':
        return (
          <LeaveHistoryView
            requests={leaveRequests}
            onUpdateStatus={updateLeaveStatus}
            loading={loading}
          />
        );

      case 'permission':
        return <LeavePermissionView currentUser={currentUser} employees={employees} />;
      default:
        return (
          <div className="text-center py-20 font-semibold text-slate-400">
            View under construction.
          </div>
        );
    }
  };

  return (
    <div className="px-4 pb-4 bg-green-100 flex flex-col min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] overflow-hidden">
      <div className="sticky top-0 z-20 bg-green-50/95 backdrop-blur-xl border-b border-slate-200/70 py-2">
        <LeaveHeader
          title="Leave & Time-Off Management"
          activeTab={activeTab}
        />

        <div className="mt-5">
          <LeaveTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      <div className="mt-1.5 flex-1 pr-1 overflow-y-auto pb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const LeaveDashboardView = ({ stats = {}, allowance = [], requests = [], onUpdateStatus }) => {
  const recentRequests = requests.slice(0, 5);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 relative pb-0">
      <motion.div variants={sectionVariants}>
        <DashboardStatsGrid stats={stats} requests={requests} />
      </motion.div>

      <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -4, border: '1px solid rgba(37, 99, 235, 0.25)' }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-md lg:col-span-2 relative group hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">Leave Utilization Trend</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Approved Days Taken</p>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-full text-[9px] font-black text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>LIVE DATA</span>
            </div>
          </div>
          <LeaveTrendChart requests={requests} />
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col justify-between hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-xl"
        >
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">Request Share Distribution</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Approval Statuses</p>
          </div>
          <div className="my-auto py-2">
            <RequestShareChart stats={stats} requests={requests} />
          </div>
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

const LeaveSubmitView = ({ currentUser = {}, allowance = [], onSubmitRequest, onCancel, leaveRequests = [], stats = {}, employees = [], fetchAllowance }) => {
  const [empId, setEmpId] = useState(currentUser?.emp_id || currentUser?.employee_id || '');
  const [empName, setEmpName] = useState(currentUser?.emp_name || currentUser?.fullName || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (empId && fetchAllowance) {
      fetchAllowance(empId);
    }
  }, [empId, fetchAllowance]);

  const [shift, setShift] = useState('full');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveDays, setLeaveDays] = useState(0);
  const [leaveType, setLeaveType] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [priority, setPriority] = useState('medium');
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser?.phone || '');
  const [attachment, setAttachment] = useState(null);
  const [comments, setComments] = useState('');
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEmpId(currentUser.emp_id || currentUser.employee_id || '');
      setEmpName(currentUser.emp_name || currentUser.fullName || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (fromDate && toDate) {
      const days = calculateLeaveDays(fromDate, toDate);
      setLeaveDays(shift !== 'full' && days > 0 ? 0.5 : days);
    } else {
      setLeaveDays(0);
    }
  }, [fromDate, toDate, shift]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!declarationAccepted) {
      setErrorMessage('Please check the declaration box before submitting.');
      return;
    }
    if (leaveDays <= 0) {
      setErrorMessage('Please select a valid date range.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        emp_id: empId,
        emp_name: empName,
        leave_type: leaveType,
        leave_from: fromDate,
        leave_to: toDate,
        leave_days: leaveDays,
        leave_reason: `${leaveReason}: ${comments || 'No comments'}`.substring(0, 500)
      };

      const result = await onSubmitRequest(payload);
      if (result?.success) {
        setFromDate('');
        setToDate('');
        setLeaveType('');
        setLeaveReason('');
        setComments('');
        setDeclarationAccepted(false);
        setAttachment(null);
        alert('Leave request submitted successfully!');
        if (onCancel) onCancel();
      } else {
        setErrorMessage(result?.error || 'Failed to submit leave request.');
      }
    } catch (err) {
      setErrorMessage(err?.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-7 space-y-4">
        <EmployeeCard employee={currentUser} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100/50 border border-slate-250/60 rounded-2xl p-3 shadow-inner">
          {allowance.map((item, idx) => (
            <motion.div
              key={item.key}
              whileHover={{ y: -2, scale: 1.02 }}
              className="premium-glossy-card border-beam-card rounded-xl p-2 py-2.5 border-white/40 flex flex-col items-center text-center shadow-sm cursor-pointer"
              style={{
                '--beam-color': 'rgba(255, 255, 255, 0.85)',
                '--beam-speed': '6s',
                '--beam-dwell': `${idx * 0.4}s`
              }}
            >
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.key}</span>
              <span className={`text-base font-extrabold mt-0.5 ${item.color}`}>{item.remaining}</span>
              <span className="text-[8px] text-slate-400 font-bold">days left</span>
            </motion.div>
          ))}
        </div>

        <div className="premium-glossy-card rounded-2xl p-4 border-white/40 shadow-sm space-y-3.5 bg-white/80 border-beam-card"
          style={{
            '--beam-color': '#3b82f6',
            '--beam-speed': '7s',
            '--beam-dwell': '1.5s'
          }}
        >
          <h4 className="text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider">Leave Parameters</h4>

          {/* Employee Search & Select Selector */}
          <div className="space-y-1 relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Select Employee</label>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer flex justify-between items-center shadow-sm"
            >
              <span>{empName ? `${empName} (ID: ${empId})` : 'Select an employee...'}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {showDropdown && (
              <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-250 rounded-2xl shadow-xl p-2.5 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <input
                  type="text"
                  placeholder="Search by ID or name..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                  {((employees || []).filter(emp => {
                    const name = (emp.emp_name || emp.name || '').toLowerCase();
                    const id = String(emp.emp_id || emp.employee_id || '').toLowerCase();
                    const searchVal = employeeSearch.toLowerCase();
                    return name.includes(searchVal) || id.includes(searchVal);
                  })).length === 0 ? (
                    <div className="py-3 text-center text-xs text-slate-400 font-semibold">
                      No employees found.
                    </div>
                  ) : (
                    (employees || []).filter(emp => {
                      const name = (emp.emp_name || emp.name || '').toLowerCase();
                      const id = String(emp.emp_id || emp.employee_id || '').toLowerCase();
                      const searchVal = employeeSearch.toLowerCase();
                      return name.includes(searchVal) || id.includes(searchVal);
                    }).map(emp => {
                      const id = emp.emp_id || emp.employee_id;
                      const name = emp.emp_name || emp.name;
                      return (
                        <div
                          key={id}
                          onClick={() => {
                            setEmpId(id);
                            setEmpName(name);
                            setShowDropdown(false);
                            setEmployeeSearch('');
                          }}
                          className="py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-lg cursor-pointer transition flex justify-between items-center"
                        >
                          <span>{name}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-bold">ID: {id}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <LeaveDatePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            totalDays={leaveDays}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <LeaveTypeSelect value={leaveType} onChange={setLeaveType} />
            <ReasonSelect value={leaveReason} onChange={setLeaveReason} />
          </div>

          <PrioritySelect value={priority} onChange={setPriority} />

          <div className="space-y-1">
            <label htmlFor="emergencyPhone" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Emergency Contact Number</label>
            <div className="relative">
              <input
                id="emergencyPhone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="Enter emergency mobile number..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 pl-9 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Phone size={13} />
              </div>
            </div>
          </div>

          <AttachmentUpload onChange={setAttachment} />

          <CommentBox value={comments} onChange={setComments} />

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          <label className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/50 cursor-pointer hover:bg-slate-100/50 select-none group">
            <input
              type="checkbox"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-[11px] font-semibold text-slate-500 leading-normal group-hover:text-slate-700">
              I declare that this leave request is filed for legitimate reasons. I will hand over my outstanding duties to my department before my time-off.
            </span>
          </label>

          <LeaveButtons onCancel={onCancel} isSubmitting={isSubmitting} submitLabel="Save" />
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4 flex flex-col lg:h-full">
        <LeaveCalendar selectedFrom={fromDate} selectedTo={toDate} leaveRequests={leaveRequests} />
        <SummaryCard stats={stats} />
        <HolidayCard className="flex-1 flex flex-col" />
      </div>
    </form>
  );
};

const LeaveHistoryView = ({ requests = [], onUpdateStatus, loading = false }) => (
  <div className="space-y-4">

    {loading ? (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading leave register...</span>
      </div>
    ) : (
      <LeaveTable data={requests} onUpdateStatus={onUpdateStatus} isAdmin={true} />
    )}
  </div>
);


const LeavePermissionView = ({ currentUser = {}, employees = [] }) => {
  const [empId, setEmpId] = useState(currentUser?.emp_id || currentUser?.employee_id || '');
  const [empName, setEmpName] = useState(currentUser?.emp_name || currentUser?.fullName || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [reason, setReason] = useState('');
  const [permissionList, setPermissionList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEmpId(currentUser.emp_id || currentUser.employee_id || '');
      setEmpName(currentUser.emp_name || currentUser.fullName || '');
    }
  }, [currentUser]);

  const loadPermissions = useCallback(async () => {
    if (!empId) return;
    try {
      const res = await api.get(`/leave/permission/list/${empId}`);
      if (res.data && res.data.success) {
        const seedKey = `permissions_seeded_${empId}`;
        if (res.data.data.length === 0 && !sessionStorage.getItem(seedKey)) {
          sessionStorage.setItem(seedKey, 'true');
          const mockHistory = [
            {
              emp_id: empId,
              emp_name: empName,
              date: '2026-08-04',
              fromTime: '10:00',
              toTime: '11:00',
              duration: 1.0,
              reason: 'Routine Medical Eye Checkup',
              status: 'Approved',
              manager: 'Srinivasan Raman'
            },
            {
              emp_id: empId,
              emp_name: empName,
              date: '2026-08-05',
              fromTime: '15:30',
              toTime: '16:00',
              duration: 0.5,
              reason: 'Collect documents from bank',
              status: 'Approved',
              manager: 'Srinivasan Raman'
            }
          ];
          await Promise.all(mockHistory.map(item => api.post('/leave/permission/create', item)));
          const refetched = await api.get(`/leave/permission/list/${empId}`);
          if (refetched.data && refetched.data.success) {
            setPermissionList(refetched.data.data);
          }
        } else {
          setPermissionList(res.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load permissions from DB', err);
    }
  }, [empId, empName]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const calculatedDuration = useMemo(() => {
    if (!fromTime || !toTime) return 0;
    const [fh, fm] = fromTime.split(':').map(Number);
    const [th, tm] = toTime.split(':').map(Number);
    const fromMinutes = fh * 60 + fm;
    const toMinutes = th * 60 + tm;
    if (toMinutes <= fromMinutes) return 0;
    return Math.round(((toMinutes - fromMinutes) / 60) * 100) / 100;
  }, [fromTime, toTime]);

  const remainingHours = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const usedThisMonth = permissionList
      .filter((item) => item.status === 'Approved')
      .filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + Number(item.duration || 0), 0);
    return Math.max(DEFAULT_MONTHLY_HOURS - usedThisMonth, 0);
  }, [permissionList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (calculatedDuration <= 0) {
      setErrorMsg('Please select a valid time range where End Time is after Start Time.');
      return;
    }
    if (calculatedDuration > remainingHours) {
      setErrorMsg(`Request duration exceeds your remaining monthly allowance of ${remainingHours} hours.`);
      return;
    }
    const payload = {
      emp_id: empId,
      emp_name: empName,
      date,
      fromTime,
      toTime,
      duration: calculatedDuration,
      reason,
      status: 'Pending',
      manager: 'Srinivasan Raman'
    };
    try {
      const res = await api.post('/leave/permission/create', payload);
      if (res.data && res.data.success) {
        await loadPermissions();
        setDate('');
        setFromTime('');
        setToTime('');
        setReason('');
        alert('Permission request submitted successfully to reporting manager!');
      } else {
        setErrorMsg('Failed to submit permission request.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred during submission.');
    }
  };

  const handleDeleteRequest = async (id) => {
    try {
      const res = await api.delete(`/leave/permission/${id}`);
      if (res.data && res.data.success) {
        await loadPermissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateApproval = async (id, status) => {
    try {
      const res = await api.put('/leave/permission/status', { id, status });
      if (res.data && res.data.success) {
        await loadPermissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const progressPercent = (remainingHours / DEFAULT_MONTHLY_HOURS) * 100;  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <style>{`
        @media (max-width: 920px) {
          .permission-history-card {
            max-height: none !important;
          }
          .permission-history-scrollable {
            overflow: visible !important;
          }
        }
      `}</style>
      <div className="lg:col-span-5 space-y-4">
        {/* Permission Allowance Tracker */}
        <motion.div 
          whileHover={{ 
            y: -6, 
            scale: 1.02, 
            boxShadow: '0 20px 35px -5px rgba(99, 102, 241, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
            borderColor: 'rgba(255, 255, 255, 0.4)'
          }}
          transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative bg-gradient-to-br from-indigo-650 to-purple-700 text-white rounded-2xl p-4 border border-white/20 backdrop-blur-xl shadow-lg overflow-hidden shimmer-shine-overlay border-beam-card group cursor-pointer"
          style={{
            '--beam-color': 'rgba(255, 255, 255, 0.95)',
            '--beam-speed': '4s',
            '--beam-dwell': '0.5s'
          }}
        >
          {/* Glassy overlays */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-8 -mt-8 rotate-45 transform pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-100 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 shadow-inner">Hourly Permission</span>
            <Clock size={18} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="mt-3.5 flex items-baseline gap-1">
            <span className="text-3xl font-black drop-shadow-md">{remainingHours.toFixed(1)} hrs</span>
            <span className="text-xs font-semibold text-indigo-200">/ {DEFAULT_MONTHLY_HOURS} hrs Left</span>
          </div>
          <p className="text-xs text-indigo-100 font-bold mt-1">Monthly allowance for quick checkouts</p>
          <div className="mt-4 space-y-1">
            <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden p-[1px]">
              <div className="h-full bg-gradient-to-r from-white via-white/90 to-white rounded-full shadow-inner animate-[pulse_3s_infinite]" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-[8px] font-black text-indigo-200 uppercase">
              <span>Used: {(DEFAULT_MONTHLY_HOURS - remainingHours).toFixed(1)} hrs</span>
              <span>Available: {progressPercent.toFixed(0)}%</span>
            </div>
          </div>
        </motion.div>

        {/* Request Form */}
        <div className="premium-glossy-card rounded-2xl p-4 border-white/40 shadow-sm space-y-3.5 bg-white/80 border-beam-card"
          style={{
            '--beam-color': '#8b5cf6',
            '--beam-speed': '6.5s',
            '--beam-dwell': '2s'
          }}
        >
          <h4 className="text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider">File Permission Request</h4>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Employee Search & Select Selector */}
            <div className="space-y-1 relative" ref={dropdownRef}>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Select Employee</label>
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer flex justify-between items-center shadow-sm"
              >
                <span>{empName ? `${empName} (ID: ${empId})` : 'Select an employee...'}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showDropdown && (
                <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-250 rounded-2xl shadow-xl p-2.5 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <input
                    type="text"
                    placeholder="Search by ID or name..."
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                    {((employees || []).filter(emp => {
                      const name = (emp.emp_name || emp.name || '').toLowerCase();
                      const id = String(emp.emp_id || emp.employee_id || '').toLowerCase();
                      const searchVal = employeeSearch.toLowerCase();
                      return name.includes(searchVal) || id.includes(searchVal);
                    })).length === 0 ? (
                      <div className="py-3 text-center text-xs text-slate-400 font-semibold">
                        No employees found.
                      </div>
                    ) : (
                      (employees || []).filter(emp => {
                        const name = (emp.emp_name || emp.name || '').toLowerCase();
                        const id = String(emp.emp_id || emp.employee_id || '').toLowerCase();
                        const searchVal = employeeSearch.toLowerCase();
                        return name.includes(searchVal) || id.includes(searchVal);
                      }).map(emp => {
                        const id = emp.emp_id || emp.employee_id;
                        const name = emp.emp_name || emp.name;
                        return (
                          <div
                            key={id}
                            onClick={() => {
                              setEmpId(id);
                              setEmpName(name);
                              setShowDropdown(false);
                              setEmployeeSearch('');
                            }}
                            className="py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-lg cursor-pointer transition flex justify-between items-center"
                          >
                            <span>{name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-bold">ID: {id}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="permDate" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Date</label>
              <input
                id="permDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="fromTime" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Start Time</label>
                <input
                  id="fromTime"
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="toTime" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">End Time</label>
                <input
                  id="toTime"
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {calculatedDuration > 0 && (
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-650">
                <span>Permission Duration:</span>
                <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">
                  {calculatedDuration} {calculatedDuration === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="permReason" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reason</label>
              <textarea
                id="permReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe reason for permission (e.g. pick up children, dentist slot)..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 min-h-[60px] resize-none"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-shake">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <motion.button
                whileHover={{ y: -1.5, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 glossy-button-primary text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send size={14} />
                Save
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-4">
        <div className="premium-glossy-card rounded-2xl p-4 border-white/40 shadow-sm flex flex-col h-full max-h-[500px] border-beam-card permission-history-card"
          style={{
            '--beam-color': '#4f46e5',
            '--beam-speed': '6s',
            '--beam-dwell': '1s'
          }}
        >
          <h4 className="text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider mb-3">Permission Request History</h4>
          <div className="overflow-auto min-h-0 flex-1 permission-history-scrollable">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Timing</th>
                  <th className="py-2.5 px-3 text-center">Duration</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {permissionList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                      No permission requests recorded.
                    </td>
                  </tr>
                ) : (
                  permissionList.map((item) => {
                    let badge = 'bg-amber-50 text-amber-700 border-amber-100';
                    if (item.status === 'Approved') badge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    if (item.status === 'Rejected') badge = 'bg-rose-50 text-rose-700 border-rose-100';
                    return (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-600">
                          <div>
                            <p className="font-extrabold text-slate-800">{item.name || 'N/A'}</p>
                            <p className="text-[9px] text-slate-400 font-bold">ID: {item.emp_id}</p>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-700">{formatDate(item.date)}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-650">{item.fromTime} - {item.toTime}</td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-slate-700">{item.duration} hr</td>
                        <td className="py-2.5 px-3 text-slate-500 font-semibold max-w-[130px] truncate" title={item.reason}>{item.reason}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === 'Pending' ? (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => handleSimulateApproval(item.id, 'Approved')}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
                                  title="Simulate Approve"
                                >
                                  <CheckCircle2 size={12} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => handleSimulateApproval(item.id, 'Rejected')}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-300 transition cursor-pointer"
                                  title="Simulate Reject"
                                >
                                  <XCircle size={12} />
                                </motion.button>
                              </>
                            ) : (
                              <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => handleDeleteRequest(item.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                                  title="Delete entry"
                                >
                                  <Trash2 size={12} />
                                </motion.button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
