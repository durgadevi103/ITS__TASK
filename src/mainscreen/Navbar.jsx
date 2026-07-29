import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, LogOut } from "lucide-react";
import api from "../api/axios.js";

const Navbar = ({ usedata, onToggleSidebar, isSidebarOpen, currentUser, setCurrentUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
    ? (currentUser.username || currentUser.fullName || (currentUser.email ? currentUser.email.split('@')[0] : "User")) 
    : "User";
  const displayAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff&bold=true`;
  
  return (
    <nav className="fixed top-0 left-0 md:left-64 right-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white border-b border-blue-500/30 shadow-sm z-40 h-16">
      {/* Floating Bubbles Background */}
      <div className="bubble-container">
        <div className="bubble-nb w-5 h-5 left-[5%]" style={{ animationDelay: '0s', animationDuration: '8s' }} />
        <div className="bubble-nb w-8 h-8 left-[25%]" style={{ animationDelay: '2s', animationDuration: '11s' }} />
        <div className="bubble-nb w-6 h-6 left-[55%]" style={{ animationDelay: '1s', animationDuration: '9s' }} />
        <div className="bubble-nb w-7 h-7 left-[80%]" style={{ animationDelay: '3s', animationDuration: '12s' }} />
        
        <div className="bubble-nb-down w-6 h-6 left-[40%]" style={{ animationDelay: '1.5s', animationDuration: '10s' }} />
        <div className="bubble-nb-down w-5 h-5 left-[70%]" style={{ animationDelay: '3.5s', animationDuration: '9s' }} />
      </div>

      <div className="mx-auto flex items-center justify-between px-6 h-full relative z-10">
        
        {/* Left Side: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-blue-100 p-1.5 hover:bg-blue-550/35 hover:text-white rounded-lg transition"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="font-extrabold text-white tracking-wide capitalize hidden md:block">
            {usedata || "Dashboard"}
          </div>
        </div>

        {/* Right Side: Bell & User Info */}
        <div className="flex items-center gap-4">
          
          {/* Notification Bell */}
          <button className="relative p-2 text-blue-100 hover:text-white hover:bg-blue-550/35 rounded-xl transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-550 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
              3
            </span>
          </button>

          <div className="h-6 w-px bg-blue-500/50" />

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-blue-550/35 p-1.5 rounded-xl transition text-white"
            >
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-blue-400"
              />
              <span className="text-sm font-semibold text-white hidden sm:inline-block">
                {displayName}
              </span>
              <ChevronDown size={14} className="text-blue-200" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-gray-700">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                  <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
