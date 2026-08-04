import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editEmployee = location.state?.employee;
  const isEditMode = !!editEmployee;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: '',
    status: '',
    joiningDate: new Date().toISOString().split('T')[0],
    dob: '',
    gender: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodGroup: '',
    maritalStatus: '',
    nationality: '',
    languages: '',
    shift: '',
    type: '',
    manager: '',
    desk: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptSearch, setDeptSearch] = useState('');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const deptRef = useRef(null);

  const AVAILABLE_LANGUAGES = [
    'English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 
    'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Odia', 'Assamese',
    'Urdu', 'Sanskrit', 'French', 'German', 'Spanish', 'Japanese', 
    'Mandarin', 'Korean'
  ];
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const langRef = useRef(null);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await api.get('/department/list/1000/0');
        const listData = response.data.data || response.data.list;
        if (response.data.success && listData && listData.length > 0) {
          const mapped = listData.map((d, index) => ({
            name: d.dept_name || d.name,
            dept_id: d.dept_id,
            dept_code: d.dept_code || d.dept_id_code || `DEP${index + 1}`
          }));
          setDepartments(mapped);
          return;
        }
      } catch (err) {
        console.error("Error loading departments for employee registration", err);
      }

      // Fallback
      const local = sessionStorage.getItem('departmentsData');
      if (local) {
        const parsed = JSON.parse(local);
        const mapped = parsed.map((d, index) => ({
          name: d.name || d.dept_name,
          dept_id: d.dept_id || d.id || index + 1,
          dept_code: d.dept_id_code || d.dept_code || `DEP${index + 1}`
        }));
        setDepartments(mapped);
      } else {
        const fallback = [
          { name: 'Information Technology', dept_id: 1, dept_code: 'IT' },
          { name: 'Human Resources', dept_id: 2, dept_code: 'HR' },
          { name: 'Finance', dept_id: 3, dept_code: 'FIN' }
        ];
        setDepartments(fallback);
      }
    };
    fetchDepts();
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && editEmployee) {
      const parseDateForInput = (dateStr) => {
        if (!dateStr) return '';
        if (dateStr.includes('T')) {
          return dateStr.split('T')[0];
        }
        const parts = dateStr.split('-');
        if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };

      setForm({
        name: editEmployee.name || '',
        email: editEmployee.email || '',
        phone: editEmployee.phone || '',
        designation: editEmployee.designation || '',
        department: editEmployee.department || '',
        status: editEmployee.status || 'Active',
        joiningDate: parseDateForInput(editEmployee.joiningDate),
        dob: parseDateForInput(editEmployee.dob),
        gender: editEmployee.gender || '',
        address: editEmployee.address || '',
        emergencyContact: editEmployee.emergencyContact || '',
        emergencyPhone: editEmployee.emergencyPhone || '',
        bloodGroup: editEmployee.bloodGroup || '',
        maritalStatus: editEmployee.maritalStatus || '',
        nationality: editEmployee.nationality || '',
        languages: editEmployee.languages || '',
        shift: editEmployee.shift || '',
        type: editEmployee.type || '',
        manager: editEmployee.manager || '',
        desk: editEmployee.desk || '',
      });
      setDeptSearch(editEmployee.department || '');
    }
  }, [isEditMode, editEmployee]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptRef.current && !deptRef.current.contains(event.target)) {
        setShowDeptDropdown(false);
        const matched = departments.find(d => d.dept_id === form.department);
        setDeptSearch(matched ? matched.name : form.department || '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [form.department, departments]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleLanguage = (lang) => {
    const selectedLangs = form.languages
      ? form.languages.split(',').map(l => l.trim()).filter(Boolean)
      : [];
    
    let newLangs;
    if (selectedLangs.includes(lang)) {
      newLangs = selectedLangs.filter(l => l !== lang);
    } else {
      newLangs = [...selectedLangs, lang];
    }
    setForm(prev => ({ ...prev, languages: newLangs.join(', ') }));
  };

  useEffect(() => {
    if (departments.length > 0 && form.department) {
      const matched = departments.find(d => d.dept_id === form.department);
      if (matched) {
        setDeptSearch(matched.name);
      }
    }
  }, [departments, form.department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.designation || !form.department || !form.joiningDate) return;

    try {
      if (isEditMode) {
        // Edit Mode
        const payload = {
          employee_id: editEmployee.employee_id,
          emp_id: editEmployee.employee_id,
          emp_name: form.name,
          emp_email: form.email,
          emp_dob: form.dob,
          emp_gender: form.gender,
          emp_ph_no: form.phone,
          emp_address: form.address,
          emp_emg_contact: form.emergencyContact,
          emp_emg_phone: form.emergencyPhone,
          emp_bld_grp: form.bloodGroup,
          emp_merit: form.maritalStatus,
          emp_nationality: form.nationality,
          emp_language: form.languages,
          emp_dept: form.department,
          emp_salary: form.salary || '35000',
          emp_desigation: form.designation,
          emp_status: form.status
        };

        const responseUpdate = await api.put('/employee/edit', payload);
        if (responseUpdate.data.success) {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            navigate("/employees");
          }, 2000);
        } else {
          alert("Failed to update employee profile in database.");
        }
      } else {
        // Create Mode
        // 1. Fetch current list to determine the next numeric ID
        let nextNum = 1;
        const responseList = await api.get('/employee/list/1000/0');
        if (responseList.data.success && responseList.data.list && responseList.data.list.length > 0) {
          const ids = responseList.data.list.map(emp => parseInt(emp.emp_id || emp.employee_id));
          const maxId = Math.max(...ids.filter(id => !isNaN(id)));
          nextNum = maxId > 0 ? maxId + 1 : 1;
        }

        // 2. Prepare payload matching backend parameter names
        const payload = {
          employee_id: nextNum,
          emp_name: form.name,
          emp_email: form.email,
          emp_dob: form.dob,
          emp_gender: form.gender,
          emp_ph_no: form.phone,
          emp_address: form.address,
          emp_emg_contact: form.emergencyContact,
          emp_emg_phone: form.emergencyPhone,
          emp_bld_grp: form.bloodGroup,
          emp_merit: form.maritalStatus,
          emp_nationality: form.nationality,
          emp_language: form.languages,
          emp_dept: form.department,
          emp_salary: '35000',
          emp_desigation: form.designation,
          emp_designation: form.designation,
          emp_status: form.status || 'Active'
        };

        // 3. Post to backend
        const responseCreate = await api.post('/employee/create', payload);
        if (responseCreate.data.success) {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            navigate("/employees");
          }, 2000);
        } else {
          alert("Failed to save employee profile to database.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting backend server. Make sure it is running.");
    }
  };

  return (
    <div className="p-3 bg-[#f8fafc] h-[calc(100vh-4.2rem)] flex flex-col gap-3 text-gray-700 overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-800"
          >
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-bold text-white">{isEditMode ? "Profile Updated" : "Employee Registered"}</p>
              <p className="text-xs text-gray-400">{isEditMode ? "Updated employee details successfully." : "Added new employee profile successfully."}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 w-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full">

        {/* Header bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/employees')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white cursor-pointer"
              title="Back to Directory"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                {isEditMode ? "Edit Employee Profile" : "Register New Employee"}
              </h2>
              <p className="text-[10px] text-blue-100 mt-0.5">{isEditMode ? "Modify personal, job, and account information." : "Fill out personal, job, and account information."}</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* Scrollable Fields Section */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 text-xs text-gray-600">

            {/* Section: Personal Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-900 border-b border-gray-50 pb-2">1. Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Durga Devi"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="durga@email.com"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Blood Group</label>
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Marital Status</label>
                  <select
                    value={form.maritalStatus}
                    onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>

                {/* Nationality */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Nationality</label>
                  <select
                    value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="">Select Nationality</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="British">British</option>
                    <option value="Canadian">Canadian</option>
                    <option value="Australian">Australian</option>
                    <option value="Singaporean">Singaporean</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Languages */}
                <div className="space-y-1 relative" ref={langRef}>
                  <label className="block font-semibold text-gray-700">Languages Known</label>
                  <div
                    onClick={() => setShowLangDropdown(prev => !prev)}
                    className="w-full min-h-[38px] px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition text-gray-800 font-medium cursor-pointer flex flex-wrap gap-1.5 items-center pr-8 relative"
                  >
                    {(() => {
                      const selectedLangs = form.languages
                        ? form.languages.split(',').map(l => l.trim()).filter(Boolean)
                        : [];
                      return selectedLangs.length === 0 ? (
                        <span className="text-gray-400 pl-1.5">Select languages...</span>
                      ) : (
                        selectedLangs.map(lang => (
                          <span
                            key={lang}
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold text-[10px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLanguage(lang);
                            }}
                          >
                            {lang}
                            <span className="hover:text-blue-800 font-black cursor-pointer text-[11px]">&times;</span>
                          </span>
                        ))
                      );
                    })()}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[8px]">
                      ▼
                    </span>
                  </div>

                  <AnimatePresence>
                    {showLangDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 flex flex-col gap-2 max-h-56 overflow-hidden"
                      >
                        <input
                          type="text"
                          placeholder="Search languages..."
                          value={langSearch}
                          onChange={(e) => setLangSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-md text-[11px] outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                        />

                        <div className="overflow-y-auto max-h-36 flex flex-col gap-1.5 scrollbar-thin">
                          {(() => {
                            const selectedLangs = form.languages
                              ? form.languages.split(',').map(l => l.trim()).filter(Boolean)
                              : [];
                            const filtered = AVAILABLE_LANGUAGES.filter(lang => 
                              lang.toLowerCase().includes(langSearch.toLowerCase())
                            );
                            return filtered.length === 0 ? (
                              <div className="px-2 py-1.5 text-[10px] text-gray-400 text-center font-semibold">
                                No languages found
                              </div>
                            ) : (
                              filtered.map(lang => {
                                const isChecked = selectedLangs.includes(lang);
                                return (
                                  <button
                                    key={lang}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleLanguage(lang);
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 text-[11px] rounded-md transition flex items-center justify-between font-semibold cursor-pointer ${
                                      isChecked 
                                        ? 'bg-blue-50 text-blue-600 font-bold' 
                                        : 'text-gray-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>{lang}</span>
                                    {isChecked && (
                                      <span className="text-blue-500 font-bold">✓</span>
                                    )}
                                  </button>
                                );
                              })
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Emergency Contact Name */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={form.emergencyContact}
                    onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                    placeholder="Ramesh Devi (Father)"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Emergency Phone</label>
                  <input
                    type="text"
                    value={form.emergencyPhone}
                    onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                    placeholder="9876500000"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1 md:col-span-3">
                  <label className="block font-semibold text-gray-700">Residential Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123, Anna Nagar, Chennai, Tamil Nadu - 600040"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

              </div>
            </div>

            {/* Section: Job Info */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h3 className="text-xs font-bold text-gray-900 border-b border-gray-50 pb-2">2. Job & Position Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Designation */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Designation / Position <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="Frontend Developer"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Department Search Select */}
                <div className="space-y-1 relative" ref={deptRef}>
                  <label className="block font-semibold text-gray-700">Department <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Search and select department..."
                      value={deptSearch}
                      onFocus={() => setShowDeptDropdown(true)}
                      onChange={(e) => {
                        setDeptSearch(e.target.value);
                        setShowDeptDropdown(true);
                        if (!e.target.value.trim()) {
                          setForm(prev => ({ ...prev, department: '' }));
                        }
                      }}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                    />
                    {deptSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeptSearch('');
                          setForm(prev => ({ ...prev, department: '' }));
                          setShowDeptDropdown(true);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 cursor-pointer text-sm font-bold"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showDeptDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                      >
                        {departments.filter(d => 
                          (d.name || '').toLowerCase().includes(deptSearch.toLowerCase()) || 
                          (d.dept_code || '').toLowerCase().includes(deptSearch.toLowerCase())
                        ).length === 0 ? (
                          <div className="px-3.5 py-2 text-xs text-gray-400 font-medium">
                            No Departments Found
                          </div>
                        ) : (
                          departments.filter(d => 
                            (d.name || '').toLowerCase().includes(deptSearch.toLowerCase()) || 
                            (d.dept_code || '').toLowerCase().includes(deptSearch.toLowerCase())
                          ).map((dept) => (
                            <button
                              key={dept.dept_id || dept.name}
                              type="button"
                              onClick={() => {
                                setForm(prev => ({ ...prev, department: dept.dept_id }));
                                setDeptSearch(dept.name);
                                setShowDeptDropdown(false);
                              }}
                              className={`w-full text-left px-3.5 py-2 text-xs transition duration-100 hover:bg-blue-50 hover:text-blue-600 font-medium cursor-pointer ${
                                String(form.department) === String(dept.dept_id) ? 'bg-blue-50/50 text-blue-600 font-bold' : 'text-gray-700'
                              }`}
                            >
                              {dept.name} ({dept.dept_code})
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Joining Date */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Joining Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={form.joiningDate}
                    onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  />
                </div>

                {/* Shift */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Work Shift</label>
                  <select
                    value={form.shift}
                    onChange={(e) => setForm({ ...form, shift: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="">Select Work Shift</option>
                    <option value="Day Shift">Day Shift</option>
                    <option value="Night Shift">Night Shift</option>
                    <option value="Morning Shift">Morning Shift</option>
                    <option value="Evening Shift">Evening Shift</option>
                    <option value="Flexible Shift">Flexible Shift</option>
                  </select>
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Employee Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    <option value="">Select Employee Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                {/* Manager */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Supervisor / Manager</label>
                  <input
                    type="text"
                    value={form.manager}
                    onChange={(e) => setForm({ ...form, manager: e.target.value })}
                    placeholder="Aravind Swamy"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Desk */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Desk / Workspace Location</label>
                  <input
                    type="text"
                    value={form.desk}
                    onChange={(e) => setForm({ ...form, desk: e.target.value })}
                    placeholder="Bay 1 - Floor 1"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Action Buttons Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 bg-gray-50/30">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="px-4.5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 transition active:scale-95 text-xs cursor-pointer glossy-shine"
            >
              {isEditMode ? "Update Profile" : "Save Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
