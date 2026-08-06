import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, AlertCircle, CheckCircle2, Send, XCircle, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/leaveUtils';

const DEFAULT_MONTHLY_HOURS = 2.0; // 2 hours allowance

export const LeavePermission = ({ currentUser }) => {
  // Local storage prefix based on user identity
  const storageKey = `permissions_${currentUser?.emp_id || currentUser?.employee_id || 'guest'}`;

  // Form states
  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [reason, setReason] = useState('');
  const [permissionList, setPermissionList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Load history from localStorage
  useEffect(() => {
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      try {
        setPermissionList(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse permissions history', e);
      }
    } else {
      // Mock some initial data matching Zoho/Darwinbox defaults
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

  // Save updates to local storage
  const saveToStorage = (updatedList) => {
    setPermissionList(updatedList);
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  };

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
      .reduce((sum, item) => sum + item.duration, 0);

    return Math.max(DEFAULT_MONTHLY_HOURS - usedThisMonth, 0);
  }, [permissionList]);

  // Form submission
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

    // Reset Form
    setDate('');
    setFromTime('');
    setToTime('');
    setReason('');
    alert('Permission request submitted successfully to reporting manager!');
  };

  // Cancel/Delete request handler
  const handleDeleteRequest = (id) => {
    const updated = permissionList.filter(item => item.id !== id);
    saveToStorage(updated);
  };

  // Manager simulation handler
  const handleSimulateApproval = (id, status) => {
    const updated = permissionList.map(item => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    saveToStorage(updated);
  };

  const progressPercent = (remainingHours / DEFAULT_MONTHLY_HOURS) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Side: Allowance widget & request form */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Permission Allowance Tracker */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-8 -mt-8 rotate-45 transform" />
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-100 bg-white/10 px-2 py-0.5 rounded-full">
              Hourly Permission
            </span>
            <Clock size={18} />
          </div>

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-black">{remainingHours.toFixed(1)} hrs</span>
            <span className="text-xs font-semibold text-indigo-200">/ {DEFAULT_MONTHLY_HOURS} hrs Left</span>
          </div>
          
          <p className="text-xs text-indigo-100 font-bold mt-1">Monthly allowance for quick checkouts</p>

          {/* Progress Bar */}
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

        {/* Request Form */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-4">
          <h4 className="text-sm font-extrabold text-slate-800 pb-2 border-b border-slate-100 uppercase tracking-wider">
            File Permission Request
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Date */}
            <div className="space-y-1.5">
              <label htmlFor="permDate" className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Date</label>
              <div className="relative">
                <input
                  id="permDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Time range */}
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

            {/* Calculated duration display */}
            {calculatedDuration > 0 && (
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Permission Duration:</span>
                <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl">
                  {calculatedDuration} {calculatedDuration === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
            )}

            {/* Reason */}
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

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit Button */}
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

      {/* Right Side: History registry */}
      <div className="lg:col-span-7 space-y-6">
        
        <div className="glass-card rounded-3xl p-5 border border-slate-200/80 shadow-md">
          <h4 className="text-sm font-extrabold text-slate-800 pb-2.5 border-b border-slate-100 uppercase tracking-wider mb-4">
            Permission Request History
          </h4>

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
                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {formatDate(item.date)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-600">
                          {item.fromTime} - {item.toTime}
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-slate-700">
                          {item.duration} hr
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-semibold max-w-[130px] truncate" title={item.reason}>
                          {item.reason}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Manager simulator trigger: Approve / Reject simulation directly on screen */}
                            {item.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleSimulateApproval(item.id, 'Approved')}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-100 hover:border-emerald-200 transition cursor-pointer"
                                  title="[Simulate Manager Approve]"
                                >
                                  <CheckCircle2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleSimulateApproval(item.id, 'Rejected')}
                                  className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-100 hover:border-rose-200 transition cursor-pointer"
                                  title="[Simulate Manager Reject]"
                                >
                                  <XCircle size={12} />
                                </button>
                              </>
                            ) : (
                              <button
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

export default LeavePermission;
