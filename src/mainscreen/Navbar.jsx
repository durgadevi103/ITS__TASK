import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, LogOut } from "lucide-react";

const Navbar = ({ usedata, onToggleSidebar, isSidebarOpen }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const displayName = currentUser ? (currentUser.fullName || currentUser.email) : "Admin User";
  const displayAvatar = currentUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563eb&color=fff&bold=true`;
  
  return (
    <nav className="fixed top-0 left-0 md:left-64 right-0 bg-white text-gray-800 border-b border-gray-100 shadow-sm z-40 h-16">
      <div className="mx-auto flex items-center justify-between px-6 h-full">
        
        {/* Left Side: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="font-bold text-gray-900 tracking-wide capitalize hidden md:block">
            {usedata || "Dashboard"}
          </div>
        </div>

        {/* Right Side: Bell & User Info */}
        <div className="flex items-center gap-4">
          
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
              3
            </span>
          </button>

          <div className="h-6 w-px bg-gray-200" />

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition"
            >
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline-block">
                {displayName}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
