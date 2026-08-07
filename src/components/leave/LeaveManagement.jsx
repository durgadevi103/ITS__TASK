import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Clock, Send, XCircle, Trash2, CheckCircle2, Info } from 'lucide-react';
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
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse current user session', e);
      }
    } else {
      setCurrentUser({
        emp_id: 1,
        employee_id: 1,
        emp_name: 'Durgadevi Balakrishnan',
        fullName: 'Durgadevi Balakrishnan',
        emp_email: 'durga@company.com',
        email: 'durga@company.com',
        emp_dept: 'Engineering',
        emp_designation: 'Senior Frontend Engineer',
        phone: '+91 98765 43210'
      });
    }
  }, []);

  const {
    loading,
    leaveRequests,
    dashboardStats,
    allowance,
    submitLeaveRequest,
    updateLeaveStatus
  } = useLeave(currentUser);

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
        return <LeavePermissionView currentUser={currentUser} />;
      default:
        return (
          <div className="text-center py-20 font-semibold text-slate-400">
            View under construction.
          </div>
        );
    }
  };

  return (
    <div className="px-4 pb-4 bg-slate-50 flex flex-col min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] overflow-hidden">
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-xl border-b border-slate-200/70 py-2">
        <LeaveHeader
          title="Leave & Time-Off Management"
          activeTab={activeTab}
        />

        <div className="mt-2">
          <LeaveTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      <div className="mt-2 overflow-y-auto flex-1 pr-1 pb-4">
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 relative pb-10">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl pointer-events-none -z-10 animate-[floatUpSidebar_20s_infinite_ease-in-out]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none -z-10 animate-[floatDownSidebar_25s_infinite_ease-in-out]" />

      <motion.div variants={sectionVariants}>
        <DashboardStatsGrid stats={stats} requests={requests} />
      </motion.div>

      <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <motion.div variants={sectionVariants} className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div>
            <h4 className="text-base font-extrabold text-slate-800 tracking-tight">Recent Submissions Registry</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manager actions log</p>
          </div>
        </div>

        <LeaveTable data={recentRequests} onUpdateStatus={onUpdateStatus} isAdmin={true} />
      </motion.div>
    </motion.div>
  );
};

const LeaveSubmitView = ({ currentUser = {}, allowance = [], onSubmitRequest, onCancel, leaveRequests = [], stats = {} }) => {
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
        emp_id: currentUser?.emp_id || currentUser?.employee_id || 1,
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-6">
        <EmployeeCard employee={currentUser} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-3xl p-4 shadow-sm">
          {allowance.map((item) => (
            <div key={item.key} className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-inner">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.key}</span>
              <span className={`text-base font-extrabold mt-1 ${item.color}`}>{item.remaining}</span>
              <span className="text-[8px] text-slate-400 font-bold">days left</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-5">
          <h4 className="text-sm font-extrabold text-slate-800 pb-2.5 border-b border-slate-100 uppercase tracking-wider">Leave Parameters</h4>

          <ShiftSelector value={shift} onChange={setShift} />

          <LeaveDatePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            totalDays={leaveDays}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LeaveTypeSelect value={leaveType} onChange={setLeaveType} />
            <ReasonSelect value={leaveReason} onChange={setLeaveReason} />
          </div>

          <PrioritySelect value={priority} onChange={setPriority} />

          <div className="space-y-1.5">
            <label htmlFor="emergencyPhone" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Emergency Contact Number</label>
            <div className="relative">
              <input
                id="emergencyPhone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="Enter emergency mobile number..."
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 pl-10 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Phone size={15} />
              </div>
            </div>
          </div>

          <AttachmentUpload onChange={setAttachment} />

          <CommentBox value={comments} onChange={setComments} />

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          <label className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/50 cursor-pointer hover:bg-slate-100/50 select-none group">
            <input
              type="checkbox"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-500 leading-relaxed group-hover:text-slate-700">
              I hereby declare that this leave request is filed for legitimate reasons. I will hand over my outstanding duties to my department before proceeding with my time-off.
            </span>
          </label>

          <LeaveButtons onCancel={onCancel} isSubmitting={isSubmitting} submitLabel="Submit Leave Request" />
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">
        <LeaveCalendar selectedFrom={fromDate} selectedTo={toDate} leaveRequests={leaveRequests} />
        <SummaryCard stats={stats} />
        <HolidayCard />
      </div>
    </form>
  );
};

const LeaveHistoryView = ({ requests = [], onUpdateStatus, loading = false }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-inner">
        <Info size={18} />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-extrabold text-slate-800">Global Leave Registry</h4>
        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
          Below is the list of all leave requests submitted across all departments. Administrators and Managers can use the action buttons (✓/✗) on pending requests to approve or reject them.
        </p>
      </div>
    </div>

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

const LeavePermissionView = ({ currentUser = {} }) => {
  const storageKey = `permissions_${currentUser?.emp_id || currentUser?.employee_id || 'guest'}`;
  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [reason, setReason] = useState('');
  const [permissionList, setPermissionList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        setPermissionList(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse permissions history', e);
      }
    } else {
      const mockHistory = [
        {
          id: 'PER-101',
          date: '2026-08-04',
          fromTime: '10:00',
          toTime: '11:00',
          duration: 1.0,
          reason: 'Routine Medical Eye Checkup',
          status: 'Approved',
          manager: 'Srinivasan Raman'
        },
        {
          id: 'PER-102',
          date: '2026-08-05',
          fromTime: '15:30',
          toTime: '16:00',
          duration: 0.5,
          reason: 'Collect documents from bank',
          status: 'Approved',
          manager: 'Srinivasan Raman'
        }
      ];
      setPermissionList(mockHistory);
      localStorage.setItem(storageKey, JSON.stringify(mockHistory));
    }
  }, [storageKey]);

  const saveToStorage = (updatedList) => {
    setPermissionList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  };

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
      .reduce((sum, item) => sum + item.duration, 0);
    return Math.max(DEFAULT_MONTHLY_HOURS - usedThisMonth, 0);
  }, [permissionList]);

  const handleSubmit = (e) => {
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
    const newRequest = {
      id: `PER-${Math.floor(100 + Math.random() * 900)}`,
      date,
      fromTime,
      toTime,
      duration: calculatedDuration,
      reason,
      status: 'Pending',
      manager: 'Srinivasan Raman'
    };
    const updated = [newRequest, ...permissionList];
    saveToStorage(updated);
    setDate('');
    setFromTime('');
    setToTime('');
    setReason('');
    alert('Permission request submitted successfully to reporting manager!');
  };

  const handleDeleteRequest = (id) => {
    saveToStorage(permissionList.filter((item) => item.id !== id));
  };

  const handleSimulateApproval = (id, status) => {
    saveToStorage(permissionList.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const progressPercent = (remainingHours / DEFAULT_MONTHLY_HOURS) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-8 -mt-8 rotate-45 transform" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-100 bg-white/10 px-2 py-0.5 rounded-full">Hourly Permission</span>
            <Clock size={18} />
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-black">{remainingHours.toFixed(1)} hrs</span>
            <span className="text-xs font-semibold text-indigo-200">/ {DEFAULT_MONTHLY_HOURS} hrs Left</span>
          </div>
          <p className="text-xs text-indigo-100 font-bold mt-1">Monthly allowance for quick checkouts</p>
          <div className="mt-5 space-y-1">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-[8px] font-black text-indigo-200 uppercase">
              <span>Used: {(DEFAULT_MONTHLY_HOURS - remainingHours).toFixed(1)} hrs</span>
              <span>Available: {progressPercent.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-4">
          <h4 className="text-sm font-extrabold text-slate-800 pb-2.5 border-b border-slate-100 uppercase tracking-wider">File Permission Request</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="permDate" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Date</label>
              <input
                id="permDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="fromTime" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Start Time</label>
                <input
                  id="fromTime"
                  type="time"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="toTime" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">End Time</label>
                <input
                  id="toTime"
                  type="time"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {calculatedDuration > 0 && (
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Permission Duration:</span>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl">
                  {calculatedDuration} {calculatedDuration === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="permReason" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Reason</label>
              <textarea
                id="permReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe reason for permission (e.g. pick up children, dentist slot)..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 min-h-[80px] resize-none"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send size={14} />
              Submit Permission Request
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md">
          <h4 className="text-sm font-extrabold text-slate-800 pb-2.5 border-b border-slate-100 uppercase tracking-wider mb-4">Permission Request History</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Timing</th>
                  <th className="py-3 px-4 text-center">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {permissionList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
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
                        <td className="py-3.5 px-4 font-bold text-slate-700">{formatDate(item.date)}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-600">{item.fromTime} - {item.toTime}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-slate-700">{item.duration} hr</td>
                        <td className="py-3.5 px-4 text-slate-500 font-semibold max-w-[130px] truncate" title={item.reason}>{item.reason}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === 'Pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSimulateApproval(item.id, 'Approved')}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-100 hover:border-emerald-200 transition cursor-pointer"
                                  title="Simulate Approve"
                                >
                                  <CheckCircle2 size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSimulateApproval(item.id, 'Rejected')}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-100 hover:border-rose-200 transition cursor-pointer"
                                  title="Simulate Reject"
                                >
                                  <XCircle size={12} />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeleteRequest(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-100 hover:border-rose-100 transition cursor-pointer"
                                title="Delete entry"
                              >
                                <Trash2 size={12} />
                              </button>
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
