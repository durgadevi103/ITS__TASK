import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddEmployee = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: 'IT',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
    dob: '1999-01-01',
    gender: 'Female',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    nationality: 'Indian',
    languages: 'English, Hindi',
    shift: 'Day Shift',
    type: 'Full Time',
    manager: 'Aravind Swamy',
    desk: 'Bay 1 - Floor 1',
  });

  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.designation) return;

    // Load current list
    const saved = localStorage.getItem("employees");
    let currentEmployees = [];

    if (saved) {
      try {
        currentEmployees = JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }

    // Avatar lists
    const avatars = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
    ];
    
    // Create new ID (EMP001, EMP002, ...)
    const nextNum = currentEmployees.length > 0 
      ? Math.max(...currentEmployees.map(emp => {
          const numeric = parseInt(emp.id.replace("EMP", ""));
          return isNaN(numeric) ? 0 : numeric;
        })) + 1
      : 1;
    const formattedId = `EMP${String(nextNum).padStart(3, '0')}`;

    const newEmp = {
      ...form,
      id: formattedId,
      avatarUrl: avatars[Math.floor(Math.random() * avatars.length)],
      username: form.name.toLowerCase().replace(" ", "."),
      role: form.designation,
      lastLogin: "Just Created"
    };

    localStorage.setItem("employees", JSON.stringify([newEmp, ...currentEmployees]));
    
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
      navigate("/employees");
    }, 2000);
  };

  return (
    <div className="p-4 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col gap-4 text-gray-700 overflow-hidden">
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
              <p className="text-sm font-bold text-white">Employee Registered</p>
              <p className="text-xs text-gray-400">Added new employee profile successfully.</p>
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
                Register New Employee
              </h2>
              <p className="text-[10px] text-blue-100 mt-0.5">Fill out personal, job, and account information.</p>
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
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/10 transition active:scale-95 text-xs cursor-pointer"
            >
              Save Employee
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
