import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Clock, Calendar, AlertCircle, CheckCircle2, Send, XCircle, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/leaveUtils';

const DEFAULT_MONTHLY_HOURS = 2.0; // 2 hours allowance

export const LeavePermission = ({ currentUser }) => {
  // Form states
  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [reason, setReason] = useState('');
  const [permissionList, setPermissionList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const empId = currentUser?.emp_id || currentUser?.employee_id || 1;

  const loadPermissions = useCallback(async () => {
    try {
      const res = await api.get(`/leave/permission/list/${empId}`);
      if (res.data && res.data.success) {
        const seedKey = `permissions_seeded_${empId}`;
        if (res.data.data.length === 0 && !sessionStorage.getItem(seedKey)) {
          sessionStorage.setItem(seedKey, 'true');
          const mockHistory = [
            {
              emp_id: empId,
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
  }, [empId]);

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

  // Cancel/Delete request handler
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

  // Manager simulation handler
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

  const progressPercent = (remainingHours / DEFAULT_MONTHLY_HOURS) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
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
            
            {/* Date */}
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
            <motion.button
              whileHover={{ y: -1.5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-2.5 glossy-button-primary text-white font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              Submit Permission Request
            </motion.button>

          </form>
        </div>

      </div>

      {/* Right Side: History registry */}
      <div className="lg:col-span-7 space-y-4">
        
        <div className="premium-glossy-card rounded-2xl p-4 border-white/40 shadow-sm flex flex-col h-full max-h-[500px] border-beam-card"
          style={{
            '--beam-color': '#4f46e5',
            '--beam-speed': '6s',
            '--beam-dwell': '1s'
          }}
        >
          <h4 className="text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider mb-3">
            Permission Request History
          </h4>

          <div className="overflow-auto min-h-0 flex-1">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-wider">
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
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Manager simulator trigger: Approve / Reject simulation directly on screen */}
                            {item.status === 'Pending' ? (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleSimulateApproval(item.id, 'Approved')}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
                                  title="[Simulate Manager Approve]"
                                >
                                  <CheckCircle2 size={12} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleSimulateApproval(item.id, 'Rejected')}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-300 transition cursor-pointer"
                                  title="[Simulate Manager Reject]"
                                >
                                  <XCircle size={12} />
                                </motion.button>
                              </>
                            ) : (
                              <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.9 }}
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

export default LeavePermission;
