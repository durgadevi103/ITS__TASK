import React, { useState, useEffect, useRef } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import { calculateLeaveDays } from '../../utils/leaveUtils';
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

export const LeaveSubmit = ({ currentUser, allowance, onSubmitRequest, onCancel, leaveRequests, stats, employees = [], fetchAllowance }) => {
  // Form state fields
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

  useEffect(() => {
    if (currentUser) {
      setEmpId(currentUser.emp_id || currentUser.employee_id || '');
      setEmpName(currentUser.emp_name || currentUser.fullName || '');
    }
  }, [currentUser]);
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

  // Automatically calculate total leave days when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      const days = calculateLeaveDays(fromDate, toDate);
      // Adjust if half day
      if (shift !== 'full' && days > 0) {
        setLeaveDays(0.5);
      } else {
        setLeaveDays(days);
      }
    } else {
      setLeaveDays(0);
    }
  }, [fromDate, toDate, shift]);

  // Form Submission
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
      if (result.success) {
        // Reset state
        setFromDate('');
        setToDate('');
        setLeaveType('');
        setLeaveReason('');
        setComments('');
        setDeclarationAccepted(false);
        setAttachment(null);
        alert('Leave request submitted successfully!');
        if (onCancel) onCancel(); // Back to dashboard
      } else {
        setErrorMessage(result.error || 'Failed to submit leave request.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      {/* LEFT COLUMN: Input Form Controls (7 cols on lg) */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Employee Info Section */}
        <EmployeeCard employee={currentUser} />

        {/* Small leave balance grid for reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 shadow-sm">
          {allowance.map(item => (
            <div key={item.key} className="bg-white p-2 py-2.5 rounded-xl border border-slate-100 flex flex-col items-center text-center shadow-inner">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.key}</span>
              <span className={`text-base font-extrabold mt-0.5 ${item.color}`}>{item.remaining}</span>
              <span className="text-[8px] text-slate-400 font-bold">days left</span>
            </div>
          ))}
        </div>

        {/* Request Parameter Form fields */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3.5">
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

          {/* Dates Selector */}
          <LeaveDatePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            totalDays={leaveDays}
          />

          {/* Leave Type and Reason selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <LeaveTypeSelect value={leaveType} onChange={setLeaveType} />
            <ReasonSelect value={leaveReason} onChange={setLeaveReason} />
          </div>

          {/* Priority */}
          <PrioritySelect value={priority} onChange={setPriority} />

          {/* Emergency Contact */}
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

          {/* Attachment upload */}
          <AttachmentUpload onChange={setAttachment} />

          {/* Comments Box */}
          <CommentBox value={comments} onChange={setComments} />

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Declaration Checkbox */}
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

          {/* Form Actions */}
          <LeaveButtons
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitLabel="Save"
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Widgets (5 cols on lg) */}
      <div className="lg:col-span-5 space-y-4 flex flex-col lg:h-full">
        
        {/* Interactive Month Grid Calendar */}
        <LeaveCalendar
          selectedFrom={fromDate}
          selectedTo={toDate}
          leaveRequests={leaveRequests}
        />

        {/* Summary counts widget */}
        <SummaryCard stats={stats} />

        {/* Holidays list */}
        <HolidayCard className="flex-1 flex flex-col" />

      </div>

    </form>
  );
};

export default LeaveSubmit;
