import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send, 
  Search, 
  SlidersHorizontal, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  User,
  Info,
  CalendarDays,
  FileText
} from 'lucide-react';
import api from '../../api/axios';

const LeaveManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  
  // State for leave requests list (pre-populated with 28 items to match the reference image)
  // State for leave requests list (loaded from database)
  const [requests, setRequests] = useState([]);

  // Fetch leave requests from backend
  const fetchLeaveRequests = async () => {
    try {
      const response = await api.get('/leave/list');
      if (response.data.success && response.data.list) {
        const mapped = response.data.list.map(d => ({
          id: d.id,
          empName: d.emp_name,
          empId: d.emp_id_code,
          avatar: d.avatar,
          leaveType: d.leave_type,
          from: d.from_date,
          to: d.to_date,
          days: d.days,
          reason: d.reason,
          status: d.status,
          appliedOn: d.applied_on
        }));
        setRequests(mapped);
      }
    } catch (err) {
      console.error("Error fetching leave requests from DB", err);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);


  // Leave Balances state for dynamic deduction on approval
  const [leaveBalances, setLeaveBalances] = useState({
    CL: { label: 'Casual Leave (CL)', used: 8.5, max: 12, color: 'bg-blue-600' },
    SL: { label: 'Sick Leave (SL)', used: 7.0, max: 12, color: 'bg-emerald-600' },
    PL: { label: 'Privilege Leave (PL)', used: 12.0, max: 20, color: 'bg-amber-500' },
    ML: { label: 'Maternity Leave (ML)', used: 60.0, max: 90, color: 'bg-purple-600' }
  });

  // Form states
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [leaveType, setLeaveType] = useState('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Table filter states
  const [activeTab, setActiveTab] = useState('All'); // All, Pending, Approved, Rejected, Cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  
  // Dropdown menu state
  const [actionMenuId, setActionMenuId] = useState(null);

  // Fetch employees list from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const res = await api.get('/employee/list');
        if (res.data.success && res.data.list) {
          setEmployees(res.data.list);
          if (res.data.list.length > 0) {
            setSelectedEmpId(res.data.list[0].employee_id.toString());
          }
        }
      } catch (err) {
        console.error("Error fetching employees in Leave Manager", err);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  // Compute stats dynamically based on leaves list
  const stats = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;
    const approvedPct = total > 0 ? ((approved / total) * 100).toFixed(2) : '0.00';
    const pendingPct = total > 0 ? ((pending / total) * 100).toFixed(2) : '0.00';
    const rejectedPct = total > 0 ? ((rejected / total) * 100).toFixed(2) : '0.00';

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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }, [fromDate, toDate]);

  // Handle leave application
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedEmpId && employees.length > 0) {
      setFormError('Please select an employee.');
      return;
    }
    if (!fromDate || !toDate) {
      setFormError('Please select both From and To dates.');
      return;
    }
    if (calculatedDays <= 0) {
      setFormError('To date must be on or after From date.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a reason for the leave.');
      return;
    }

    // Get selected employee details
    let selectedEmp = null;
    if (employees.length > 0) {
      selectedEmp = employees.find(emp => emp.employee_id.toString() === selectedEmpId);
    }

    const newEmpName = selectedEmp ? selectedEmp.emp_name : 'Priya Sharma';
    const newEmpIdCode = selectedEmp ? `EMP${String(selectedEmp.employee_id).padStart(3, '0')}` : 'EMP001';
    const newAvatar = selectedEmp?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmpName)}&background=2563eb&color=fff&bold=true`;

    const formatDatePickerDate = (dateStr) => {
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const payload = {
      emp_name: newEmpName,
      emp_id_code: newEmpIdCode,
      avatar: newAvatar,
      leave_type: leaveType,
      from_date: formatDatePickerDate(fromDate),
      to_date: formatDatePickerDate(toDate),
      days: calculatedDays,
      reason,
      status: 'Pending',
      applied_on: formatDatePickerDate(new Date())
    };

    try {
      const response = await api.post('/leave/create', payload);
      if (response.data.success) {
        setFormSuccess('Leave application submitted successfully!');
        fetchLeaveRequests();
        // Reset form fields
        setFromDate('');
        setToDate('');
        setReason('');
      } else {
        setFormError(response.data.message || 'Failed to submit leave request.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Failed to contact backend API.');
    }
  };

  // Perform actions on requests (Approve, Reject, Cancel)
  const handleStatusChange = async (requestId, newStatus) => {
    // Deduct leave balance if approved
    const req = requests.find(r => r.id === requestId);
    if (req && newStatus === 'Approved') {
      const typeCode = req.leaveType.includes('Casual') ? 'CL' : 
                       req.leaveType.includes('Sick') ? 'SL' : 
                       req.leaveType.includes('Privilege') ? 'PL' : 'ML';
      
      setLeaveBalances(bal => {
        const currentBal = bal[typeCode];
        const updatedUsed = Math.min(currentBal.max, currentBal.used + req.days);
        return {
          ...bal,
          [typeCode]: { ...currentBal, used: updatedUsed }
        };
      });
    }

    try {
      const response = await api.put('/leave/update-status', { id: requestId, status: newStatus });
      if (response.data.success) {
        fetchLeaveRequests();
      }
    } catch (err) {
      console.error(err);
    }
    setActionMenuId(null);
  };

  // Filtered requests based on search query and active tab
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesTab = activeTab === 'All' || req.status === activeTab;
      const matchesSearch = req.empName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            req.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            req.leaveType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const currentTableData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredRequests.slice(start, end);
  }, [filteredRequests, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  return (
    <div className="p-4 lg:p-6 bg-[#f5f7fc] min-h-screen text-slate-800 flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Leave Management</h1>
          <p className="text-xs text-slate-500 mt-1">Overview of leave activities and requests</p>
        </div>

        {/* Global Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search (e.g. employee, leave)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
            />
            <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Row 1: Stat Overview Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Leaves */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between hover:shadow-md transition duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leaves (This Month)</span>
            <div className="text-3xl font-extrabold text-slate-900">{stats.total}</div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <TrendingUpIcon className="w-3 h-3" /> ↑ 12% from last month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Approved Leaves */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between hover:shadow-md transition duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved Leaves</span>
            <div className="text-3xl font-extrabold text-emerald-600">{stats.approved}</div>
            <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.approvedPct}% of total
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between hover:shadow-md transition duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Leaves</span>
            <div className="text-3xl font-extrabold text-amber-500">{stats.pending}</div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {stats.pendingPct}% of total
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected Leaves */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex items-center justify-between hover:shadow-md transition duration-300">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejected Leaves</span>
            <div className="text-3xl font-extrabold text-rose-600">{stats.rejected}</div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {stats.rejectedPct}% of total
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Row 2: Apply Leave Form & Leave Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Apply Leave Form */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h2 className="font-bold text-slate-800 text-sm">Apply Leave</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Request a new leave</p>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                
                {/* Employee selection */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Employee</label>
                  <select 
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {loadingEmployees ? (
                      <option>Loading employees...</option>
                    ) : employees.length > 0 ? (
                      employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.emp_name} (ID: {emp.employee_id})
                        </option>
                      ))
                    ) : (
                      <option value="">Priya Sharma (EMP001)</option>
                    )}
                  </select>
                </div>

                {/* Leave type */}
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Leave Type</label>
                  <select 
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Casual Leave (CL)</option>
                    <option>Sick Leave (SL)</option>
                    <option>Privilege Leave (PL)</option>
                    <option>Maternity Leave (ML)</option>
                  </select>
                </div>

                {/* Date pickers and Day calculation */}
                <div className="sm:col-span-4 grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">From</label>
                    <input 
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">To</label>
                    <input 
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5 text-center">Days</label>
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-center text-xs font-extrabold text-slate-750">
                      {calculatedDays}
                    </div>
                  </div>
                </div>

              </div>

              {/* Reason */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Reason</label>
                <textarea 
                  placeholder="Enter reason for leave..."
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Messages */}
              {formError && <div className="text-xs font-semibold text-rose-600 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">{formError}</div>}
              {formSuccess && <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{formSuccess}</div>}
            </form>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-50 mt-4">
            <button 
              onClick={handleApplyLeave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-200 flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Send size={14} /> Apply Leave
            </button>
          </div>
        </div>

        {/* Leave Balance Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h2 className="font-bold text-slate-800 text-sm">Leave Balance</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Available leave balance</p>
              </div>
              <div className="relative">
                <select className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-[10px] font-bold text-slate-600 outline-none hover:bg-slate-100 transition cursor-pointer appearance-none pr-6">
                  <option>2024-25</option>
                  <option>2023-24</option>
                </select>
                <ChevronDown size={10} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Leave Balance list */}
            <div className="space-y-4">
              {Object.keys(leaveBalances).map(key => {
                const bal = leaveBalances[key];
                const percentage = Math.min(100, (bal.used / bal.max) * 100);
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-450" /> {bal.label}
                      </div>
                      <span className="font-extrabold text-slate-900">{bal.used} / {bal.max} Days</span>
                    </div>
                    {/* Progress Bar background */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${bal.color} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-6 text-xs text-blue-600 font-bold hover:underline cursor-pointer">
            <span className="flex items-center gap-1.5"><Info size={13} /> View Leave Policy</span>
            <ChevronRight size={14} />
          </div>
        </div>

      </div>

      {/* Row 3: Leave Requests Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
        
        {/* Table Title & Filter Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          
          {/* Tabs Filter */}
          <div className="flex border-b border-slate-100 sm:border-none gap-2 text-xs font-bold text-slate-450 overflow-x-auto whitespace-nowrap scrollbar-none">
            {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-3 border-b-2 transition duration-200 ${
                  activeTab === tab 
                    ? 'border-blue-600 text-blue-600 font-extrabold' 
                    : 'border-transparent hover:text-slate-750 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Actions (Filter dropdown & Export) */}
          <div className="flex items-center gap-2 self-end">
            <button className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] font-bold text-slate-650 px-3 py-1.5 rounded-xl transition cursor-pointer">
              <SlidersHorizontal size={12} /> Filters
            </button>
            <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition shadow shadow-blue-200 cursor-pointer">
              <Download size={12} /> Export
            </button>
          </div>

        </div>

        {/* Table Viewport */}
        <div className="w-full overflow-x-auto select-none">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-450 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">From</th>
                <th className="py-3 px-4">To</th>
                <th className="py-3 px-4 text-center">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applied On</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
              {currentTableData.length > 0 ? (
                currentTableData.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition duration-150">
                    
                    {/* Employee Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={req.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.empName)}&background=2563eb&color=fff&bold=true`}
                          alt={req.empName} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" 
                        />
                        <div className="leading-tight">
                          <span className="font-bold text-slate-900 block">{req.empName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{req.empId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Leave Type */}
                    <td className="py-3 px-4 font-bold text-blue-650">
                      {req.leaveType}
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4 font-semibold text-slate-600">{req.from}</td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{req.to}</td>

                    {/* Total Days */}
                    <td className="py-3 px-4 font-extrabold text-slate-900 text-center">{req.days}</td>

                    {/* Reason */}
                    <td className="py-3 px-4 max-w-[200px] truncate" title={req.reason}>
                      {req.reason}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block border ${
                        req.status === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : req.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-600 border-amber-100' 
                          : req.status === 'Rejected' 
                          ? 'bg-rose-50 text-rose-600 border-rose-100' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Applied date */}
                    <td className="py-3 px-4 font-semibold text-slate-450">{req.appliedOn}</td>

                    {/* Actions Context Menu */}
                    <td className="py-3 px-4 text-center relative">
                      <button 
                        onClick={() => setActionMenuId(actionMenuId === req.id ? null : req.id)}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Menu */}
                      {actionMenuId === req.id && (
                        <div className="absolute right-6 mt-1 w-32 bg-white border border-gray-150 rounded-xl shadow-lg py-1.5 z-40 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                          {req.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(req.id, 'Approved')}
                                className="w-full text-left px-3 py-1.5 text-xs font-semibold text-emerald-650 hover:bg-emerald-50/50 transition"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleStatusChange(req.id, 'Rejected')}
                                className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-650 hover:bg-rose-50/50 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {(req.status === 'Pending' || req.status === 'Approved') && (
                            <button 
                              onClick={() => handleStatusChange(req.id, 'Cancelled')}
                              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition border-t border-slate-50"
                            >
                              Cancel
                            </button>
                          )}
                          <button 
                            onClick={() => setActionMenuId(null)}
                            className="w-full text-left px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:bg-slate-50 transition"
                          >
                            Close Menu
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 font-bold">
                    No leave requests found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Entries and Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-50 pt-4 mt-4 select-none">
            <span className="text-xs text-slate-400 font-semibold">
              Showing {Math.min(filteredRequests.length, (currentPage - 1) * rowsPerPage + 1)} to {Math.min(filteredRequests.length, currentPage * rowsPerPage)} of {filteredRequests.length} entries
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentPage === idx + 1 
                      ? 'bg-blue-600 text-white shadow shadow-blue-200' 
                      : 'border border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

// Internal icon component for Trending Up/Arrow
const TrendingUpIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default LeaveManagement;
