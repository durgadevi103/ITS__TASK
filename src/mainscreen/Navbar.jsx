import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ usedata }) => {
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
    <nav className="fixed top-0 left-64 right-0 bg-blue-600 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <div className="font-bold text-lg tracking-wide">
          {usedata || "Dashboard"}
        </div>

        {/* User Account / Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                <User className="w-4 h-4 text-cyan-300" />
                Hi, {currentUser.fullName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4">
          <ul className="space-y-4">
            {currentUser ? (
              <li>
                <div className="text-white font-medium mb-2">
                  Signed in as: {currentUser.fullName || currentUser.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium"
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