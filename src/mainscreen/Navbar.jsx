import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, LogOut, Search, User, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios.js";

const Navbar = ({ usedata, onToggleSidebar, isSidebarOpen, isSidebarHovered, searchQuery, setSearchQuery, currentUser, setCurrentUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const hideSearchRoutes = ["/employees", "/attendance", "/departments", "/leave-management"];
  const showTopSearch = !hideSearchRoutes.includes(location.pathname);


  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("Logout failed", e);
    }
    sessionStorage.removeItem('currentUser');
    if (setCurrentUser) {
      setCurrentUser(null);
    }
    setDropdownOpen(false);
    navigate("/login");
  };

  const displayName = currentUser
    ? (currentUser.username || currentUser.fullName || (currentUser.email ? currentUser.email.split('@')[0] : "Admin"))
    : "Admin";
  const displayEmail = currentUser?.email || "admin@example.com";
  const displayAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff&bold=true`;

  const notifications = [
    { id: 1, title: "New Employee Added", time: "10 mins ago", unread: true },
    { id: 2, title: "Leave Request Submitted", time: "1 hour ago", unread: true },
    { id: 3, title: "Attendance Report Ready", time: "3 hours ago", unread: false },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-gradient-to-r from-[#2b589f] via-[#108985] to-[#119e73] text-white border-b border-[#119e73]/20 shadow-lg z-40 h-16 transition-all duration-300 ${(isSidebarOpen || isSidebarHovered) ? "md:left-64" : "md:left-16"
      }`}>
      {/* Floating Bubbles Background */}
      <div className="bubble-container">
        <div className="bubble-nb w-5 h-5 left-[5%]" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="bubble-nb w-8 h-8 left-[25%]" style={{ animationDelay: '2s', animationDuration: '11s' }} />
        <div className="bubble-nb w-6 h-6 left-[55%]" style={{ animationDelay: '1s', animationDuration: '9s' }} />
        <div className="bubble-nb w-7 h-7 left-[80%]" style={{ animationDelay: '3s', animationDuration: '12s' }} />
        <div className="bubble-nb-down w-6 h-6 left-[40%]" style={{ animationDelay: '1.5s', animationDuration: '10s' }} />
        <div className="bubble-nb-down w-5 h-5 left-[70%]" style={{ animationDelay: '3.5s', animationDuration: '9s' }} />
      </div>

      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 h-full relative z-10">

        {/* Left Side: Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition cursor-pointer"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>

        {/* Center/Right: Quick Search Bar */}
        {showTopSearch && (
          <div className="hidden sm:flex items-center flex-1 max-w-xs mx-6">
            <motion.div
              animate={{ scale: searchFocused ? 1.02 : 1 }}
              className={`w-full relative flex items-center bg-white/10 rounded-xl px-3 py-1.5 border transition-all duration-200 ${searchFocused ? 'bg-white/20 border-white ring-2 ring-white/10 shadow-md' : 'border-white/15 hover:bg-white/20'
                }`}
            >
              <Search size={15} className={`mr-2 transition-colors ${searchFocused ? 'text-white' : 'text-blue-100'}`} />
              <input
                type="text"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="Search employees, departments..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full text-xs font-semibold text-white placeholder-blue-100 bg-transparent outline-none"
              />
            </motion.div>
          </div>
        )}

        {/* Right Side: Bell Notifications & User Info */}
        <div className="flex items-center gap-3 sm:gap-4">


          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setNotifOpen(!notifOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#108985] shadow-xs animate-pulse">
                2
              </span>
            </motion.button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -right-24 sm:right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200/80 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden"
                >
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Notifications</h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">2 New</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-3 hover:bg-slate-50 transition ${n.unread ? 'bg-blue-50/30' : ''}`}>
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-white/20" />

          {/* User Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 hover:bg-white/10 p-1.5 pr-2.5 rounded-xl transition cursor-pointer border border-transparent hover:border-white/10"
            >
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white/30 shadow-xs"
              />
              <div className="text-left hidden sm:block leading-tight">
                <span className="text-xs font-bold text-white block truncate max-w-[110px]">
                  {displayName}
                </span>
                <span className="text-[9px] font-extrabold text-blue-100 block uppercase tracking-wider">
                  Administrator
                </span>
              </div>
              <ChevronDown size={14} className={`text-blue-100 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/80 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
                    <p className="text-xs font-extrabold text-slate-900 truncate mt-0.5">{displayEmail}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition text-left font-semibold cursor-pointer"
                    >
                      <User size={15} className="text-slate-400" />
                      Account Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition text-left font-bold cursor-pointer"
                    >
                      <LogOut size={15} className="text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;

