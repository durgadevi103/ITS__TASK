import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Eye,
  Pencil,
  Mail,
  Phone,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

// Glowing and pulsing status badges
const StatusBadge = ({ status }) => {
  const getStatusColor = (s) => {
    switch (s) {
      case "Active": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "On Leave": return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Inactive": return "bg-gray-50 text-gray-500 border border-gray-100";
      default: return "bg-gray-50 text-gray-500 border border-gray-100";
    }
  };
  
  const glowColor = status === "Active" ? "rgba(16, 185, 129, 0.25)" :
                    status === "On Leave" ? "rgba(245, 158, 11, 0.25)" : "rgba(156, 163, 175, 0.15)";

  return (
    <motion.span
      animate={status === "Active" || status === "On Leave" ? {
        boxShadow: [`0 0 0 0px ${glowColor}`, `0 0 0 5px ${glowColor}`, `0 0 0 0px ${glowColor}`]
      } : {}}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-black inline-flex items-center gap-1.5 tracking-wider uppercase ${getStatusColor(status)}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === "Active" ? "bg-emerald-500" :
        status === "On Leave" ? "bg-amber-500" : "bg-gray-400"
      }`} />
      {status}
    </motion.span>
  );
};

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [toastMsg, setToastMsg] = useState("");
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedStatus]);

  const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18
      }
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employee/list');
      if (response.data.success) {
        const sorted = response.data.list.sort((a, b) => a.employee_id - b.employee_id);
        const maxId = Math.max(...sorted.map(e => parseInt(e.employee_id)).filter(id => !isNaN(id)), 0);
        const mapped = sorted.map((emp, index) => {
          const empNumId = parseInt(emp.employee_id);
          const isNewHire = sorted.length <= 3 || (empNumId >= maxId - 2);
          return {
            id: `EMP${String(index + 1).padStart(3, '0')}`,
            employee_id: emp.employee_id,
            name: emp.emp_name,
            email: emp.emp_email,
            dob: emp.emp_dob,
            gender: emp.emp_gender,
            phone: emp.emp_ph_no,
            address: emp.emp_address,
            emergencyContact: emp.emp_emg_contact,
            emergencyPhone: emp.emp_emg_phone,
            bloodGroup: emp.emp_bld_grp,
            maritalStatus: emp.emp_merit,
            nationality: emp.emp_nationality,
            languages: emp.emp_language,
            department: emp.emp_dept,
            designation: emp.emp_designation || emp.emp_desigation,
            salary: emp.emp_slary || '',
            status: 'Active', // Default status as active for demo visuals
            avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.emp_name)}&background=2563eb&color=fff&bold=true`,
            isNewHire: isNewHire
          };
        });
        setEmployees(mapped);
      }
    } catch (err) {
      console.error("Error loading employees from backend", err);
      setEmployees([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/department/list/100/0');
      const listData = response.data.data || response.data.list;
      if (response.data.success && listData) {
        const mapped = listData.map(d => ({
          name: d.dept_name || d.name,
          dept_code: d.dept_code || d.dept_id_code
        }));
        setDepartments(mapped);
        return;
      }
    } catch (err) {
      console.error("Error loading departments for filtering", err);
    }

    // Fallback
    const local = sessionStorage.getItem('departmentsData');
    if (local) {
      setDepartments(JSON.parse(local));
    } else {
      setDepartments([{ name: 'Information Technology' }, { name: 'Human Resources' }, { name: 'Finance' }]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Filter conditions
  const filteredEmployees = employees.filter(emp => {
    const nameStr = emp.name ? emp.name.toLowerCase() : "";
    const emailStr = emp.email ? emp.email.toLowerCase() : "";
    const idStr = emp.id ? emp.id.toLowerCase() : "";
    const dbIdStr = emp.employee_id ? String(emp.employee_id).toLowerCase() : "";
    
    const matchesSearch = nameStr.includes(searchTerm.toLowerCase()) ||
                          emailStr.includes(searchTerm.toLowerCase()) ||
                          idStr.includes(searchTerm.toLowerCase()) ||
                          dbIdStr.includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "All Departments" || emp.department === selectedDept;
    const matchesStatus = selectedStatus === "All Status" || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const displayedEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getDeptColor = (dept) => {
    switch (dept) {
      case "IT": return "bg-[#eff6ff] text-[#2563eb] border border-blue-100";
      case "HR": return "bg-[#faf5ff] text-[#9333ea] border border-purple-100";
      case "Finance": return "bg-[#fffbeb] text-[#d97706] border border-amber-100";
      case "Marketing": return "bg-[#fff1f2] text-[#e11d48] border border-rose-100";
      case "Operations": return "bg-[#f0fdfa] text-[#0d9488] border border-teal-100";
      default: return "bg-slate-50 text-slate-600 border border-slate-200/50";
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="p-4 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col gap-4 text-gray-700 overflow-hidden relative"
    >
      
      {/* Dynamic Slide-in Toast Notice */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold border border-gray-800"
          >
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg("")} className="text-gray-400 hover:text-white p-0.5 cursor-pointer">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Header & Filter Section */}
      {!selectedEmployee && (
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
          
          {/* Left Side: Breadcrumbs */}
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 leading-tight">Employees</h1>
            <nav className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
              <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Dashboard</span>
              <span>/</span>
              <span className="text-gray-500">Employees</span>
            </nav>
          </div>
          
          {/* Right Side: Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end w-full">
            
            {/* Search Field */}
            <div className="relative flex-1 max-w-xs w-full">
              <Search size={14} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search details..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 font-semibold"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Department Select */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer appearance-none min-w-[130px]"
                >
                  <option value="All Departments">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.dept_code || dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="text-gray-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Status Select */}
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer appearance-none min-w-[110px]"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown size={13} className="text-gray-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split-Pane Grid Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden select-none">
        
        {/* Left Card list */}
        {!selectedEmployee && (
          <motion.div 
            layout
            className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden h-full flex-1"
          >
            {/* List Header Card with Add Employee Button */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/20">
              <div className="font-extrabold text-sm text-slate-800 tracking-tight flex items-center gap-2">
                <span>Employee List</span>
                <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {filteredEmployees.length}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -0.5, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/add-employee')}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 text-[10.5px] whitespace-nowrap cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Employee</span>
              </motion.button>
            </div>
          
          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role & Dept</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-650">
                <AnimatePresence mode="popLayout">
                  {displayedEmployees.length > 0 ? (
                    displayedEmployees.map((emp, i) => (
                      <motion.tr
                        key={emp.id}
                        layoutId={`empRow-${emp.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 160, damping: 20, delay: i * 0.035 }}
                        onClick={() => setSelectedEmployee(emp)}
                        className={`hover:bg-[#f8fafc]/90 transition-colors duration-150 cursor-pointer relative border-b border-slate-50/50 group ${
                          selectedEmployee && selectedEmployee.id === emp.id ? 'bg-[#f1f5f9]/70 font-semibold' : ''
                        }`}
                      >
                        {/* Selected Indicator Pill */}
                        {selectedEmployee && selectedEmployee.id === emp.id && (
                          <motion.div
                            layoutId="activeRowIndicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-lg z-20"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}

                        {/* Avatar Profile */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={emp.avatarUrl}
                              alt={emp.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-150">{emp.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold mt-0.5">{emp.id}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Designation / Dept */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 leading-tight">{emp.designation}</div>
                          <div className="mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide inline-block ${getDeptColor(emp.department)}`}>
                              {emp.department}
                            </span>
                          </div>
                        </td>

                        {/* Contact details */}
                        <td className="py-3 px-4">
                          <div className="text-slate-650 font-semibold leading-tight">{emp.email}</div>
                          <div className="text-[9.5px] text-slate-400 mt-0.5 font-bold">{emp.phone}</div>
                        </td>

                        {/* Status badging */}
                        <td className="py-3 px-4">
                          <StatusBadge status={emp.status} />
                        </td>

                        {/* Button Actions */}
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: "#eff6ff" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedEmployee(emp)}
                              className="p-1.5 text-blue-500 rounded-lg transition-all duration-150 cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, backgroundColor: "#fffbeb" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate('/add-employee', { state: { employee: emp } })}
                              className="p-1.5 text-amber-500 rounded-lg transition-all duration-150 cursor-pointer"
                              title="Edit Employee"
                            >
                              <Pencil size={14} />
                            </motion.button>
                          </div>
                        </td>

                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td colSpan="5" className="py-8 text-center text-slate-400 font-bold">
                        No employees found matching filters.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="p-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-slate-50/30">
            <div className="text-[10px] text-slate-400 font-black tracking-wide uppercase">
              Showing {filteredEmployees.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredEmployees.length)} of {filteredEmployees.length} entries
            </div>
            <div className="flex items-center gap-1">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1.5 border border-slate-200 text-slate-450 rounded-xl hover:bg-slate-100 transition cursor-pointer ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <ChevronLeft size={12} />
              </motion.button>
              {Array.from({ length: Math.ceil(filteredEmployees.length / pageSize) || 1 }, (_, idx) => idx + 1).map(pageNum => (
                <motion.button 
                  key={pageNum}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-6.5 h-6.5 flex items-center justify-center rounded-xl text-[10px] font-black cursor-pointer transition ${
                    currentPage === pageNum 
                      ? "bg-blue-600 text-white shadow shadow-blue-500/10" 
                      : "border border-slate-200 text-slate-650 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </motion.button>
              ))}
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEmployees.length / pageSize) || 1))}
                disabled={currentPage === (Math.ceil(filteredEmployees.length / pageSize) || 1)}
                className={`p-1.5 border border-slate-200 text-slate-450 rounded-xl hover:bg-slate-100 transition cursor-pointer ${currentPage === (Math.ceil(filteredEmployees.length / pageSize) || 1) ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <ChevronRight size={12} />
              </motion.button>
            </div>
          </div>

        </motion.div>
      )}

        {/* Right Details Card (Show Only View) */}
        <AnimatePresence>
          {selectedEmployee && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden"
            >
              {/* Profile Card Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center relative shrink-0">
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.08, backgroundColor: "#fffbeb" }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigate('/add-employee', { state: { employee: selectedEmployee } })}
                    className="text-amber-500 hover:text-amber-600 p-1.5 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-200/50"
                    title="Edit Employee"
                  >
                    <Pencil size={13} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.08, backgroundColor: "#f1f5f9" }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedEmployee(null)}
                    className="text-slate-400 hover:text-slate-650 p-1.5 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-200/50"
                    title="Close Details"
                  >
                    <X size={13} />
                  </motion.button>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={selectedEmployee.avatarUrl}
                      alt={selectedEmployee.name}
                      className="w-16.5 h-16.5 rounded-2xl object-cover border-2 border-white shadow-md shadow-slate-100"
                    />
                    {selectedEmployee.isNewHire && (
                      <motion.span
                        animate={{ scale: [1, 1.06, 1], boxShadow: ["0 2px 4px rgba(245,158,11,0.2)", "0 2px 8px rgba(245,158,11,0.4)", "0 2px 4px rgba(245,158,11,0.2)"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full tracking-wider uppercase"
                      >
                        New Hire
                      </motion.span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-3 leading-tight">{selectedEmployee.name}</h3>
                  <span className="text-[10px] text-slate-450 font-bold mt-1 tracking-wide uppercase">{selectedEmployee.designation}</span>
                  
                  {/* Department pill at the top */}
                  <span className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide inline-block ${getDeptColor(selectedEmployee.department)}`}>
                    {selectedEmployee.department}
                  </span>

                  <div className="mt-2.5 flex items-center gap-2">
                    <StatusBadge status={selectedEmployee.status} />
                    {selectedEmployee.isNewHire && (
                      <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide">
                        Recent Joined
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full mt-4.5 space-y-2 border-t border-slate-50 pt-3.5 text-[10px] font-bold text-slate-450">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-700">{selectedEmployee.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-700 truncate">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span className="text-slate-700">{selectedEmployee.phone}</span>
                  </div>
                </div>
              </div>

              {/* Details Tab Navigation */}
              <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
                
                {/* Tab Header */}
                <div className="flex items-center gap-4.5 border-b border-slate-100 pb-2 text-xs font-black shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
                  {["Personal Information", "Job Information", "Account Information", "Documents"].map((tab) => {
                    const label = tab === "Personal Information" ? "Personal" :
                                  tab === "Job Information" ? "Job" :
                                  tab === "Account Information" ? "Account" : "Docs";
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-0.5 relative transition-all duration-150 cursor-pointer ${
                          activeTab === tab 
                            ? "text-blue-600" 
                            : "text-slate-400 hover:text-slate-650"
                        }`}
                      >
                        <span>{label}</span>
                        {/* Smooth sliding active underline */}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Scroll Content */}
                <div className="flex-1 overflow-y-auto min-h-0 py-3.5 pr-1 text-[11px] font-bold text-slate-650 scrollbar-thin">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-3.5"
                    >
                      {/* Personal Information Tab */}
                      {activeTab === "Personal Information" && (
                        <>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Full Name</span>
                              <span className="text-slate-800">{selectedEmployee.name}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Gender</span>
                              <span className="text-slate-800">{selectedEmployee.gender || "Female"}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Date of Birth</span>
                              <span className="text-slate-800">{selectedEmployee.dob || "12-09-1999"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Blood Group</span>
                              <span className="text-slate-800">{selectedEmployee.bloodGroup || "O+"}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Emergency Contact</span>
                              <span className="text-slate-800 truncate block">{selectedEmployee.emergencyContact || "Ramesh Devi (Father)"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Emergency Phone</span>
                              <span className="text-slate-800">{selectedEmployee.emergencyPhone || "9876500000"}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Marital Status</span>
                              <span className="text-slate-800">{selectedEmployee.maritalStatus || "Single"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Nationality</span>
                              <span className="text-slate-800">{selectedEmployee.nationality || "Indian"}</span>
                            </div>
                          </div>
                          <div className="border-b border-slate-50 pb-2.5">
                            <span className="text-[9px] text-slate-400 font-bold block">Address</span>
                            <span className="text-slate-800 leading-snug">{selectedEmployee.address || "123, Anna Nagar, Chennai, Tamil Nadu - 600040"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block">Languages Known</span>
                            <span className="text-slate-800">{selectedEmployee.languages || "Tamil, English, Hindi"}</span>
                          </div>
                        </>
                      )}

                      {/* Job Information Tab */}
                      {activeTab === "Job Information" && (
                        <>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Job Title / Role</span>
                              <span className="text-slate-800">{selectedEmployee.designation}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Work Shift</span>
                              <span className="text-slate-800">{selectedEmployee.shift || "Day Shift"}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Department</span>
                              <span className="text-slate-800">{selectedEmployee.department}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Employment Type</span>
                              <span className="text-slate-800">{selectedEmployee.type || "Full Time"}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Supervisor / Manager</span>
                              <span className="text-slate-800 truncate block">{selectedEmployee.manager || "Aravind Swamy"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Desk Location</span>
                              <span className="text-slate-800">{selectedEmployee.desk || "Bay 4 - Floor 2"}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block">Joined Date</span>
                            <span className="text-slate-800">{selectedEmployee.joiningDate || "01-02-2024"}</span>
                          </div>
                        </>
                      )}

                      {/* Account Information Tab */}
                      {activeTab === "Account Information" && (
                        <>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Employee ID</span>
                              <span className="text-slate-800">{selectedEmployee.id}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Username</span>
                              <span className="text-slate-800">{selectedEmployee.username || selectedEmployee.name.toLowerCase().replace(" ", ".")}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">System Role</span>
                              <span className="text-slate-800">{selectedEmployee.role || "Employee"}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block">Work Email</span>
                              <span className="text-slate-800 truncate block">{selectedEmployee.email}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block">Last Login Timestamp</span>
                            <span className="text-slate-800">{selectedEmployee.lastLogin || "29-07-2026 09:30 AM"}</span>
                          </div>
                        </>
                      )}

                      {/* Documents Tab */}
                      {activeTab === "Documents" && (
                        <div className="space-y-2">
                          {[
                            { name: "Resume_CV.pdf", size: "1.2 MB", type: "PDF" },
                            { name: "Offer_Letter.pdf", size: "850 KB", type: "PDF" },
                            { name: "Aadhaar_ID_Card.png", size: "2.4 MB", type: "Image" }
                          ].map((doc, idx) => (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.015, backgroundColor: "#f8fafc", borderColor: "rgba(37,99,235,0.15)" }}
                              className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl transition-all duration-150 cursor-pointer"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl shrink-0">
                                  <FileText size={14} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-slate-800 font-bold truncate leading-normal text-xs">{doc.name}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">{doc.type} • {doc.size}</p>
                                </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "#fff" }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 text-slate-450 hover:text-blue-500 rounded-lg transition-all duration-150 border border-slate-100/50 cursor-pointer shrink-0"
                              >
                                <Download size={12} />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default EmployeeList;
