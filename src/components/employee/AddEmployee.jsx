import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await api.get('/department/list/');
        const listData = response.data.data || response.data.list;
        if (response.data.success && listData && listData.length > 0) {
          const mapped = listData.map(d => ({
            name: d.dept_name || d.name,
            dept_code: d.dept_code || d.dept_id_code
          }));
          setDepartments(mapped);
          const names = mapped.map(d => d.name);
          if (!names.includes('IT')) {
            setForm(prev => ({ ...prev, department: names[0] }));
          }
          return;
        }
      } catch (err) {
        console.error("Error loading departments for employee registration", err);
      }

      // Fallback
      const local = sessionStorage.getItem('departmentsData');
      if (local) {
        const parsed = JSON.parse(local);
        setDepartments(parsed);
        if (parsed.length > 0) {
          setForm(prev => ({ ...prev, department: parsed[0].name }));
        }
      } else {
        const fallback = [{ name: 'Information Technology' }, { name: 'Human Resources' }, { name: 'Finance' }];
        setDepartments(fallback);
      }
    };
    fetchDepts();
  }, []);

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
    }
  }, [isEditMode, editEmployee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.designation) return;

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
        const responseList = await api.get('/employee/list');
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
                  <label className="block font-semibold text-gray-700">Full Name</label>
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
                  <label className="block font-semibold text-gray-700">Email Address</label>
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
                  <label className="block font-semibold text-gray-700">Phone Number</label>
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
                  <input
                    type="text"
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    placeholder="O+"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
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
                  <input
                    type="text"
                    value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    placeholder="Indian"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Languages */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Languages Known</label>
                  <input
                    type="text"
                    value={form.languages}
                    onChange={(e) => setForm({ ...form, languages: e.target.value })}
                    placeholder="Tamil, English, Hindi"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
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
                  <label className="block font-semibold text-gray-700">Designation / Position</label>
                  <input
                    type="text"
                    required
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="Frontend Developer"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium cursor-pointer"
                  >
                    {departments.length === 0 ? (
                      <option value="">No Departments Available</option>
                    ) : (
                      departments.map((dept) => (
                        <option key={dept.dept_id_code} value={dept.name}>
                          {dept.name}
                        </option>
                      ))
                    )}
                  </select>
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
                  <label className="block font-semibold text-gray-700">Joining Date</label>
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
                  <input
                    type="text"
                    value={form.shift}
                    onChange={(e) => setForm({ ...form, shift: e.target.value })}
                    placeholder="Day Shift"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="block font-semibold text-gray-700">Employee Type</label>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="Full Time"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
                  />
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
