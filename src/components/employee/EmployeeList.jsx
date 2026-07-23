import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeList = () => {
  const navigate = useNavigate();

  // Mock list with complete profile details matching the mock image
  const defaultEmployees = [
    {
      id: "EMP001",
      name: "Durga Devi",
      email: "durga@email.com",
      phone: "9876543210",
      department: "IT",
      designation: "Frontend Developer",
      joiningDate: "15-07-2024",
      status: "Active",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      // Personal details
      dob: "12-09-1999",
      gender: "Female",
      address: "123, Anna Nagar, Chennai, Tamil Nadu - 600040",
      emergencyContact: "Ramesh Devi (Father)",
      emergencyPhone: "9876500000",
      bloodGroup: "O+",
      maritalStatus: "Single",
      nationality: "Indian",
      languages: "Tamil, English, Hindi",
      // Job info
      shift: "Day Shift",
      type: "Full Time",
      manager: "Aravind Swamy",
      desk: "Bay 4 - Floor 2",
      // Account info
      username: "durga.devi",
      role: "Developer",
      lastLogin: "23-07-2026 09:12 AM"
    },
    {
      id: "EMP002",
      name: "Rahul Kumar",
      email: "rahul@email.com",
      phone: "9876543211",
      department: "HR",
      designation: "HR Executive",
      joiningDate: "10-06-2024",
      status: "Active",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      dob: "24-05-1995",
      gender: "Male",
      address: "456, Lake View Road, Bangalore, Karnataka - 560001",
      emergencyContact: "Sunita Kumar (Mother)",
      emergencyPhone: "9876500001",
      bloodGroup: "A+",
      maritalStatus: "Married",
      nationality: "Indian",
      languages: "Kannada, Hindi, English",
      shift: "Day Shift",
      type: "Full Time",
      manager: "Priya Nair",
      desk: "Bay 1 - Floor 1",
      username: "rahul.kumar",
      role: "HR Executive",
      lastLogin: "23-07-2026 10:45 AM"
    },
    {
      id: "EMP003",
      name: "Priya Sharma",
      email: "priya@email.com",
      phone: "9876543212",
      department: "Finance",
      designation: "Accountant",
      joiningDate: "05-05-2024",
      status: "On Leave",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
      dob: "08-11-1993",
      gender: "Female",
      address: "789, Residency Road, Hyderabad, Telangana - 500002",
      emergencyContact: "Karan Sharma (Spouse)",
      emergencyPhone: "9876500002",
      bloodGroup: "B+",
      maritalStatus: "Married",
      nationality: "Indian",
      languages: "Telugu, Hindi, English",
      shift: "Day Shift",
      type: "Full Time",
      manager: "Vikram Malhotra",
      desk: "Bay 2 - Floor 3",
      username: "priya.sharma",
      role: "Finance Admin",
      lastLogin: "22-07-2026 05:30 PM"
    },
    {
      id: "EMP004",
      name: "Arun Raj",
      email: "arun@email.com",
      phone: "9876543213",
      department: "IT",
      designation: "Backend Developer",
      joiningDate: "20-04-2024",
      status: "Active",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
      dob: "15-02-1997",
      gender: "Male",
      address: "12, Beach Road, Chennai, Tamil Nadu - 600004",
      emergencyContact: "Rajasekar (Father)",
      emergencyPhone: "9876500003",
      bloodGroup: "O-",
      maritalStatus: "Single",
      nationality: "Indian",
      languages: "Tamil, English",
      shift: "Night Shift",
      type: "Full Time",
      manager: "Aravind Swamy",
      desk: "Bay 5 - Floor 2",
      username: "arun.raj",
      role: "Developer",
      lastLogin: "23-07-2026 08:00 AM"
    },
    {
      id: "EMP005",
      name: "Sneha Reddy",
      email: "sneha@email.com",
      phone: "9876543214",
      department: "Marketing",
      designation: "Marketing Executive",
      joiningDate: "18-03-2024",
      status: "Active",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      dob: "30-07-1996",
      gender: "Female",
      address: "99, MG Road, Vijayawada, Andhra Pradesh - 520010",
      emergencyContact: "Nageswara Reddy (Father)",
      emergencyPhone: "9876500004",
      bloodGroup: "AB+",
      maritalStatus: "Single",
      nationality: "Indian",
      languages: "Telugu, Hindi, English",
      shift: "Day Shift",
      type: "Full Time",
      manager: "Sanjay Kumar",
      desk: "Bay 3 - Floor 1",
      username: "sneha.reddy",
      role: "Marketing Manager",
      lastLogin: "23-07-2026 11:15 AM"
    },
    {
      id: "EMP006",
      name: "Vikram Singh",
      email: "vikram@email.com",
      phone: "9876543215",
      department: "Operations",
      designation: "Operations Manager",
      joiningDate: "12-02-2024",
      status: "Inactive",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
      dob: "05-04-1990",
      gender: "Male",
      address: "10, Sector 15, Noida, Uttar Pradesh - 201301",
      emergencyContact: "Rita Singh (Spouse)",
      emergencyPhone: "9876500005",
      bloodGroup: "B-",
      maritalStatus: "Married",
      nationality: "Indian",
      languages: "Hindi, Punjabi, English",
      shift: "Day Shift",
      type: "Full Time",
      manager: "Rajiv Bajaj",
      desk: "Cabin 3 - Floor 4",
      username: "vikram.singh",
      role: "Operations Admin",
      lastLogin: "20-07-2026 06:00 PM"
    }
  ];

  // State
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          // Merge details if missing
          return parsed.map((e, index) => {
            const match = defaultEmployees.find(d => d.id === e.id);
            return { ...match, ...e };
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.setItem("employees", JSON.stringify(defaultEmployees));
    return defaultEmployees;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [toastMsg, setToastMsg] = useState("");

  // Select first employee as active details by default (Durga Devi)
  useEffect(() => {
    if (employees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(employees[0]);
    }
  }, [employees, selectedEmployee]);

  // Filters
  const filteredEmployees = employees.filter(emp => {
    const nameStr = emp.name ? emp.name.toLowerCase() : "";
    const emailStr = emp.email ? emp.email.toLowerCase() : "";
    const idStr = emp.id ? emp.id.toLowerCase() : "";
    const matchesSearch = nameStr.includes(searchTerm.toLowerCase()) ||
                          emailStr.includes(searchTerm.toLowerCase()) ||
                          idStr.includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "All Departments" || emp.department === selectedDept;
    const matchesStatus = selectedStatus === "All Status" || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Prevent changing active selection
    const updated = employees.filter(emp => emp.id !== id);
    setEmployees(updated);
    localStorage.setItem("employees", JSON.stringify(updated));
    setToastMsg("Employee profile deleted.");
    setTimeout(() => setToastMsg(""), 3000);

    // If deleted employee was selected, reset
    if (selectedEmployee && selectedEmployee.id === id) {
      setSelectedEmployee(updated.length > 0 ? updated[0] : null);
    }
  };

  const getDeptColor = (dept) => {
    switch (dept) {
      case "IT": return "bg-[#eff6ff] text-[#2563eb] border border-blue-100";
      case "HR": return "bg-[#faf5ff] text-[#9333ea] border border-purple-100";
      case "Finance": return "bg-[#fffbeb] text-[#d97706] border border-amber-100";
      case "Marketing": return "bg-[#fff1f2] text-[#e11d48] border border-rose-100";
      case "Operations": return "bg-[#f0fdfa] text-[#0d9488] border border-teal-100";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "On Leave": return "bg-orange-50 text-orange-600 border border-orange-200";
      case "Inactive": return "bg-gray-50 text-gray-500 border border-gray-200";
      default: return "bg-gray-50 text-gray-500 border border-gray-200";
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen space-y-6 text-gray-700">
      
      {/* Toast Notice */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold border border-gray-800"
          >
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg("")} className="text-gray-400 hover:text-white p-0.5">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Employees</h1>
          <nav className="text-xs text-gray-400 font-semibold mt-1 flex items-center gap-1.5">
            <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-500">Employees</span>
          </nav>
        </div>
        
        <button
          onClick={() => navigate('/add-employee')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition active:scale-95 text-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Select */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none min-w-[150px]"
            >
              <option value="All Departments">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
            <ChevronDown size={14} className="text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Select */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none min-w-[130px]"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown size={14} className="text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-5">Employee ID</th>
                <th className="py-4 px-4">Profile</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Designation</th>
                <th className="py-4 px-4">Joining Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`hover:bg-[#f8fafc]/80 transition cursor-pointer ${
                    selectedEmployee && selectedEmployee.id === emp.id ? 'bg-[#f1f5f9]/60' : ''
                  }`}
                >
                  {/* ID */}
                  <td className="py-4 px-5 font-semibold text-gray-800 tracking-tight">{emp.id}</td>
                  
                  {/* Profile */}
                  <td className="py-3 px-4">
                    <img
                      src={emp.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"}
                      alt={emp.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  </td>

                  {/* Name */}
                  <td className="py-4 px-4 font-bold text-gray-900">{emp.name}</td>
                  
                  {/* Email */}
                  <td className="py-4 px-4 text-gray-500 font-medium">{emp.email}</td>
                  
                  {/* Phone */}
                  <td className="py-4 px-4 text-gray-500 font-medium">{emp.phone}</td>
                  
                  {/* Department */}
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDeptColor(emp.department)}`}>
                      {emp.department}
                    </span>
                  </td>

                  {/* Designation */}
                  <td className="py-4 px-4 text-gray-700 font-semibold">{emp.designation}</td>
                  
                  {/* Joining Date */}
                  <td className="py-4 px-4 text-gray-500 font-medium">{emp.joiningDate}</td>
                  
                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusColor(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="p-1.5 hover:bg-blue-50 text-blue-500 hover:text-blue-600 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => navigate('/add-employee')}
                        className="p-1.5 hover:bg-amber-50 text-amber-500 hover:text-amber-600 rounded-lg transition"
                        title="Edit Employee"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(emp.id, e)}
                        className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition"
                        title="Delete Profile"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-400 font-semibold">
            Showing 1 to {filteredEmployees.length} of {employees.length} entries
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 transition cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition cursor-pointer">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-50 transition cursor-pointer">
              4
            </button>
            <button className="p-1.5 border border-gray-200 text-gray-400 rounded-lg hover:bg-gray-50 transition cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Employee Details Panel at the Bottom */}
      {selectedEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Card Left */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center relative">
            <span className="absolute top-5 left-5 text-sm font-extrabold text-gray-900">Employee Details</span>
            
            <div className="mt-8 flex flex-col items-center">
              <img
                src={selectedEmployee.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"}
                alt={selectedEmployee.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md"
              />
              
              <h3 className="text-lg font-bold text-gray-900 mt-4">{selectedEmployee.name}</h3>
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold mt-1.5 ${getStatusColor(selectedEmployee.status)}`}>
                {selectedEmployee.status}
              </span>
            </div>

            {/* List Contact Details */}
            <div className="w-full mt-6 space-y-3.5 border-t border-gray-50 pt-5 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-3">
                <User size={15} className="text-gray-400 shrink-0" />
                <span className="text-gray-800">{selectedEmployee.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-gray-400 shrink-0" />
                <span className="text-gray-800 truncate">{selectedEmployee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-gray-400 shrink-0" />
                <span className="text-gray-800">{selectedEmployee.phone}</span>
              </div>
            </div>
          </div>

          {/* Details Tabs Right */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              {/* Tab Navigation header */}
              <div className="flex flex-wrap items-center gap-6 border-b border-gray-100 pb-3 text-sm font-bold">
                {["Personal Information", "Job Information", "Account Information", "Documents"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 relative transition-all duration-150 ${
                      activeTab === tab 
                        ? "text-blue-600 border-b-2 border-blue-600" 
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content Areas */}
              <div className="mt-6">
                
                {/* Personal Information Tab */}
                {activeTab === "Personal Information" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs font-semibold">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Full Name</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Emergency Contact</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.emergencyContact || "Ramesh Devi (Father)"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Date of Birth</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.dob || "12-09-1999"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Emergency Phone</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.emergencyPhone || "9876500000"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Gender</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.gender || "Female"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Blood Group</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.bloodGroup || "O+"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Email</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Marital Status</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.maritalStatus || "Single"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Phone Number</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Nationality</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.nationality || "Indian"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 sm:col-span-2 border-t border-gray-50 pt-3">
                      <span className="text-gray-400">Address</span>
                      <span className="text-gray-800 text-right sm:text-left">{selectedEmployee.address || "123, Anna Nagar, Chennai, Tamil Nadu - 600040"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 sm:col-span-2">
                      <span className="text-gray-400">Languages Known</span>
                      <span className="text-gray-800 text-right sm:text-left">{selectedEmployee.languages || "Tamil, English, Hindi"}</span>
                    </div>
                  </div>
                )}

                {/* Job Information Tab */}
                {activeTab === "Job Information" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs font-semibold">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Job Title / Role</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.designation}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Work Shift</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.shift || "Day Shift"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Department</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Employment Type</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.type || "Full Time"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Supervisor / Manager</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.manager || "Aravind Swamy"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Desk Location</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.desk || "Bay 4 - Floor 2"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 sm:col-span-2">
                      <span className="text-gray-400">Joined Date</span>
                      <span className="text-gray-800 text-right sm:text-left">{selectedEmployee.joiningDate}</span>
                    </div>
                  </div>
                )}

                {/* Account Information Tab */}
                {activeTab === "Account Information" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs font-semibold">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Employee ID</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Username</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.username || "durga.devi"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">System Role</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.role || "Developer"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Work Email</span>
                      <span className="text-gray-800 text-right">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 sm:col-span-2 border-t border-gray-50 pt-3">
                      <span className="text-gray-400">Last Login Timestamp</span>
                      <span className="text-gray-800 text-right sm:text-left">{selectedEmployee.lastLogin || "23-07-2026 09:12 AM"}</span>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "Documents" && (
                  <div className="space-y-3.5 text-xs font-semibold">
                    {[
                      { name: "Resume_CV.pdf", size: "1.2 MB", type: "PDF" },
                      { name: "Offer_Letter.pdf", size: "850 KB", type: "PDF" },
                      { name: "Aadhaar_ID_Card.png", size: "2.4 MB", type: "Image" }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/70 border border-gray-100 rounded-xl transition cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-gray-800 font-bold">{doc.name}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition border border-transparent hover:border-gray-200">
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default EmployeeList;
