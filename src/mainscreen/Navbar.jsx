import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ usedata, onToggleSidebar, isSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 md:left-64 right-0 bg-green-600 text-white shadow-md z-40 h-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-full">

        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            className="md:hidden text-white p-1 hover:bg-green-700 rounded-lg transition"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="font-bold text-base sm:text-lg tracking-wide capitalize">
            {usedata || "Dashboard"}
          </div>
        </div>

        {/* User Account / Auth Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium border border-green-500/40">
                <User className="w-4 h-4 text-cyan-200" />
                Hi, {currentUser.fullName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-white text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition shadow-sm text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition shadow-sm text-sm"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Actions Menu Button */}
        <button
          className="md:hidden text-white p-1 hover:bg-green-700 rounded-lg transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <User size={24} />
        </button>
      </div>

      {/* Mobile User Profile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-700 px-6 py-4 border-t border-green-600 shadow-xl">
          <ul className="space-y-4">
            {currentUser ? (
              <li>
                <div className="text-white font-medium mb-2 text-sm">
                  Signed in as: <span className="font-bold">{currentUser.fullName || currentUser.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-white text-green-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm shadow"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full bg-white text-green-700 py-2 rounded-lg font-semibold text-sm shadow"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

