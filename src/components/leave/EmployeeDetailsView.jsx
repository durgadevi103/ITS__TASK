import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, Mail, Phone, Clock, Calendar, CheckCircle2, 
  XCircle, AlertCircle, CalendarRange, HeartPulse, ShieldAlert, 
  Sparkles, Briefcase, Activity
} from 'lucide-react';
import api from '../../api/axios';
import { formatDate } from '../../utils/leaveUtils';
import LeaveBalanceCard from './LeaveBalanceCard';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 130,
      damping: 18
    }
  }
};

export const EmployeeDetailsView = ({ empId, onBack, backLabel = 'History' }) => {
  const [employee, setEmployee] = useState(null);
  const [allowance, setAllowance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Fetch employee details (includes department info via left join)
        const empRes = await api.get(`/employee/get/${empId}`);
        if (empRes.data?.success) {
          setEmployee(empRes.data.data);
        }
        
        // 2. Fetch leave allowance
        const allowanceRes = await api.get(`/leave/leave-allowance/${empId}`);
        if (allowanceRes.data?.success) {
          setAllowance(allowanceRes.data.data);
        }

        // 3. Fetch leaves list to filter the employee's history
        const leavesRes = await api.get('/leave/get-list');
        if (leavesRes.data?.success && leavesRes.data.data) {
          const filteredLeaves = leavesRes.data.data.filter(item => Number(item.emp_id) === Number(empId));
          setLeaves(filteredLeaves);
        }
      } catch (err) {
        console.error("Error fetching employee details page data", err);
      } finally {
        setLoading(false);
      }
    };
    if (empId) fetchAllData();
  }, [empId]);

  // Leave balances mapping
  const leaveTypesList = [
    { key: 'Casual Leave (CL)', type: 'Casual Leave (CL)', balanceKey: 'CL', total: 12, gradient: 'from-blue-500 to-indigo-650' },
    { key: 'Sick Leave (SL)', type: 'Sick Leave (SL)', balanceKey: 'SL', total: 12, gradient: 'from-emerald-500 to-teal-650' },
    { key: 'Privilege Leave (PL)', type: 'Privilege Leave (PL)', balanceKey: 'PL', total: 20, gradient: 'from-amber-500 to-orange-600' },
    { key: 'Maternity Leave (ML)', type: 'Maternity Leave (ML)', balanceKey: 'ML', total: 90, gradient: 'from-purple-500 to-pink-650' },
  ];

  const mappedAllowance = useMemo(() => {
    return leaveTypesList.map(item => {
      const match = allowance.find(a => a.leave_type === item.type);
      const used = match ? Number(match.used_days || 0) : 0;
      const remaining = match ? Number(match.remaining_days) : item.total;
      return {
        ...item,
        used,
        remaining
      };
    });
  }, [allowance]);

  // Generated deterministic mock daily attendance logs
  const mockAttendanceLogs = useMemo(() => {
    const baseHour = 9;
    const baseMinute = (Number(empId) || 1) % 30;
    const days = [];
    const dateNames = ['2026-08-07', '2026-08-06', '2026-08-05', '2026-08-04', '2026-08-03'];
    
    dateNames.forEach((dStr, idx) => {
      const dateObj = new Date(dStr);
      const dayOfWeek = dateObj.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        days.push({
          date: dStr,
          inTime: '-',
          outTime: '-',
          status: 'Weekly Off',
          badgeColor: 'bg-slate-100 text-slate-600 border-slate-200'
        });
      } else {
        const checkInOffset = (idx * 7 + baseMinute) % 15;
        const checkOutOffset = (idx * 4 + baseMinute) % 20;
        
        days.push({
          date: dStr,
          inTime: `0${baseHour}:${String(checkInOffset).padStart(2, '0')} AM`,
          outTime: `05:${String(30 - checkOutOffset).padStart(2, '0')} PM`,
          status: 'Present',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
        });
      }
    });
    return days;
  }, [empId]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-24 flex flex-col items-center justify-center gap-3 shadow-sm min-h-[400px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Collecting employee profile & history...</span>
      </div>
    );
  }

  const name = employee?.emp_name || 'N/A';
  const initial = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-6"
    >
      {/* 1. Top Action Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to {backLabel}
        </button>
        <span className="text-[10px] font-black uppercase text-indigo-650 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full shadow-inner">
          Employee Dashboard View
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* 2. Employee Profile Card (Left column) */}
        <motion.div variants={sectionVariants} className="lg:col-span-4 space-y-4">
          <div className="premium-glossy-card rounded-3xl p-5 border-white/40 shadow-md border-beam-card flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl font-black text-indigo-600 shadow-inner mb-4 animate-[pulse_5s_infinite]">
              {initial}
            </div>
            
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">{name}</h3>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{employee?.emp_designation || 'Specialist'}</p>
            
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                employee?.emp_status === 'Active' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}>
                {employee?.emp_status || 'Active'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-100">
                Code: {employee?.emp_code || 'N/A'}
              </span>
            </div>

            <div className="w-full h-[1px] bg-slate-100 my-4" />

            <div className="w-full space-y-3.5 text-left text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2.5">
                <User size={14} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Employee ID</p>
                  <p className="text-slate-800 font-bold mt-0.5">#{employee?.emp_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Briefcase size={14} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Department</p>
                  <p className="text-slate-800 font-bold mt-0.5">{employee?.dept_name || 'General'} ({employee?.dept_code || 'N/A'})</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Email Address</p>
                  <p className="text-slate-800 font-bold mt-0.5 truncate">{employee?.emp_email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Contact Number</p>
                  <p className="text-slate-800 font-bold mt-0.5">{employee?.emp_ph_no || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Stats Cards */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Attendance Overview</h4>
              <Activity size={14} className="text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Present Rate</p>
                <p className="text-xl font-black text-emerald-600 mt-1">96.2%</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Clock In Status</p>
                <p className="text-xs font-black text-indigo-650 mt-2 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Clocked In
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Leave Balances and Attendance Logs (Right columns) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Leave Balances Grid */}
          <motion.div variants={sectionVariants} className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Available Leave Balances</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mappedAllowance.map((item) => (
                <LeaveBalanceCard
                  key={item.key}
                  type={item.type}
                  balanceKey={item.balanceKey}
                  total={item.total}
                  used={item.used}
                  remaining={item.remaining}
                  gradient={item.gradient}
                />
              ))}
            </div>
          </motion.div>

          {/* Attendance History Logs */}
          <motion.div variants={sectionVariants} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Recent Attendance Register</h4>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Last 5 Days Log</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Clock In</th>
                    <th className="py-2 px-3">Clock Out</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendanceLogs.map((log, idx) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/40">
                      <td className="py-2.5 px-3 font-bold text-slate-700">{formatDate(log.date)}</td>
                      <td className="py-2.5 px-3 text-slate-550">{log.inTime}</td>
                      <td className="py-2.5 px-3 text-slate-550">{log.outTime}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold border ${log.badgeColor}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Employee Leave History */}
          <motion.div variants={sectionVariants} className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Employee's Leave Requests</h4>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Total: {leaves.length}</span>
            </div>

            <div className="overflow-x-auto max-h-[220px]">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Dates</th>
                    <th className="py-2 px-3 text-center">Days</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                        No leave history found for this employee.
                      </td>
                    </tr>
                  ) : (
                    leaves.map((row) => {
                      let statusBadge = 'bg-amber-50 text-amber-700 border-amber-100';
                      if (row.leave_status === 'Approved') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                      if (row.leave_status === 'Rejected') statusBadge = 'bg-rose-50 text-rose-700 border-rose-100';
                      if (row.leave_status === 'Cancelled') statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';

                      return (
                        <tr key={row.leave_id} className="border-b border-slate-50 hover:bg-slate-50/40 text-xs font-semibold text-slate-600">
                          <td className="py-2.5 px-3 font-bold text-slate-700">#{row.leave_id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-500">{row.leave_type}</td>
                          <td className="py-2.5 px-3 text-slate-550">
                            {formatDate(row.leave_from)} to {formatDate(row.leave_to)}
                          </td>
                          <td className="py-2.5 px-3 text-center font-extrabold text-slate-700">{row.leave_days} d</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold border ${statusBadge}`}>
                              {row.leave_status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
};

export default EmployeeDetailsView;
