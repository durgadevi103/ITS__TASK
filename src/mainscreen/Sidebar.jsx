
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  LogOut,
  X,
  Sparkles
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";

const Sidebar = ({ frstValue, isOpen, onClose, currentUser, setCurrentUser }) => {
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

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-700 via-indigo-800 to-blue-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between border-r border-white/10 shadow-2xl overflow-hidden`}
      >
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

        <div className="relative z-10 flex-1">
          {/* Header Branding */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-md shrink-0"
              >
                <Users className="w-5 h-5 text-white" />
              </motion.div>
              <div className="leading-tight">
                <h2 className="text-sm font-extrabold tracking-wider text-white uppercase flex items-center gap-1.5">
                  EMPLOYEE <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </h2>
                <p className="text-[10px] font-bold text-blue-200/90 tracking-widest uppercase">
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
          <nav className="mt-6 px-3 space-y-1.5 relative">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.name === "Employees" && location.pathname === "/");
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => onData(item.name)}
                  className="relative group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 outline-none"
                >
                  {/* Gliding Active Background Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-lg shadow-blue-950/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative z-10 ${isActive ? "text-blue-700 font-extrabold" : "text-blue-100 group-hover:text-white"}`}
                  >
                    <item.icon size={18} />
                  </motion.div>

                  <span className={`relative z-10 transition-colors duration-150 ${
                    isActive ? "text-blue-900 font-extrabold" : "text-blue-100 group-hover:text-white"
                  }`}>
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout at the bottom */}
        <div className="p-4 border-t border-white/10 relative z-10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-100 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-400/30 transition-all duration-200 shadow-sm backdrop-blur-md"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </NavLink>
          </motion.div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

