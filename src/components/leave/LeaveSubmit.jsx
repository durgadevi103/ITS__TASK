import React, { useState, useEffect } from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
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

export const LeaveSubmit = ({ currentUser, allowance, onSubmitRequest, onCancel, leaveRequests, stats }) => {
  // Form state fields
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
        emp_id: currentUser?.emp_id || currentUser?.employee_id || 1,
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: Input Form Controls (7 cols on lg) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Employee Info Section */}
        <EmployeeCard employee={currentUser} />

        {/* Small leave balance grid for reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-3xl p-4 shadow-sm">
          {allowance.map(item => (
            <div key={item.key} className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-inner">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.key}</span>
              <span className={`text-base font-extrabold mt-1 ${item.color}`}>{item.remaining}</span>
              <span className="text-[8px] text-slate-400 font-bold">days left</span>
            </div>
          ))}
        </div>

        {/* Request Parameter Form fields */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-md space-y-5">
          <h4 className="text-sm font-extrabold text-slate-800 pb-2.5 border-b border-slate-100 uppercase tracking-wider">Leave Parameters</h4>

          {/* Shift Picker */}
          <ShiftSelector value={shift} onChange={setShift} />

          {/* Dates Selector */}
          <LeaveDatePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            totalDays={leaveDays}
          />

          {/* Leave Type and Reason selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LeaveTypeSelect value={leaveType} onChange={setLeaveType} />
            <ReasonSelect value={leaveReason} onChange={setLeaveReason} />
          </div>

          {/* Priority */}
          <PrioritySelect value={priority} onChange={setPriority} />

          {/* Emergency Contact */}
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

          {/* Attachment upload */}
          <AttachmentUpload onChange={setAttachment} />

          {/* Comments Box */}
          <CommentBox value={comments} onChange={setComments} />

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Declaration Checkbox */}
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

          {/* Form Actions */}
          <LeaveButtons
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitLabel="Submit Leave Request"
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Widgets (5 cols on lg) */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">
        
        {/* Interactive Month Grid Calendar */}
        <LeaveCalendar
          selectedFrom={fromDate}
          selectedTo={toDate}
          leaveRequests={leaveRequests}
        />

        {/* Summary counts widget */}
        <SummaryCard stats={stats} />

        {/* Holidays list and Company events */}
        <HolidayCard />

      </div>

    </form>
  );
};

export default LeaveSubmit;
