
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  LogOut,
  X,
  Sparkles,
  Pin
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";

const Sidebar = ({ frstValue, isOpen, onClose, currentUser, setCurrentUser, onMouseEnter, onMouseLeave, isPinned, onTogglePin }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#2b589f] via-[#108985] to-[#119e73] text-white z-50 transition-all duration-300 ease-in-out flex flex-col justify-between border-r border-[#119e73]/20 shadow-xl overflow-visible group ${
          isOpen
            ? "translate-x-0 w-64"
            : `-translate-x-full md:translate-x-0 ${isPinned ? "md:w-64" : "md:w-16 md:hover:w-64"}`
        }`}
      >
        {/* Floating Pin Button Handle on Right Edge (Desktop only) */}
        <button
          onClick={onTogglePin}
          className={`hidden md:flex absolute right-3 top-[84px] z-55 items-center justify-center w-7 h-7 rounded-full bg-white text-[#108985] hover:text-[#2b589f] border border-slate-200/80 shadow-md transition cursor-pointer ${
            isPinned ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95"
          }`}
          title={isPinned ? "Unpin Sidebar (Floating)" : "Pin Sidebar (Static)"}
          aria-label={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
        >
          <Pin size={13} className={isPinned ? "rotate-45" : ""} />
        </button>

        {/* Ambient Bubbles Wrapper (Clipped) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-r-3xl">
          {/* Floating Ambient Bubbles */}
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
        </div>

        <div className="relative z-10 flex-1">
          {/* Header Branding */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className={`flex items-center gap-3 transition-all duration-300 ${
              isPinned || isOpen ? "flex-row justify-start" : "flex-col justify-center group-hover:flex-row group-hover:justify-start"
            }`}>
              <motion.div
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-md shrink-0"
              >
                <Users className="w-5 h-5 text-white" />
              </motion.div>
              <div className="overflow-hidden whitespace-nowrap select-none">
                {/* Expanded state title */}
                <div className={`leading-tight transition-all duration-300 ${isOpen || isPinned ? "block opacity-100" : "hidden group-hover:block"
                  }`}>
                  <h2 className="text-sm font-extrabold tracking-wider text-white uppercase">
                    EMPLOYEE
                  </h2>
                  <p className="text-[10px] font-bold text-blue-200/90 tracking-widest uppercase">
                    MANAGEMENT
                  </p>
                </div>
                {/* Collapsed state title (EMS) */}
                <div className={`transition-all duration-300 text-[10px] font-black tracking-widest text-blue-200/90 uppercase text-center mt-1 ${isOpen || isPinned ? "hidden" : "block group-hover:hidden"
                  }`}>
                  EMS
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onClose}
                className={`md:hidden text-blue-100 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer shrink-0 ${isOpen ? "opacity-100 block" : "hidden"
                  }`}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => onData(item.name)}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isPinned || isOpen ? "px-4" : "px-2.5 group-hover:px-4"
                  } ${isActive || (item.name === "Employees" && window.location.pathname === "/")
                    ? "bg-white text-[#2563eb] shadow-md shadow-blue-950/20 font-bold"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <item.icon size={18} className="shrink-0" />
                <span className={`transition-all duration-300 ${isOpen || isPinned ? "opacity-100 w-auto" : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto"
                  } overflow-hidden whitespace-nowrap`}>
                  {item.name}
                </span>
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
            className={`flex items-center gap-3 py-3 rounded-xl text-sm font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 ${
              isPinned || isOpen ? "px-4" : "px-2.5 group-hover:px-4"
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={`transition-all duration-300 ${isOpen || isPinned ? "opacity-100 w-auto" : "opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto"
              } overflow-hidden whitespace-nowrap`}>
              Logout
            </span>
          </NavLink>
        </div>
      </div>

    </>
  );
};

export default Sidebar;

