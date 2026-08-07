import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Attendance = () => {
  const navigate = useNavigate();
  
  // 1. Data States
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('2025-08-05'); // Defaults to the date in reference mock
  const [filterDept, setFilterDept] = useState('All Departments');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [showFilters, setShowFilters] = useState(false);

  // Applied filter state triggered on filter submission
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedDept, setAppliedDept] = useState('All Departments');
  const [appliedStatus, setAppliedStatus] = useState('All Status');
  const [appliedDate, setAppliedDate] = useState('2025-08-05');

  // 3. Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load Employees and Departments on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Fetch employees
        const empRes = await api.get('/employee/list/1000/0');
        if (empRes.data.success && empRes.data.list) {
          setEmployees(empRes.data.list);
        }

        // Fetch departments
        const deptRes = await api.get('/department/list/1000/0');
        const deptData = deptRes.data.data || deptRes.data.list;
        if (deptRes.data.success && deptData) {
          setDepartments(deptData.map((d, index) => ({
            dept_id: d.dept_id,
            id: d.dept_id ? `DEP${String(d.dept_id).padStart(3, '0')}` : (typeof d.id === 'string' && d.id.startsWith('DEP') ? d.id : `DEP${String(d.id || index + 1).padStart(3, '0')}`),
            dept_id_code: d.dept_code || d.dept_id_code || `DEP${index + 1}`,
            name: d.dept_name || d.name,
            branch: d.branch || "Chennai",
            description: d.dept_desc || d.description,
            status: (d.dept_status === 0 || d.dept_status === '0' || d.dept_status === 'Inactive') ? 'Inactive' : 'Active',
            createdAt: d.created_at || new Date().toISOString().split('T')[0]
          })));
        }
      } catch (err) {
        console.error("Error loading attendance base data", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Generate deterministic attendance details based on employee details
  const attendanceList = useMemo(() => {
    return employees.map((emp, index) => {
      const empNumId = parseInt(emp.emp_id || emp.employee_id) || index + 1;
      
      // Determine status deterministically
      let status = 'Checked Out';
      if (emp.emp_status === 'Inactive') {
        status = 'Not Checked In';
      } else if (emp.emp_status === 'On Leave') {
        status = 'On Leave';
      } else {
        const mod = empNumId % 5;
        if (mod === 0) status = 'Checked Out';
        else if (mod === 1) status = 'Checked In';
        else if (mod === 2) status = 'On Leave';
        else if (mod === 3) status = 'Not Checked In';
        else if (mod === 4) status = 'Weekly Off';
      }

      // Generate times based on status
      let checkIn = '-';
      let checkOut = '-';
      let workHours = '-';

      if (status === 'Checked In' || status === 'Checked Out') {
        // Deterministic Check-In: e.g. 09:00 AM + (empNumId % 25) minutes
        const minuteVal = empNumId % 25;
        const checkInHour = 9;
        const checkInMinute = minuteVal;
        checkIn = `09:${String(checkInMinute).padStart(2, '0')} AM`;

        if (status === 'Checked Out') {
          // Deterministic Check-Out: e.g. 05:30 PM + (empNumId % 35) minutes
          const outMinuteVal = empNumId % 35;
          const checkOutHour = 5; // 5 PM
          const checkOutMinute = outMinuteVal;
          checkOut = `05:${String(checkOutMinute).padStart(2, '0')} PM`;

          // Calculate work hours
          const totalInMinutes = checkInHour * 60 + checkInMinute;
          const totalOutMinutes = (checkOutHour + 12) * 60 + checkOutMinute;
          const diff = totalOutMinutes - totalInMinutes;
          const h = Math.floor(diff / 60);
          const m = diff % 60;
          workHours = `${h}h ${String(m).padStart(2, '0')}m`;
        }
      }

      // Find department name
      const deptName = (() => {
        const dept = departments.find(d => 
          String(d.dept_id) === String(emp.emp_dept) || 
          d.dept_id_code === emp.emp_dept || 
          d.name === emp.emp_dept
        );
        return dept ? dept.name : emp.emp_dept || 'General';
      })();

      return {
        idx: index + 1,
        employee_id: emp.emp_id || emp.employee_id,
        id: `EMP${String(emp.emp_id || emp.employee_id).padStart(3, '0')}`,
        name: emp.emp_name,
        department: deptName,
        dept_id: emp.emp_dept,
        checkIn,
        checkOut,
        workHours,
        status
      };
    });
  }, [employees, departments]);

  // Apply filters in-memory
  const filteredAttendance = useMemo(() => {
    return attendanceList.filter(item => {
      // 1. Search filter (Name, Emp ID, Department)
      const q = appliedSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        (item.name || '').toLowerCase().includes(q) ||
        (item.id || '').toLowerCase().includes(q) ||
        (item.department || '').toLowerCase().includes(q);

      // 2. Department filter
      const matchesDept = appliedDept === 'All Departments' ||
        String(item.dept_id) === String(appliedDept) ||
        item.department === appliedDept;

      // 3. Status filter
      const matchesStatus = appliedStatus === 'All Status' ||
        item.status === appliedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [attendanceList, appliedSearch, appliedDept, appliedStatus]);

  // Handle Search Submission/Filtering
  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault();
    setAppliedSearch(searchQuery);
    setAppliedDept(filterDept);
    setAppliedStatus(filterStatus);
    setAppliedDate(filterDate);
    setCurrentPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDept('All Departments');
    setFilterStatus('All Status');
    setFilterDate('2025-08-05');
    setAppliedSearch('');
    setAppliedDept('All Departments');
    setAppliedStatus('All Status');
    setAppliedDate('2025-08-05');
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalItems = filteredAttendance.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const fromIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize;
  const toIndex = Math.min(fromIndex + pageSize, totalItems);

  const paginatedAttendance = useMemo(() => {
    return filteredAttendance.slice(fromIndex, toIndex);
  }, [filteredAttendance, fromIndex, toIndex]);

  // Status Badge style helper
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Checked Out':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Checked In':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'On Leave':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Not Checked In':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'Weekly Off':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      default:
        return 'bg-gray-50 text-gray-550 border border-gray-150';
    }
  };

  return (
    <div className="p-0 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col gap-3 text-gray-700 overflow-hidden relative font-sans">
      
      {/* Unified Header & Filter Section */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 shrink-0">
        <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left Side: Breadcrumbs */}
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 leading-tight">Attendance</h1>
              <nav className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-1">
                <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Dashboard</span>
                <span>/</span>
                <span className="text-gray-550">Attendance</span>
              </nav>
            </div>

            {/* Right Side: Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end w-full">
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search size={14} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, emp id or department..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 font-semibold"
                />
              </div>

              {/* Date Picker */}
              <div className="relative min-w-[140px] w-full sm:w-auto">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                />
              </div>

              {/* Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-1.5 font-extrabold px-5 py-2 rounded-xl border transition-all text-xs cursor-pointer active:scale-95 w-full sm:w-auto ${
                  showFilters 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                </svg>
                <span>Filter</span>
              </button>

              {/* Reset Button */}
              {(appliedSearch || appliedDept !== 'All Departments' || appliedStatus !== 'All Status' || appliedDate !== '2025-08-05') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-xl transition text-xs cursor-pointer active:scale-95 shadow-sm bg-white w-full sm:w-auto"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Expandable Filter drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full border-t border-slate-100 pt-3 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold py-1">
                  
                  {/* Department Dropdown */}
                  <div className="flex flex-col gap-1.5 min-w-[180px]">
                    <span className="text-slate-400">Department:</span>
                    <div className="relative">
                      <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none"
                      >
                        <option value="All Departments">All Departments</option>
                        {departments.map(d => (
                          <option key={d.dept_id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex flex-col gap-1.5 min-w-[160px]">
                    <span className="text-slate-400">Status:</span>
                    <div className="relative">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none"
                      >
                        <option value="All Status">All Status</option>
                        <option value="Checked In">Checked In</option>
                        <option value="Checked Out">Checked Out</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Not Checked In">Not Checked In</option>
                        <option value="Weekly Off">Weekly Off</option>
                      </select>
                      <ChevronDown size={13} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </div>

      {/* Main Table Card */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-0">
        
        {/* Table Viewport */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider z-10">
              <tr>
                <th className="py-3.5 px-5 w-12 text-center">#</th>
                <th className="py-3.5 px-4 w-28">Emp ID</th>
                <th className="py-3.5 px-4">Employee Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 w-32">Check In</th>
                <th className="py-3.5 px-4 w-32">Check Out</th>
                <th className="py-3.5 px-4 w-32">Work Hours</th>
                <th className="py-3.5 px-4 w-36">Status</th>
                <th className="py-3.5 px-5 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-gray-400 font-bold">
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                      Loading attendance data...
                    </div>
                  </td>
                </tr>
              ) : paginatedAttendance.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-gray-450 font-bold">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                paginatedAttendance.map((item, index) => {
                  const displayIndex = fromIndex + index + 1;
                  return (
                    <tr key={item.employee_id} className="hover:bg-slate-50/50 transition duration-150">
                      
                      {/* # Index */}
                      <td className="py-3.5 px-5 text-center font-bold text-gray-400">{displayIndex}</td>

                      {/* Emp ID */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => navigate('/employees', { state: { searchId: item.employee_id } })}
                          className="text-blue-600 hover:underline font-bold text-left cursor-pointer"
                        >
                          {item.id}
                        </button>
                      </td>

                      {/* Employee Name */}
                      <td className="py-3.5 px-4 text-slate-900 font-bold">{item.name}</td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-650">{item.department}</td>

                      {/* Check In */}
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {item.checkIn}
                      </td>

                      {/* Check Out */}
                      <td className="py-3.5 px-4 font-bold text-rose-500">
                        {item.checkOut}
                      </td>

                      {/* Work Hours */}
                      <td className="py-3.5 px-4 text-slate-800 font-bold">{item.workHours}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold inline-flex items-center ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => navigate('/employees', { state: { searchId: item.employee_id } })}
                          className="px-2.5 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white border-t border-slate-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0 font-semibold select-none">
          <div>
            Showing <span className="font-bold text-slate-700">{totalItems === 0 ? 0 : fromIndex + 1}</span> to <span className="font-bold text-slate-700">{toIndex}</span> of <span className="font-bold text-slate-700">{totalItems}</span> entries
          </div>

          <div className="flex items-center gap-1.5 font-bold">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`px-2.5 py-1.5 border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-100 transition cursor-pointer text-[10px] font-black ${
                currentPage === 1 ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7.5 h-7.5 flex items-center justify-center rounded-lg transition text-[10.5px] font-black cursor-pointer ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 hover:bg-slate-100 text-slate-650'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={`px-2.5 py-1.5 border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-100 transition cursor-pointer text-[10px] font-black ${
                currentPage === totalPages ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              Next
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Attendance;
