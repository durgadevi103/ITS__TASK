
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const Sidebar = ({ frstValue, isOpen, onClose, currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const onData = (data) => {
    if (frstValue) frstValue(data);
    if (onClose) onClose();
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Employees", icon: Users, path: "/employees" },
    { name: "Departments", icon: Building2, path: "/departments" },
    { name: "Attendance", icon: Clock, path: "/attendance" },
    { name: "Leave Management", icon: CalendarDays, path: "/leave-management" }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between border-r border-blue-500/20 shadow-xl overflow-hidden`}
      >
        {/* Floating Bubbles Background */}
        <div className="bubble-container">
          <div className="bubble-sb w-8 h-8 left-[10%]" style={{ animationDelay: '0s', animationDuration: '14s' }} />
          <div className="bubble-sb w-12 h-12 left-[30%]" style={{ animationDelay: '3s', animationDuration: '18s' }} />
          <div className="bubble-sb w-6 h-6 left-[50%]" style={{ animationDelay: '1s', animationDuration: '12s' }} />
          <div className="bubble-sb w-10 h-10 left-[70%]" style={{ animationDelay: '5s', animationDuration: '16s' }} />
          <div className="bubble-sb w-8 h-8 left-[85%]" style={{ animationDelay: '2s', animationDuration: '15s' }} />
          
          <div className="bubble-sb-down w-10 h-10 left-[20%]" style={{ animationDelay: '4s', animationDuration: '20s' }} />
          <div className="bubble-sb-down w-6 h-6 left-[45%]" style={{ animationDelay: '0.5s', animationDuration: '13s' }} />
          <div className="bubble-sb-down w-12 h-12 left-[65%]" style={{ animationDelay: '6s', animationDuration: '17s' }} />
          <div className="bubble-sb-down w-8 h-8 left-[80%]" style={{ animationDelay: '1.5s', animationDuration: '15s' }} />
        </div>

        <div className="relative z-10">
          {/* Header Branding */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <h2 className="text-sm font-extrabold tracking-wider text-white uppercase">
                  EMPLOYEE
                </h2>
                <p className="text-[10px] font-extrabold text-blue-200 tracking-widest uppercase">
                  MANAGEMENT
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-slate-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onData(item.name)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive || (item.name === "Employees" && window.location.pathname === "/")
                      ? "bg-white text-blue-900 shadow-md shadow-blue-950/20 font-bold"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout at the bottom */}
        <div className="p-4 border-t border-white/5 relative z-10">
          <NavLink
            to="/login"
            onClick={async (e) => {
              e.preventDefault();
              try {
                await api.post("/auth/logout");
              } catch (err) {
                console.error("Logout failed", err);
              }
              if (setCurrentUser) {
                setCurrentUser(null);
              }
              onData("Logout");
              navigate("/login");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
