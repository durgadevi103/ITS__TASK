import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  Download,
  X
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
          return parsed.map((e) => {
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
  const [selectedEmployee, setSelectedEmployee] = useState(() => {
    return employees.length > 0 ? employees[0] : null;
  });
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [toastMsg, setToastMsg] = useState("");

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
    <div className="p-4 bg-[#f8fafc] h-[calc(100vh-4rem)] flex flex-col gap-4 text-gray-700 overflow-hidden">
      
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

      {/* Unified Header & Filter Section */}
      <div className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
        {/* Left Side: Title & Breadcrumbs */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">Employees</h1>
          <nav className="text-[10px] text-gray-400 font-semibold flex items-center gap-1.5">
            <span className="cursor-pointer hover:text-blue-600 transition" onClick={() => navigate('/')}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-500">Employees</span>
          </nav>
        </div>
        
        {/* Right Side: Search, Filters & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end w-full">
          {/* Search Input with border */}
          <div className="relative flex-1 max-w-xs w-full">
            <Search size={14} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employee..."
              className="w-full pl-8.5 pr-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Filters & Button Group */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Department Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer appearance-none min-w-[130px]"
              >
                <option value="All Departments">All Departments</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
              <ChevronDown size={12} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Select */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer appearance-none min-w-[110px]"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={12} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Add Employee Button */}
            <button
              onClick={() => navigate('/add-employee')}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow-md shadow-blue-600/10 transition active:scale-95 text-xs whitespace-nowrap ml-auto sm:ml-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Employee</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-Pane Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden">
        
        {/* Left Pane: Employee List Card */}
        <div className={`bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full transition-all duration-300 ${
          selectedEmployee ? 'flex-[1.8] lg:min-w-0' : 'flex-1'
        }`}>
          {/* Scrollable table container */}
          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead className="sticky top-0 bg-gray-50/90 backdrop-blur-xs border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider z-10">
                <tr>
                  <th className="py-2.5 px-4">Employee</th>
                  <th className="py-2.5 px-4">Role & Dept</th>
                  <th className="py-2.5 px-4">Contact</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className={`hover:bg-[#f8fafc]/80 transition cursor-pointer ${
                      selectedEmployee && selectedEmployee.id === emp.id ? 'bg-[#f1f5f9]/70' : ''
                    }`}
                  >
                    {/* Employee Profile (Avatar + Name + ID) */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-xs"
                        />
                        <div>
                          <div className="font-bold text-gray-900 leading-tight">{emp.name}</div>
                          <div className="text-[10px] text-gray-400 font-semibold mt-0.5">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Role & Dept (Designation + Department Badge) */}
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-gray-800 leading-tight">{emp.designation}</div>
                      <div className="mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getDeptColor(emp.department)}`}>
                          {emp.department}
                        </span>
                      </div>
                    </td>

                    {/* Contact (Email + Phone) */}
                    <td className="py-2.5 px-4">
                      <div className="text-gray-600 font-medium leading-tight">{emp.email}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5 font-medium">{emp.phone}</div>
                    </td>

                    {/* Status badge */}
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1 hover:bg-blue-50 text-blue-500 hover:text-blue-600 rounded-md transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => navigate('/add-employee')}
                          className="p-1 hover:bg-amber-50 text-amber-500 hover:text-amber-600 rounded-md transition cursor-pointer"
                          title="Edit Employee"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(emp.id, e)}
                          className="p-1 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-md transition cursor-pointer"
                          title="Delete Profile"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compact Pagination Bar */}
          <div className="p-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 bg-gray-50/30">
            <div className="text-[11px] text-gray-400 font-semibold">
              Showing 1 to {filteredEmployees.length} of {employees.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 border border-gray-200 text-gray-400 rounded-md hover:bg-gray-50 transition cursor-pointer">
                <ChevronLeft size={12} />
              </button>
              <button className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-md text-[10px] font-bold shadow-xs cursor-pointer">
                1
              </button>
              <button className="w-6 h-6 flex items-center justify-center border border-gray-200 text-gray-500 rounded-md text-[10px] font-bold hover:bg-gray-50 transition cursor-pointer">
                2
              </button>
              <button className="p-1 border border-gray-200 text-gray-400 rounded-md hover:bg-gray-50 transition cursor-pointer">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Selected Employee Details Panel */}
        <AnimatePresence mode="wait">
          {selectedEmployee && (
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="flex-[1.2] flex flex-col gap-4 h-full overflow-hidden min-w-[320px] lg:min-w-0"
            >
              {/* Profile Card Summary */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center relative shrink-0">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  title="Close Details"
                >
                  <X size={14} />
                </button>
                
                <div className="flex flex-col items-center">
                  <img
                    src={selectedEmployee.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"}
                    alt={selectedEmployee.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-50 shadow-sm"
                  />
                  <h3 className="text-sm font-bold text-gray-900 mt-2.5 leading-tight">{selectedEmployee.name}</h3>
                  <span className="text-[10px] text-gray-400 font-semibold mt-0.5">{selectedEmployee.designation}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold mt-1.5 ${getStatusColor(selectedEmployee.status)}`}>
                    {selectedEmployee.status}
                  </span>
                </div>

                <div className="w-full mt-4 space-y-2 border-t border-gray-50 pt-3 text-[10px] font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-gray-400 shrink-0" />
                    <span className="text-gray-800 font-semibold">{selectedEmployee.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="text-gray-800 truncate font-semibold">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span className="text-gray-800 font-semibold">{selectedEmployee.phone}</span>
                  </div>
                </div>
              </div>

              {/* Details Tabs Section */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* Tab Navigation header */}
                <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-2 text-xs font-bold shrink-0">
                  {["Personal Information", "Job Information", "Account Information", "Documents"].map((tab) => {
                    const label = tab === "Personal Information" ? "Personal" :
                                  tab === "Job Information" ? "Job" :
                                  tab === "Account Information" ? "Account" : "Docs";
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 relative transition-all duration-150 cursor-pointer ${
                          activeTab === tab 
                            ? "text-blue-600 border-b-2 border-blue-600" 
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Scrollable Tab Content Area */}
                <div className="flex-1 overflow-y-auto min-h-0 py-3 pr-1 text-[11px] font-semibold text-gray-700 scrollbar-thin">
                  
                  {/* Personal Information Tab */}
                  {activeTab === "Personal Information" && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Full Name</span>
                          <span className="text-gray-800">{selectedEmployee.name}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Gender</span>
                          <span className="text-gray-800">{selectedEmployee.gender || "Female"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Date of Birth</span>
                          <span className="text-gray-800">{selectedEmployee.dob || "12-09-1999"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Blood Group</span>
                          <span className="text-gray-800">{selectedEmployee.bloodGroup || "O+"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Emergency Contact</span>
                          <span className="text-gray-800 truncate block">{selectedEmployee.emergencyContact || "Ramesh Devi (Father)"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Emergency Phone</span>
                          <span className="text-gray-800">{selectedEmployee.emergencyPhone || "9876500000"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Marital Status</span>
                          <span className="text-gray-800">{selectedEmployee.maritalStatus || "Single"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Nationality</span>
                          <span className="text-gray-800">{selectedEmployee.nationality || "Indian"}</span>
                        </div>
                      </div>
                      <div className="border-b border-gray-50 pb-2">
                        <span className="text-[9px] text-gray-400 block">Address</span>
                        <span className="text-gray-800 leading-snug">{selectedEmployee.address || "123, Anna Nagar, Chennai, Tamil Nadu - 600040"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block">Languages Known</span>
                        <span className="text-gray-800">{selectedEmployee.languages || "Tamil, English, Hindi"}</span>
                      </div>
                    </div>
                  )}

                  {/* Job Information Tab */}
                  {activeTab === "Job Information" && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Job Title / Role</span>
                          <span className="text-gray-800">{selectedEmployee.designation}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Work Shift</span>
                          <span className="text-gray-800">{selectedEmployee.shift || "Day Shift"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Department</span>
                          <span className="text-gray-800">{selectedEmployee.department}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Employment Type</span>
                          <span className="text-gray-800">{selectedEmployee.type || "Full Time"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Supervisor / Manager</span>
                          <span className="text-gray-800 truncate block">{selectedEmployee.manager || "Aravind Swamy"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Desk Location</span>
                          <span className="text-gray-800">{selectedEmployee.desk || "Bay 4 - Floor 2"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block">Joined Date</span>
                        <span className="text-gray-800">{selectedEmployee.joiningDate}</span>
                      </div>
                    </div>
                  )}

                  {/* Account Information Tab */}
                  {activeTab === "Account Information" && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">Employee ID</span>
                          <span className="text-gray-800">{selectedEmployee.id}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Username</span>
                          <span className="text-gray-800">{selectedEmployee.username || "durga.devi"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-50 pb-2">
                        <div>
                          <span className="text-[9px] text-gray-400 block">System Role</span>
                          <span className="text-gray-800">{selectedEmployee.role || "Developer"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block">Work Email</span>
                          <span className="text-gray-800 truncate block">{selectedEmployee.email}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 block">Last Login Timestamp</span>
                        <span className="text-gray-800">{selectedEmployee.lastLogin || "23-07-2026 09:12 AM"}</span>
                      </div>
                    </div>
                  )}

                  {/* Documents Tab */}
                  {activeTab === "Documents" && (
                    <div className="space-y-2">
                      {[
                        { name: "Resume_CV.pdf", size: "1.2 MB", type: "PDF" },
                        { name: "Offer_Letter.pdf", size: "850 KB", type: "PDF" },
                        { name: "Aadhaar_ID_Card.png", size: "2.4 MB", type: "Image" }
                      ].map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg transition cursor-pointer">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-md shrink-0">
                              <FileText size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-gray-800 font-bold truncate leading-normal">{doc.name}</p>
                              <p className="text-[9px] text-gray-400 font-semibold">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-blue-500 hover:bg-white rounded-md transition border border-transparent hover:border-gray-200 cursor-pointer shrink-0">
                            <Download size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default EmployeeList;
