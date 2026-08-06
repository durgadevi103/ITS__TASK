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
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" :
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
  const [pageSize, setPageSize] = useState(5);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [employeeDocs, setEmployeeDocs] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdvFilterModal, setShowAdvFilterModal] = useState(false);
  const [advName, setAdvName] = useState("");
  const [advEmail, setAdvEmail] = useState("");
  const [advGender, setAdvGender] = useState("All Genders");
  const [advPhone, setAdvPhone] = useState("");
  const [advBloodGroup, setAdvBloodGroup] = useState("All");
  const [advEmpCode, setAdvEmpCode] = useState("");
  const [advDesignation, setAdvDesignation] = useState("");
  const [advStatus, setAdvStatus] = useState("All Status");
  const [advDept, setAdvDept] = useState("All Departments");
  const [advDeptSearch, setAdvDeptSearch] = useState("");
  const [showAdvDeptDropdown, setShowAdvDeptDropdown] = useState(false);
  const [searchedDepts, setSearchedDepts] = useState([]);

  const handleUpdateEmployeeStatus = async (employeeId, newStatus) => {
    const emp = employees.find(e => e.employee_id === employeeId);
    if (!emp) return;

    const payload = {
      employee_id: emp.employee_id,
      emp_id: emp.employee_id,
      emp_name: emp.name,
      emp_email: emp.email,
      emp_dob: emp.dob,
      emp_gender: emp.gender,
      emp_ph_no: emp.phone,
      emp_address: emp.address,
      emp_emg_contact: emp.emergencyContact,
      emp_emg_phone: emp.emergencyPhone,
      emp_bld_grp: emp.bloodGroup,
      emp_merit: emp.maritalStatus,
      emp_nationality: emp.nationality,
      emp_language: emp.languages,
      emp_dept: emp.department,
      emp_salary: emp.salary || '35000',
      emp_desigation: emp.designation,
      emp_designation: emp.designation,
      emp_status: newStatus
    };

    try {
      const response = await api.put('/employee/edit', payload);
      if (response.data.success) {
        setEmployees(prev =>
          prev.map(item => item.employee_id === employeeId ? { ...item, status: newStatus } : item)
        );
        setToastMsg(`Status updated to "${newStatus}" in database.`);
        setTimeout(() => setToastMsg(""), 3000);
      } else {
        alert("Failed to update status in database.");
      }
    } catch (err) {
      console.error("Error updating status", err);
      alert("Error updating status in database.");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setAdvName('');
    setAdvEmail('');
    setAdvGender('All Genders');
    setAdvPhone('');
    setAdvBloodGroup('All');
    setAdvEmpCode('');
    setAdvDesignation('');
    setAdvStatus('All Status');
    setAdvDept('All Departments');
    setAdvDeptSearch('');
    setSearchedDepts([]);
    setCurrentPage(1);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getDocType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'Image';
    if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) return 'Document';
    return 'File';
  };

  const handleFile = (file) => {
    const empId = selectedEmployee.employee_id;
    const newDoc = {
      name: file.name,
      size: formatFileSize(file.size),
      type: getDocType(file.name)
    };

    setEmployeeDocs(prev => {
      const currentList = prev[empId] || [
        { name: "Resume_CV.pdf", size: "1.2 MB", type: "PDF" },
        { name: "Offer_Letter.pdf", size: "850 KB", type: "PDF" },
        { name: "Aadhaar_ID_Card.png", size: "2.4 MB", type: "Image" }
      ];
      return {
        ...prev,
        [empId]: [...currentList, newDoc]
      };
    });

    setShowUploadModal(false);
    setToastMsg(`Document "${file.name}" uploaded successfully.`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm, 
    advName, 
    advEmail, 
    advGender, 
    advPhone, 
    advBloodGroup, 
    advDesignation, 
    advStatus, 
    advDept, 
    pageSize
  ]);

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
      const isFilterActive = searchTerm !== "" || 
        advName !== "" ||
        advEmail !== "" ||
        advGender !== "All Genders" ||
        advPhone !== "" ||
        advBloodGroup !== "All" ||
        advDesignation !== "" ||
        advStatus !== "All Status" ||
        advDept !== "All Departments";

      let rawEmployeesList = [];
      let totalFetchedCount = 0;

      if (isFilterActive) {
        // Fetch all employees so we can filter them in-memory
        const response = await api.get('/employee/list/10/0');
        if (response.data.success) {
          rawEmployeesList = response.data.list || [];
          totalFetchedCount = response.data.count || rawEmployeesList.length;
        }
      } else {
        const limit = pageSize;
        const offset = (currentPage - 1) * pageSize;
        const response = await api.get(`/employee/list/${limit}/${offset}`);
        if (response.data.success) {
          rawEmployeesList = response.data.list || [];
          totalFetchedCount = response.data.count || rawEmployeesList.length;
        }
      }

      const sorted = rawEmployeesList.sort((a, b) => (a.emp_id || a.employee_id) - (b.emp_id || b.employee_id));
      const maxId = Math.max(...sorted.map(e => parseInt(e.emp_id || e.employee_id)).filter(id => !isNaN(id)), 0);

      const mapped = sorted.map((emp, index) => {
        const empNumId = parseInt(emp.emp_id || emp.employee_id);
        const offsetVal = isFilterActive ? 0 : (currentPage - 1) * pageSize;
        const displayIdx = offsetVal + index + 1;
        const isNewHire = sorted.length <= 3 || (empNumId >= maxId - 2);
        const actualEmpId = emp.emp_id || emp.employee_id;
        return {
          id: `EMP${String(displayIdx).padStart(3, '0')}`,
          employee_id: actualEmpId,
          name: emp.emp_name,
          email: emp.emp_email,
          dob: emp.emp_dob,
          gender: emp.emp_gender,
          phone: emp.emp_ph_no,
          address: emp.emp_address,
          emergencyContact: emp.emp_emg_contact,
          emergencyPhone: emp.emp_emg_phone,
          bloodGroup: emp.emp_bld_grp,
          nationality: emp.emp_nationality,
          languages: emp.emp_language,
          department: emp.emp_dept,
          designation: emp.emp_designation || emp.emp_desigation,
          status: emp.emp_status || 'Active',
          empCode: emp.emp_code,
          avatarUrl: emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.emp_name)}&background=2563eb&color=fff&bold=true`,
          isNewHire: isNewHire
        };
      });

      setEmployees(mapped);
      setTotalEmployees(totalFetchedCount);
    } catch (err) {
      console.error("Error loading employees from backend", err);
      setEmployees([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/department/list/10/0');
      const listData = response.data.data || response.data.list;
      if (response.data.success && listData) {
        const mapped = listData.map(d => ({
          name: d.dept_name || d.name,
          dept_id: d.dept_id,
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
      const parsed = JSON.parse(local);
      const mapped = parsed.map((d, index) => ({
        name: d.name || d.dept_name,
        dept_id: d.dept_id || d.id || index + 1,
        dept_code: d.dept_id_code || d.dept_code
      }));
      setDepartments(mapped);
    } else {
      setDepartments([
        { name: 'Information Technology', dept_id: 1, dept_code: 'IT' },
        { name: 'Human Resources', dept_id: 2, dept_code: 'HR' },
        { name: 'Finance', dept_id: 3, dept_code: 'FIN' }
      ]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [
    currentPage, 
    pageSize, 
    searchTerm, 
    advName, 
    advEmail, 
    advGender, 
    advPhone, 
    advBloodGroup, 
    advEmpCode, 
    advDesignation, 
    advStatus, 
    advDept
  ]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchSearchedDepts = async () => {
      if (!advDeptSearch.trim()) {
        setSearchedDepts([]);
        return;
      }
      try {
        const response = await api.post('/department/deptnamesearch', { search: advDeptSearch });
        if (response.data.success && response.data.result) {
          setSearchedDepts(response.data.result.map(d => ({
            name: d.dept_name || d.name,
            dept_id: d.dept_id,
            dept_code: d.dept_code || d.dept_id_code
          })));
        }
      } catch (err) {
        console.error("Error searching departments via API", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSearchedDepts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [advDeptSearch]);

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

    const matchesAdvName = !advName.trim() || 
      nameStr.includes(advName.toLowerCase().trim());

    const matchesAdvEmail = !advEmail.trim() || 
      emailStr.includes(advEmail.toLowerCase().trim());

    const matchesAdvGender = advGender === "All Genders" || 
      (emp.gender && emp.gender.toLowerCase() === advGender.toLowerCase());

    const matchesAdvPhone = !advPhone.trim() || 
      phoneStr.includes(advPhone.trim());

    const matchesAdvBlood = advBloodGroup === "All" || 
      (emp.bloodGroup && emp.bloodGroup.toLowerCase() === advBloodGroup.toLowerCase());

    const empCodeStr = emp.empCode ? String(emp.empCode).toLowerCase() : "";
    const matchesAdvEmpCode = !advEmpCode.trim() || 
      empCodeStr.includes(advEmpCode.toLowerCase().trim());

    const desigStr = emp.designation ? emp.designation.toLowerCase() : "";
    const matchesAdvDesignation = !advDesignation.trim() || 
      desigStr.includes(advDesignation.toLowerCase().trim());

    const matchesAdvStatus = advStatus === "All Status" || 
      emp.status === advStatus;

    const matchesAdvDept = advDept === "All Departments" || 
      String(emp.department) === String(advDept) ||
      (() => {
        const matchedEmpDept = departments.find(d => String(d.dept_id) === String(emp.department) || d.dept_code === emp.department || d.name === emp.department);
        const matchedSelDept = departments.find(d => String(d.dept_id) === String(advDept) || d.dept_code === advDept || d.name === advDept);
        return matchedEmpDept && matchedSelDept && matchedEmpDept.dept_id === matchedSelDept.dept_id;
      })();

    return matchesSearch && 
      matchesAdvName && 
      matchesAdvEmail && 
      matchesAdvGender && 
      matchesAdvPhone && 
      matchesAdvBlood && 
      matchesAdvEmpCode && 
      matchesAdvDesignation && 
      matchesAdvStatus && 
      matchesAdvDept;
  });

  const isFilterActive = searchTerm !== "" || 
    advName !== "" ||
    advEmail !== "" ||
    advGender !== "All Genders" ||
    advPhone !== "" ||
    advBloodGroup !== "All" ||
    advEmpCode !== "" ||
    advDesignation !== "" ||
    advStatus !== "All Status" ||
    advDept !== "All Departments";
  const displayedEmployees = isFilterActive
    ? filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredEmployees;
  const totalCount = isFilterActive ? filteredEmployees.length : totalEmployees;

  const getDeptColor = (deptIdOrCode) => {
    const dept = departments.find(d => String(d.dept_id) === String(deptIdOrCode) || d.dept_code === deptIdOrCode);
    const code = dept ? dept.dept_code : deptIdOrCode;
    switch (code) {
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
      className="p-3 bg-[#f8fafc] h-[calc(100vh-4.2rem)] flex flex-col gap-3 text-gray-700 overflow-hidden relative"
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
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 shrink-0">

          {/* Top Row: Breadcrumbs and Search/Filter toggler */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Left Side: Breadcrumbs */}
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-900 leading-tight">Employees</h1>
              <nav className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate('/')}>Dashboard</span>
                <span>/</span>
                <span className="text-gray-500">Employees</span>
              </nav>
            </div>

            {/* Right Side: Search and Toggler */}
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvFilterModal(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    isFilterActive 
                      ? 'border-blue-500 text-blue-600 bg-blue-50/20' 
                      : 'border-slate-200 text-slate-650 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                  </svg>
                  <span>Advanced Filters</span>
                </button>

                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="p-2 text-gray-450 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    title="Reset filters"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                    </svg>
                  </button>
                )}
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
                  {totalCount}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -0.5, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/add-employee')}
                className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 text-[10.5px] whitespace-nowrap cursor-pointer glossy-shine"
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
                          className={`hover:bg-[#f8fafc]/90 transition-colors duration-150 cursor-pointer relative border-b border-slate-50/50 group ${selectedEmployee && selectedEmployee.id === emp.id ? 'bg-[#f1f5f9]/70 font-semibold' : ''
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
                                {(() => {
                                  const matched = departments.find(d => String(d.dept_id) === String(emp.department) || d.dept_code === emp.department);
                                  return matched ? matched.name : emp.department;
                                })()}
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
                              {/* Status Quick Changer dropdown */}
                              <div className="relative shrink-0 mr-1.5">
                                <select
                                  value={emp.status}
                                  onChange={(e) => handleUpdateEmployeeStatus(emp.employee_id, e.target.value)}
                                  className="bg-white border border-slate-200 rounded-lg pl-2 pr-5 py-1 text-[9.5px] font-bold text-slate-650 outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer appearance-none min-w-[78px] text-center"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                  <option value="On Leave">On Leave</option>
                                </select>
                                <ChevronDown size={9} className="text-gray-450 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>

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
            <div className="p-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0 bg-slate-50/30 font-medium select-none">
              <div>
                Showing <span className="font-bold text-slate-700">{totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-bold text-slate-700">{totalCount}</span> employees
              </div>

              {/* Next/Prev Page navigation controls */}
              <div className="flex items-center gap-1.5 font-bold">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={`px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer text-[10px] font-black ${
                    currentPage === 1 ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  Prev
                </button>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase px-1.5">
                  Page {currentPage} of {Math.ceil(totalCount / pageSize) || 1}
                </span>
                <button
                  type="button"
                  disabled={currentPage === (Math.ceil(totalCount / pageSize) || 1)}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalCount / pageSize) || 1))}
                  className={`px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer text-[10px] font-black ${
                    currentPage === (Math.ceil(totalCount / pageSize) || 1) ? 'opacity-40 pointer-events-none' : ''
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
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
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
                    {(() => {
                      const matched = departments.find(d => String(d.dept_id) === String(selectedEmployee.department) || d.dept_code === selectedEmployee.department);
                      return matched ? matched.name : selectedEmployee.department;
                    })()}
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
                  {["Personal Information", "Job Information", "Documents"].map((tab) => {
                    const label = tab === "Personal Information" ? "Personal" :
                      tab === "Job Information" ? "Job" : "Docs";
                    const isTabActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-0.5 relative transition-all duration-150 cursor-pointer ${activeTab === tab
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
                              <span className="text-slate-800">
                                {(() => {
                                  const matched = departments.find(d => String(d.dept_id) === String(selectedEmployee.department) || d.dept_code === selectedEmployee.department);
                                  return matched ? matched.name : selectedEmployee.department;
                                })()}
                              </span>
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



                      {/* Documents Tab */}
                      {activeTab === "Documents" && (
                        <div className="space-y-2">
                          {(employeeDocs[selectedEmployee.employee_id] || [
                            { name: "Resume_CV.pdf", size: "1.2 MB", type: "PDF" },
                            { name: "Offer_Letter.pdf", size: "850 KB", type: "PDF" },
                            { name: "Aadhaar_ID_Card.png", size: "2.4 MB", type: "Image" }
                          ]).map((doc, idx) => (
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
                          <div className="pt-2">
                            <button
                              onClick={() => setShowUploadModal(true)}
                              className="flex items-center justify-center gap-2 p-3 mt-1 w-full border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-xs font-bold text-slate-500 hover:text-blue-600 rounded-xl cursor-pointer transition-all duration-150"
                            >
                              <Plus size={14} />
                              <span>Upload New Document</span>
                            </button>
                          </div>
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

      {/* Premium Upload Document Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 pointer-events-auto"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[500px] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden pointer-events-auto p-6 flex flex-col gap-5 border border-slate-100 text-slate-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">Upload document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-blue-500', 'bg-blue-50/10');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50/10');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50/10');
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    handleFile(files[0]);
                  }
                }}
                className="border-2 border-dashed border-blue-400/70 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 bg-slate-50/30 group"
              >
                {/* Cloud Upload Icon */}
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <span className="text-xs font-bold text-slate-700">Drag and drop files here</span>
                <span className="text-[10px] text-slate-450 font-semibold my-1.5 uppercase">or</span>

                <input
                  type="file"
                  id="employee-modal-file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFile(file);
                  }}
                />
                <label
                  htmlFor="employee-modal-file-upload"
                  className="px-4 py-1.5 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 text-[11px] font-bold transition cursor-pointer active:scale-95 hover:text-white hover:bg-blue-500 shadow-sm"
                >
                  Click here to upload
                </label>

                <span className="text-[9px] text-slate-450 font-semibold mt-4 leading-normal">
                  Supported: JPG, JPEG, PNG, TIFF, PDF, TIF, XLSX, XLS | File size should be maximum 25mb and it shouldn't be password protected
                </span>
              </div>

              {/* Auto Import Section */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="h-px bg-slate-100 flex-1" />
                  <span className="text-[9px] font-bold whitespace-nowrap text-slate-400">or auto import documents via</span>
                  <div className="h-px bg-slate-100 flex-1" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button className="flex items-center justify-center gap-1.5 p-2 bg-[#f8fafc] hover:bg-slate-100 border border-slate-200/50 rounded-xl text-[11px] font-bold text-slate-650 transition cursor-pointer active:scale-98">
                    <Mail size={12} className="text-red-500" />
                    <span>Email</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 p-2 bg-[#f8fafc] hover:bg-slate-100 border border-slate-200/50 rounded-xl text-[11px] font-bold text-slate-650 transition cursor-pointer active:scale-98">
                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>API</span>
                  </button>
                  <button className="flex items-center justify-center gap-1.5 p-2 bg-[#f8fafc] hover:bg-slate-150 border border-slate-200/50 rounded-xl text-[11px] font-bold text-slate-650 transition cursor-pointer active:scale-98">
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Zapier</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Premium Advanced Filter Modal */}
      <AnimatePresence>
        {showAdvFilterModal && (
          <>
            {/* Dark Backdrop Overlay */}
            <div
              onClick={() => setShowAdvFilterModal(false)}
              className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 pointer-events-auto"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[620px] max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-50 pointer-events-auto p-6 flex flex-col gap-5 border border-slate-100 text-slate-800 scrollbar-thin"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <svg className="w-4.5 h-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                  </svg>
                  <h3 className="text-base font-bold text-slate-800">Advanced Filters</h3>
                </div>
                <button
                  onClick={() => setShowAdvFilterModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                {/* 1. Employee Name */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Employee Name:</span>
                  <input
                    type="text"
                    value={advName}
                    onChange={(e) => setAdvName(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800 font-semibold"
                  />
                </div>

                {/* 2. Email */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Email Address:</span>
                  <input
                    type="text"
                    value={advEmail}
                    onChange={(e) => setAdvEmail(e.target.value)}
                    placeholder="Search by email..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800 font-semibold"
                  />
                </div>

                {/* 3. Gender */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Gender:</span>
                  <div className="relative">
                    <select
                      value={advGender}
                      onChange={(e) => setAdvGender(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none"
                    >
                      <option value="All Genders">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={13} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Phone Number:</span>
                  <input
                    type="text"
                    value={advPhone}
                    onChange={(e) => setAdvPhone(e.target.value)}
                    placeholder="Search by phone..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800 font-semibold"
                  />
                </div>

                {/* 5. Blood Group */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Blood Group:</span>
                  <div className="relative">
                    <select
                      value={advBloodGroup}
                      onChange={(e) => setAdvBloodGroup(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none"
                    >
                      <option value="All">All</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    <ChevronDown size={13} className="text-gray-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 6. Employee Code */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Employee Code:</span>
                  <input
                    type="text"
                    value={advEmpCode}
                    onChange={(e) => setAdvEmpCode(e.target.value)}
                    placeholder="Search by employee code..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800 font-semibold"
                  />
                </div>

                {/* 8. Designation */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Designation:</span>
                  <input
                    type="text"
                    value={advDesignation}
                    onChange={(e) => setAdvDesignation(e.target.value)}
                    placeholder="Search by designation..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800 font-semibold"
                  />
                </div>

                {/* 9. Status */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-400">Status:</span>
                  <div className="relative">
                    <select
                      value={advStatus}
                      onChange={(e) => setAdvStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none"
                    >
                      <option value="All Status">All Status</option>
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown size={13} className="text-gray-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 10. Department */}
                <div className="flex flex-col gap-1.5 relative sm:col-span-2">
                  <span className="text-slate-400">Department:</span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search department..."
                      value={advDeptSearch}
                      onChange={(e) => {
                        setAdvDeptSearch(e.target.value);
                        setShowAdvDeptDropdown(true);
                        if (e.target.value === "") {
                          setAdvDept("All Departments");
                        }
                      }}
                      onFocus={() => setShowAdvDeptDropdown(true)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800 font-semibold pr-8"
                    />
                    {advDeptSearch ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAdvDept("All Departments");
                          setAdvDeptSearch("");
                          setShowAdvDeptDropdown(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    ) : (
                      <ChevronDown size={13} className="text-gray-450 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>

                  <AnimatePresence>
                    {showAdvDeptDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowAdvDeptDropdown(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-36 overflow-y-auto z-20"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setAdvDept("All Departments");
                              setAdvDeptSearch("");
                              setShowAdvDeptDropdown(false);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium cursor-pointer"
                          >
                            All Departments
                          </button>
                          {((advDeptSearch.trim() ? searchedDepts : departments) || []).map((dept) => (
                            <button
                              key={dept.dept_code || dept.name}
                              type="button"
                              onClick={() => {
                                setAdvDept(dept.dept_code || dept.name);
                                setAdvDeptSearch(dept.name);
                                setShowAdvDeptDropdown(false);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium cursor-pointer"
                            >
                              {dept.name} ({dept.dept_code})
                            </button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                <button
                  onClick={() => {
                    handleResetFilters();
                    setShowAdvFilterModal(false);
                  }}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-[11px] font-bold text-slate-650 transition cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowAdvFilterModal(false)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default EmployeeList;
