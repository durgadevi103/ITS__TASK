import React, { useState, useMemo } from 'react';
import { 
  SearchBtn, 
  FilterBtn, 
  AddDepartmentBtn, 
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
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DepartmentList = ({ 
  departments, 
  onAddClick, 
  onEditClick, 
  onViewClick, 
  onToggleStatus 
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Sorting state
  const [sortField, setSortField] = useState('id'); // name, createdAt, id
  const [sortDirection, setSortDirection] = useState('asc'); // asc, desc

  // Pagination state
  const [perPage, setPerPage] = useState(10);
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
    <div className="p-4 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col gap-4 text-gray-700 overflow-hidden">
      
      {/* Breadcrumb & Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Departments</h1>
          <nav className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5 mt-0.5">
            <span className="cursor-pointer hover:text-indigo-600 transition">Dashboard</span>
            <span>/</span>
            <span className="text-gray-400">HR Management</span>
            <span>/</span>
            <span className="text-gray-500">Departments</span>
          </nav>
        </div>
        
        {/* Add Department Green Button at Top Right */}
        <AddDepartmentBtn onClick={onAddClick} />
      </div>

      {/* Control Card (Search, Filters, Per Page) */}
      <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search + Filter buttons group */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-lg w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full pl-3 pr-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
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
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                title="Reset filters"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </form>

          {/* Per Page Select dropdown */}
          <div className="flex items-center gap-2 justify-end text-xs text-gray-500 font-semibold">
            <span>Per Page:</span>
            <div className="relative">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-gray-700 font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer appearance-none min-w-[70px]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={12} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filters Box */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-gray-100 pt-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
                {/* Status filter */}
                <div className="space-y-1 max-w-xs">
                  <label className="block text-[10px] font-bold text-gray-450 uppercase tracking-wider">Filter By Status</label>
                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer appearance-none"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Table Card */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden min-h-0">
        
        {/* Scrollable table viewport */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-left border-collapse min-w-[800px]">
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
                      className="hover:bg-[#f8fafc]/50 transition duration-100"
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
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {dept.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
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
        <div className="bg-white border-t border-gray-150 px-4 py-3 flex items-center justify-between text-xs text-gray-500 shrink-0 font-medium select-none">
          {/* Pagination summary info */}
          <div>
            Showing <span className="font-bold text-gray-700">{totalItems === 0 ? 0 : fromIndex + 1}</span> to <span className="font-bold text-gray-700">{toIndex}</span> of <span className="font-bold text-gray-700">{totalItems}</span> departments
          </div>

          {/* Numbers list */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Previous */}
              <button
                disabled={activePage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              {/* Page buttons */}
              {pageNumbers.map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition cursor-pointer ${
                    num === activePage 
                      ? 'bg-[#00b074] text-white shadow-md shadow-emerald-500/10' 
                      : 'border border-transparent hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {num}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DepartmentList;
