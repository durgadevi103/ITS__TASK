import React from "react";
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
import { NavLink } from "react-router-dom";

const Sidebar = ({ frstValue, isOpen, onClose }) => {
  const onData = (data) => {
    if (frstValue) frstValue(data);
    if (onClose) onClose();
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Employees", icon: Users, path: "/employees" },
    { name: "Departments", icon: Building2, path: "/departments" },
    { name: "Attendance", icon: Clock, path: "/attendance" },
    { name: "Leave Management", icon: CalendarDays, path: "/leave-management" },
    { name: "Payroll", icon: CreditCard, path: "/payroll" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" }
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#090d16] text-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between border-r border-gray-900`}
      >
        <div>
          {/* Header Branding */}
          <div className="flex items-center justify-between p-5 border-b border-gray-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <h2 className="text-sm font-extrabold tracking-wider text-white uppercase">
                  EMPLOYEE
                </h2>
                <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  MANAGEMENT
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-gray-800 transition"
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
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive || (item.name === "Employees" && window.location.pathname === "/")
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
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
        <div className="p-4 border-t border-gray-900">
          <NavLink
            to="/login"
            onClick={() => onData("Logout")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 transition-all duration-200"
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
