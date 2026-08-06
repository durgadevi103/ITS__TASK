import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowUpDown, ChevronDown, Check, X, 
  FileSpreadsheet, FileText, ChevronLeft, ChevronRight, Filter, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, exportToCSV, exportToPDF } from '../../utils/leaveUtils';

export const LeaveTable = ({ data = [], onUpdateStatus, isAdmin = false }) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [fromDateFilter, setFromDateFilter] = useState('');
  const [toDateFilter, setToDateFilter] = useState('');
  const [showAdvanceFilters, setShowAdvanceFilters] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState('leave_from');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Leave types list
  const leaveTypes = ['Casual Leave (CL)', 'Sick Leave (SL)', 'Privilege Leave (PL)', 'Maternity Leave (ML)'];

  // Handle Sort Change
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
    setCurrentPage(1);
  };

  // Filter & Sort logic
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        String(item.emp_id).toLowerCase().includes(q) ||
        (item.emp_name || '').toLowerCase().includes(q) ||
        (item.leave_reason || '').toLowerCase().includes(q) ||
        (item.leave_type || '').toLowerCase().includes(q)
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(item => item.leave_status === statusFilter);
    }

    // 3. Leave Type Filter
    if (typeFilter !== 'All') {
      result = result.filter(item => item.leave_type === typeFilter);
    }

    // 4. Date Filters
    if (fromDateFilter) {
      result = result.filter(item => new Date(item.leave_from) >= new Date(fromDateFilter));
    }
    if (toDateFilter) {
      result = result.filter(item => new Date(item.leave_to) <= new Date(toDateFilter));
    }

    // 5. Sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null/undefined values
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      // Date comparison
      if (sortField === 'leave_from' || sortField === 'leave_to') {
        const aTime = new Date(aValue).getTime() || 0;
        const bTime = new Date(bValue).getTime() || 0;
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }

      // Numeric comparison
      if (sortField === 'leave_days' || sortField === 'leave_id') {
        return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      }

      // String comparison
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return result;
  }, [data, searchQuery, statusFilter, typeFilter, fromDateFilter, toDateFilter, sortField, sortDirection]);

  // Pagination details
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = processedData.slice(startIndex, startIndex + pageSize);

  // Clear filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All');
    setFromDateFilter('');
    setToDateFilter('');
    setCurrentPage(1);
  };

  // Export functions
  const handleExportCSV = () => {
    const headers = [
      { key: 'leave_id', label: 'Request ID' },
      { key: 'emp_id', label: 'Emp ID' },
      { key: 'emp_name', label: 'Employee Name' },
      { key: 'leave_type', label: 'Leave Type' },
      { key: 'leave_from', label: 'From Date' },
      { key: 'leave_to', label: 'To Date' },
      { key: 'leave_days', label: 'Duration (Days)' },
      { key: 'leave_reason', label: 'Reason' },
      { key: 'leave_status', label: 'Status' }
    ];
    exportToCSV(headers, processedData, `leave_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportPDF = () => {
    const headers = [
      { key: 'leave_id', label: 'ID' },
      { key: 'emp_name', label: 'Employee' },
      { key: 'leave_type', label: 'Type' },
      { key: 'leave_from', label: 'From' },
      { key: 'leave_to', label: 'To' },
      { key: 'leave_days', label: 'Days' },
      { key: 'leave_status', label: 'Status' }
    ];
    // Map dates to print friendly values
    const printData = processedData.map(item => ({
      ...item,
      leave_from: formatDate(item.leave_from),
      leave_to: formatDate(item.leave_to),
      emp_name: item.emp_name || `Emp #${item.emp_id}`
    }));
    exportToPDF('Employee Leave Records Report', headers, printData);
  };

  return (
    <div className="space-y-4">
      {/* Table Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Live Search */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search ID, employee name..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Quick Filters */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3.5 py-2 border border-slate-200 rounded-2xl text-xs font-semibold bg-white cursor-pointer focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            onClick={() => setShowAdvanceFilters(!showAdvanceFilters)}
            className={`flex items-center gap-1 px-3.5 py-2 border rounded-2xl text-xs font-bold transition cursor-pointer ${
              showAdvanceFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter size={13} />
            Advanced
          </button>
        </div>

        {/* Data Exports */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-2xl text-xs font-extrabold cursor-pointer transition shadow-sm"
          >
            <FileSpreadsheet size={14} className="text-emerald-600" />
            Excel CSV
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-2xl text-xs font-extrabold cursor-pointer transition shadow-sm"
          >
            <FileText size={14} className="text-rose-600" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanceFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Leave Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-2xl text-xs font-semibold bg-white focus:outline-none"
                >
                  <option value="All">All Types</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Date Filters */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">From Date</label>
                <input
                  type="date"
                  value={fromDateFilter}
                  onChange={(e) => { setFromDateFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-2xl text-xs font-semibold bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">To Date</label>
                <input
                  type="date"
                  value={toDateFilter}
                  onChange={(e) => { setToDateFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-2xl text-xs font-semibold bg-white focus:outline-none"
                />
              </div>

              {/* Reset link */}
              <div className="sm:col-span-3 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-black text-rose-600 hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Data Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full border-collapse text-left text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 select-none text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th onClick={() => handleSort('leave_id')} className="py-4 px-5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition">
                  <div className="flex items-center gap-1.5">
                    ID
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th onClick={() => handleSort('emp_name')} className="py-4 px-5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition">
                  <div className="flex items-center gap-1.5">
                    Employee
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th onClick={() => handleSort('leave_type')} className="py-4 px-5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition">
                  <div className="flex items-center gap-1.5">
                    Leave Type
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th onClick={() => handleSort('leave_from')} className="py-4 px-5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition">
                  <div className="flex items-center gap-1.5">
                    Dates
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th onClick={() => handleSort('leave_days')} className="py-4 px-5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    Days
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-4 px-5">Reason</th>
                <th onClick={() => handleSort('leave_status')} className="py-4 px-5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    Status
                    <ArrowUpDown size={11} />
                  </div>
                </th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-xl shadow-inner">
                        📭
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">No Leave Requests Found</h4>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  // Render status badge
                  let statusBadge = '';
                  if (row.leave_status === 'Approved') {
                    statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  } else if (row.leave_status === 'Rejected') {
                    statusBadge = 'bg-rose-50 text-rose-700 border-rose-100';
                  } else {
                    statusBadge = 'bg-amber-50 text-amber-700 border-amber-100';
                  }

                  const name = row.emp_name || `Employee #${row.emp_id}`;

                  return (
                    <tr key={row.leave_id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      {/* Leave ID */}
                      <td className="py-3.5 px-5 font-bold text-slate-700">
                        #{row.leave_id}
                      </td>

                      {/* Employee Details */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold border border-slate-200">
                            {name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800">{name}</p>
                            <p className="text-[10px] font-bold text-slate-400">ID: {row.emp_id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="py-3.5 px-5 font-bold text-slate-600 text-xs">
                        {row.leave_type}
                      </td>

                      {/* Date Range */}
                      <td className="py-3.5 px-5 text-xs text-slate-600">
                        <span className="font-extrabold">{formatDate(row.leave_from)}</span>
                        <span className="mx-1 text-slate-400">to</span>
                        <span className="font-extrabold">{formatDate(row.leave_to)}</span>
                      </td>

                      {/* Days */}
                      <td className="py-3.5 px-5 text-center font-extrabold text-xs text-slate-700">
                        {row.leave_days} d
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-5 text-xs text-slate-500 font-semibold max-w-[150px] truncate" title={row.leave_reason}>
                        {row.leave_reason || '-'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                          {row.leave_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        {row.leave_status === 'Pending' && isAdmin ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onUpdateStatus(row.leave_id, 'Approved')}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-200 shadow-sm transition cursor-pointer"
                              title="Approve Request"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => onUpdateStatus(row.leave_id, 'Rejected')}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 shadow-sm transition cursor-pointer"
                              title="Reject Request"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                            Locked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="py-3 px-5 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500 select-none bg-slate-50/50">
            <span>
              Showing <span className="text-slate-800 font-bold">{startIndex + 1}</span> to <span className="text-slate-800 font-bold">{Math.min(startIndex + pageSize, totalItems)}</span> of <span className="text-slate-800 font-bold">{totalItems}</span> requests
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition cursor-pointer"
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

export default LeaveTable;
