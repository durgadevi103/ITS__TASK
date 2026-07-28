import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from "./components/login/Login";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Signup from './components/signup/Signup'
import EmployeeList from './components/employee/EmployeeList'
import AddEmployee from './components/employee/AddEmployee'
import Department from './components/department/Department'
import Navbar from './mainscreen/Navbar'
import Sidebar from './mainscreen/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import Attendance from './components/attendance/Attendance'
import LeaveManagement from './components/leave/LeaveManagement'
import api from './api/axios.js'

// Simple elegant placeholder component for pages under development
const Placeholder = ({ title }) => (
  <div className="p-6 bg-[#f8fafc] min-h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto text-xl font-bold">
        🛠️
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title} Section</h2>
        <p className="text-sm text-gray-500 mt-2">
          This module is currently being integrated into the Employee Management system.
        </p>
      </div>
    </div>
  </div>
);

// Inline Layout component that renders Sidebar, Navbar, and route Outlet
const Layout = ({ currentUser, setCurrentUser }) => {
  const [useData, setData] = useState("Dashboard"); // Default title is Dashboard
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleGetdata = (value) => {
    setData(value);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <Navbar 
        usedata={useData} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        isSidebarOpen={sidebarOpen}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <div className="flex flex-1 relative">
        <Sidebar
          frstValue={handleGetdata}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />

        <main className="ml-0 md:ml-64 mt-16 w-full md:w-[calc(100%-16rem)] min-h-[calc(100vh-4rem)] overflow-x-hidden transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// ProtectedRoute component to ensure only logged-in users access layout pages
const ProtectedRoute = ({ currentUser }) => {
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get('/auth/current-user');
        if (res.data.success && res.data.user) {
          setCurrentUser(res.data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Session fetch failed", err);
        setCurrentUser(null);
      } finally {
        setLoadingSession(false);
      }
    };
    fetchSession();
  }, []);

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Root path redirects */}
        <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        {/* Protected layout routes */}
        <Route element={<ProtectedRoute currentUser={currentUser} />}>
          <Route element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="add-employee" element={<AddEmployee />} />
            
            {/* Placeholders for other sidebar sections */}
            <Route path="departments" element={<Department />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave-management" element={<LeaveManagement />} />
            <Route path="payroll" element={<Placeholder title="Payroll & Salary" />} />
            <Route path="reports" element={<Placeholder title="Analytics & Reports" />} />
            <Route path="settings" element={<Placeholder title="System Settings" />} />
          </Route>
        </Route>

        {/* Public auth routes */}
        <Route path="/login" element={<Login onLoginSuccess={setCurrentUser} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
