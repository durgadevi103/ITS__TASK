import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from "./components/login/Login";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Signup from './components/signup/Signup'
import EmployeeList from './components/employee/EmployeeList'
import AddEmployee from './components/employee/AddEmployee'
import Navbar from './mainscreen/Navbar'
import Sidebar from './mainscreen/Sidebar'

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
const Layout = () => {
  const [useData, setData] = useState("Employees");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleGetdata = (value) => {
    setData(value);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <Navbar usedata={useData} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

      <div className="flex flex-1 relative">
        <Sidebar
          frstValue={handleGetdata}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="ml-0 md:ml-64 mt-16 w-full md:w-[calc(100%-16rem)] min-h-[calc(100vh-4rem)] overflow-x-hidden transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EmployeeList />} />
          <Route path="dashboard" element={<Placeholder title="Dashboard" />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="add-employee" element={<AddEmployee />} />
          
          {/* Placeholders for other sidebar sections */}
          <Route path="departments" element={<Placeholder title="Departments" />} />
          <Route path="attendance" element={<Placeholder title="Attendance Tracking" />} />
          <Route path="leave-management" element={<Placeholder title="Leave Management" />} />
          <Route path="payroll" element={<Placeholder title="Payroll & Salary" />} />
          <Route path="reports" element={<Placeholder title="Analytics & Reports" />} />
          <Route path="settings" element={<Placeholder title="System Settings" />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
