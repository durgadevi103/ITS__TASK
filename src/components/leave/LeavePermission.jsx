import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Clock, Calendar, AlertCircle, CheckCircle2, Send, XCircle, ChevronDown, MoreVertical, Check, X } from 'lucide-react';
import { formatDate } from '../../utils/leaveUtils';

const DEFAULT_MONTHLY_HOURS = 2.0; // 2 hours allowance

export const LeavePermission = ({ currentUser, employees = [], onEmployeeClick }) => {
  // Form states
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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEmpId(currentUser.emp_id || currentUser.employee_id || '');
      setEmpName(currentUser.emp_name || currentUser.fullName || '');
    }
  }, [currentUser]);

  const loadPermissions = useCallback(async () => {
    try {
      const res = await api.get('/leave/permission-viewlist');
      if (res.data && res.data.success) {
        const seedKey = `permissions_seeded_all`;
        if (res.data.data.length === 0 && !sessionStorage.getItem(seedKey)) {
          sessionStorage.setItem(seedKey, 'true');
          const mockHistory = [
            {
              emp_id: empId || 1,
              emp_name: empName || 'Durgadevi',
              permission_date: '2026-08-04',
              from_time: '10:00',
              to_time: '11:00',
              duration: 1.0,
              reason: 'Routine Medical Eye Checkup',
              status: 'Approved',
              manager: 'Srinivasan Raman'
            },
            {
              emp_id: empId || 1,
              emp_name: empName || 'Durgadevi',
              permission_date: '2026-08-05',
              from_time: '15:30',
              to_time: '16:00',
              duration: 0.5,
              reason: 'Collect documents from bank',
              status: 'Approved',
              manager: 'Srinivasan Raman'
            }
          ];
          await Promise.all(mockHistory.map(item => api.post('/leave/permission/create', item)));
          const refetched = await api.get('/leave/permission-viewlist');
          if (refetched.data && refetched.data.success) {
            const mapped = refetched.data.data.map(item => ({
              id: item.permission_id,
              emp_id: item.emp_id,
              name: item.emp_name,
              date: item.permission_date,
              fromTime: item.from_time,
              toTime: item.to_time,
              duration: item.duration,
              reason: item.reason,
              status: item.status,
              applied_date: item.applied_date
            }));
            setPermissionList(mapped);
          }
        } else {
          const mapped = res.data.data.map(item => ({
            id: item.permission_id,
            emp_id: item.emp_id,
            name: item.emp_name,
            date: item.permission_date,
            fromTime: item.from_time,
            toTime: item.to_time,
            duration: item.duration,
            reason: item.reason,
            status: item.status,
            applied_date: item.applied_date
          }));
          setPermissionList(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to load permissions from DB', err);
    }
  }, [empId, empName]);

  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // Calculate permission duration in hours (e.g. 1.5 hours)
  const calculatedDuration = useMemo(() => {
    if (!fromTime || !toTime) return 0;
    const [fh, fm] = fromTime.split(':').map(Number);
    const [th, tm] = toTime.split(':').map(Number);
    
    const fromMinutes = fh * 60 + fm;
    const toMinutes = th * 60 + tm;
    
    if (toMinutes <= fromMinutes) return 0;
    
    const diffHours = (toMinutes - fromMinutes) / 60;
    return Math.round(diffHours * 100) / 100; // round to 2 decimals
  }, [fromTime, toTime]);

  // Compute remaining allowance (Approved permissions subtract from allowance)
  const remainingHours = useMemo(() => {
    // Sum approved permissions in the current calendar month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const usedThisMonth = permissionList
      .filter(item => {
        if (item.status !== 'Approved') return false;
        const d = new Date(item.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, item) => sum + Number(item.duration || 0), 0);

    return Math.max(DEFAULT_MONTHLY_HOURS - usedThisMonth, 0);
  }, [permissionList]);

  // Form submission
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
      permission_date: date,
      from_time: fromTime,
      to_time: toTime,
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

  // Cancel/Delete request handler
  const handleDeleteRequest = async (id) => {
    try {
      const res = await api.delete(`/leave/permission/${id}`, { data: { permission_id: id } });
      if (res.data && res.data.success) {
        await loadPermissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Manager simulation handler
  const handleSimulateApproval = async (id, status) => {
    try {
      const res = await api.put('/leave/permission/status', { permission_id: id, status });
      if (res.data && res.data.success) {
        await loadPermissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const progressPercent = (remainingHours / DEFAULT_MONTHLY_HOURS) * 100;

  return (
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
      
      {/* Left Side: Allowance widget & request form */}
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
          className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-4 border border-white/20 backdrop-blur-xl shadow-lg overflow-hidden shimmer-shine-overlay border-beam-card group cursor-pointer"
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
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-100 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 shadow-inner">
              Hourly Permission
            </span>
            <Clock size={18} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>

          <div className="mt-3.5 flex items-baseline gap-1">
            <span className="text-3xl font-black drop-shadow-md">{remainingHours.toFixed(1)} hrs</span>
            <span className="text-xs font-semibold text-indigo-200">/ {DEFAULT_MONTHLY_HOURS} hrs Left</span>
          </div>
          
          <p className="text-xs text-indigo-100 font-bold mt-1">Monthly allowance for quick checkouts</p>

          {/* Progress Bar */}
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
          <h4 className="text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider">
            File Permission Request
          </h4>

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
              <div className="relative">
                <input
                  id="permDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Time range */}
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

            {/* Calculated duration display */}
            {calculatedDuration > 0 && (
              <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-650">
                <span>Permission Duration:</span>
                <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">
                  {calculatedDuration} {calculatedDuration === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
            )}

            {/* Reason */}
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

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-shake">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit Button */}
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

      {/* Right Side: History registry */}
      <div className="lg:col-span-7 space-y-4">
        
        <div className="premium-glossy-card rounded-2xl p-4 border-white/40 shadow-sm flex flex-col h-full border-beam-card permission-history-card"
          style={{
            '--beam-color': '#4f46e5',
            '--beam-speed': '6s',
            '--beam-dwell': '1s'
          }}
        >
          <h4 className="text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider mb-3">
            Permission Request History
          </h4>

          <div className="overflow-visible permission-history-scrollable">
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
                        <td className="py-2.5 px-3 font-semibold text-slate-655">
                          <div 
                            onClick={() => onEmployeeClick && onEmployeeClick(item.emp_id)}
                            className="cursor-pointer group/name"
                            title="Click to view employee dashboard"
                          >
                            <p className="font-extrabold text-slate-800 group-hover/name:text-blue-600 group-hover/name:underline transition-colors">{item.name || 'N/A'}</p>
                            <p className="text-[9px] text-slate-400 font-bold">ID: {item.emp_id}</p>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-700">
                          {formatDate(item.date)}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-600">
                          {item.fromTime} - {item.toTime}
                        </td>
                        <td className="py-2.5 px-3 text-center font-extrabold text-slate-700">
                          {item.duration} hr
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 font-semibold max-w-[130px] truncate" title={item.reason}>
                          {item.reason}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 cursor-pointer"
                              title="Actions"
                            >
                              <MoreVertical size={13} />
                            </button>
                            
                            {openMenuId === item.id && (
                              <>
                                {/* Backdrop for click outside */}
                                <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)} />
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200/80 rounded-2xl p-1 shadow-lg z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                                  {/* Pending Option */}
                                  <button
                                    onClick={() => {
                                      if (item.status !== 'Pending') handleSimulateApproval(item.id, 'Pending');
                                      setOpenMenuId(null);
                                    }}
                                    disabled={item.status === 'Pending'}
                                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all duration-200 cursor-pointer ${
                                      item.status === 'Pending'
                                        ? 'text-amber-600 bg-amber-50/70 select-none'
                                        : 'text-slate-655 hover:text-amber-600 hover:bg-amber-50/30'
                                    }`}
                                  >
                                    <Clock size={12} className={item.status === 'Pending' ? 'text-amber-600' : 'text-slate-400'} />
                                    Pending
                                  </button>

                                  {/* Approved Option */}
                                  <button
                                    onClick={() => {
                                      if (item.status !== 'Approved') handleSimulateApproval(item.id, 'Approved');
                                      setOpenMenuId(null);
                                    }}
                                    disabled={item.status === 'Approved'}
                                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all duration-200 cursor-pointer ${
                                      item.status === 'Approved'
                                        ? 'text-emerald-600 bg-emerald-50/70 select-none'
                                        : 'text-slate-655 hover:text-emerald-600 hover:bg-emerald-50/30'
                                    }`}
                                  >
                                    <Check size={12} className={item.status === 'Approved' ? 'text-emerald-600' : 'text-slate-400'} />
                                    Approve
                                  </button>

                                  {/* Rejected Option */}
                                  <button
                                    onClick={() => {
                                      if (item.status !== 'Rejected') handleSimulateApproval(item.id, 'Rejected');
                                      setOpenMenuId(null);
                                    }}
                                    disabled={item.status === 'Rejected'}
                                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all duration-200 cursor-pointer ${
                                      item.status === 'Rejected'
                                        ? 'text-rose-600 bg-rose-50/70 select-none'
                                        : 'text-slate-655 hover:text-rose-600 hover:bg-rose-50/30'
                                    }`}
                                  >
                                    <X size={12} className={item.status === 'Rejected' ? 'text-rose-600' : 'text-slate-400'} />
                                    Reject
                                  </button>

                                  {/* Divider */}
                                  <div className="h-[1px] bg-slate-100 my-1" />

                                  {/* Cancel Option */}
                                  <button
                                    onClick={() => {
                                      handleDeleteRequest(item.id);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-all duration-200 cursor-pointer"
                                  >
                                    <XCircle size={12} className="text-rose-500" />
                                    Cancel
                                  </button>
                                </div>
                              </>
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

export default LeavePermission;
