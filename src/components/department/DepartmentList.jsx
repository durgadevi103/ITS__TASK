import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SearchBtn,
  FilterBtn,
  ActionBtn
} from '../button';
import {
  Building2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DepartmentList = ({
  departments,
  onAddClick,
  onEditClick,
  onViewClick,
  onToggleStatus
}) => {
  const navigate = useNavigate();
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  // Sorting state
  const [sortField, setSortField] = useState('id'); // name, createdAt, id
  const [sortDirection, setSortDirection] = useState('asc'); // asc, desc

  // Pagination state
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const statuses = ['All', 'Active', 'Inactive'];

  // Handle Search Trigger
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setActiveSearch(searchQuery);
    setCurrentPage(1);
  };

  // Real-time search + search button submit
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Real-time search update for convenience
    setActiveSearch(e.target.value);
    setCurrentPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveSearch('');
    setFilterStatus('All');
    setCurrentPage(1);
  };

  // Handle column sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Filtered & Sorted departments
  const processedDepartments = useMemo(() => {
    let result = [...departments];

    // 1. Search Query filter
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      result = result.filter(dept =>
        dept.name.toLowerCase().includes(q) ||
        dept.dept_id_code.toLowerCase().includes(q) ||
        dept.description.toLowerCase().includes(q) ||
        dept.id.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (filterStatus !== 'All') {
      result = result.filter(dept => dept.status === filterStatus);
    }

    // 4. Sort
    result.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (sortField === 'id') {
        // Numeric sorting for ID (DEP001 -> 1)
        const aNum = parseInt(aVal.replace('DEP', '')) || 0;
        const bNum = parseInt(bVal.replace('DEP', '')) || 0;
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      aVal = aVal.toString().toLowerCase();
      bVal = bVal.toString().toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [departments, activeSearch, filterStatus, sortField, sortDirection]);

  // Paginated departments
  const totalItems = processedDepartments.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;

  // Safe page constraint
  const activePage = Math.min(currentPage, totalPages);

  const fromIndex = totalItems === 0 ? 0 : (activePage - 1) * perPage;
  const toIndex = Math.min(fromIndex + perPage, totalItems);

  const paginatedDepartments = useMemo(() => {
    return processedDepartments.slice(fromIndex, toIndex);
  }, [processedDepartments, fromIndex, toIndex]);

  // Page Numbers Array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Sort Arrow helper
  const renderSortArrow = (field) => {
    if (sortField !== field) {
      return (
        <span className="flex flex-col ml-1 text-gray-300">
          <ChevronUp size={10} className="-mb-0.5" />
          <ChevronDown size={10} className="-mt-0.5" />
        </span>
      );
    }
    return sortDirection === 'asc' ? (
      <ChevronUp size={12} className="ml-1 text-indigo-600 font-bold" />
    ) : (
      <ChevronDown size={12} className="ml-1 text-indigo-600 font-bold" />
    );
  };

  return (
    <div className="p-3 bg-[#f8fafc] h-[calc(100vh-4.2rem)] flex flex-col gap-3 text-gray-700 overflow-hidden">

      {/* Unified Header & Filter Section */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">

        {/* Left Side: Breadcrumbs */}
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 leading-tight">Departments</h1>
          <nav className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-0.5">
            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-450">HR Management</span>
            <span>/</span>
            <span className="text-gray-500">Departments</span>
          </nav>
        </div>

        {/* Right Side: Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end w-full">
          {/* Search + Filter buttons group */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-lg w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full pl-3 pr-3 py-1.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition font-semibold"
              />
            </div>

            {/* Search Button */}
            <SearchBtn type="submit" />

            {/* Filter Toggle Button */}
            <FilterBtn onClick={() => setShowFilters(!showFilters)} />

            {/* Clear Button if filtered */}
            {(activeSearch || filterStatus !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 text-gray-450 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </form>

        </div>

        {/* Expandable Filter drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full border-t border-slate-100 pt-3 flex flex-wrap items-center gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Status:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
                  {statuses.map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        setFilterStatus(st);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${filterStatus === st
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Table Card */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-h-0">
        {/* List Header Card with Add Department Button */}
        <div className="px-5 py-3.5 border-b border-gray-150 flex items-center justify-between shrink-0 bg-gray-50/20">
          <div className="font-extrabold text-sm text-gray-800 tracking-tight flex items-center gap-2">
            <span>Department List</span>
            <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black">
              {departments.length}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -0.5, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddClick}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 text-[10.5px] whitespace-nowrap cursor-pointer glossy-shine"
          >
            <Plus size={13} />
            <span>Add Department</span>
          </motion.button>
        </div>

        {/* Scrollable table viewport */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-left border-collapse min-w-full">
            <thead className="sticky top-0 bg-gray-50/90 backdrop-blur-xs border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th
                  className="py-3 px-4 w-52 cursor-pointer hover:bg-gray-100 transition select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {renderSortArrow('name')}
                  </div>
                </th>
                <th
                  className="py-3 px-4 w-40 cursor-pointer hover:bg-gray-100 transition select-none"
                  onClick={() => handleSort('dept_id_code')}
                >
                  <div className="flex items-center">
                    Dep Code
                    {renderSortArrow('dept_id_code')}
                  </div>
                </th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-40 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-650 font-medium">
              {paginatedDepartments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-amber-500 opacity-60" />
                      <p className="font-bold text-gray-800 text-sm">No departments found</p>
                      <p className="text-[10px] text-gray-400">Try adjusting your search filters or add a new department to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDepartments.map((dept, index) => {
                  const itemIndex = fromIndex + index + 1;
                  const isActive = dept.status === 'Active';

                  return (
                    <tr
                      key={dept.id}
                      onClick={() => onViewClick(dept)}
                      className="hover:bg-[#f8fafc]/50 transition duration-100 cursor-pointer"
                    >
                      {/* # Index column */}
                      <td className="py-3.5 px-4 text-center font-bold text-gray-400">
                        {itemIndex}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 leading-tight">
                        {dept.name}
                      </td>

                      {/* Dep Code */}
                      <td className="py-3.5 px-4 font-bold text-indigo-650">
                        {dept.dept_id_code}
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 text-gray-400 leading-relaxed font-medium">
                        <div className="line-clamp-2 max-w-md" title={dept.description}>
                          {dept.description}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${isActive
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {dept.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <ActionBtn type="view" onClick={() => onViewClick(dept)} />
                          <ActionBtn type="edit" onClick={() => onEditClick(dept)} />
                          <ActionBtn
                            type="lock"
                            active={isActive}
                            onClick={() => onToggleStatus(dept.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white border-t border-gray-150 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 shrink-0 font-medium select-none">
          {/* Pagination summary info */}
          <div>
            Showing <span className="font-bold text-gray-700">{totalItems === 0 ? 0 : fromIndex + 1}</span> to <span className="font-bold text-gray-700">{toIndex}</span> of <span className="font-bold text-gray-700">{totalItems}</span> departments
          </div>

          {/* Next/Prev Page navigation controls */}
          <div className="flex items-center gap-1.5 font-bold">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`px-2.5 py-1.5 border border-slate-200 text-slate-650 rounded-xl hover:bg-slate-100 transition cursor-pointer text-[10px] font-black ${
                currentPage === 1 ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              Prev
            </button>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase px-1.5">
              Page {currentPage} of {totalPages}
            </span>
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

          {/* Per Page Select dropdown (on the right side) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>Per Page:</span>
            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none min-w-[70px]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <ChevronDown size={13} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DepartmentList;
