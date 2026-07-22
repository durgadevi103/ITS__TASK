import {
  Home,
  User,
  Users,
  Package,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ frstValue, isOpen, onClose }) => {
  const onData = (data) => {
    frstValue(data);
    if (onClose) onClose();
  };

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
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <ul className="mt-6 space-y-1">
          <NavLink
            to="/home"
            onClick={() => onData("Home")}
            className={({ isActive }) =>
              `px-6 py-3 cursor-pointer flex items-center gap-3 transition font-medium ${
                isActive ? "bg-gray-800 text-cyan-400 border-l-4 border-cyan-400" : "hover:bg-gray-800/60 text-gray-300"
              }`
            }
          >
            <Home size={20} />
            Home
          </NavLink>

          <NavLink
            to="/customer"
            onClick={() => onData("customer")}
            className={({ isActive }) =>
              `px-6 py-3 cursor-pointer flex items-center gap-3 transition font-medium ${
                isActive ? "bg-gray-800 text-cyan-400 border-l-4 border-cyan-400" : "hover:bg-gray-800/60 text-gray-300"
              }`
            }
          >
            <Users size={20} />
            <span>Customer</span>
          </NavLink>

          <NavLink 
            to="/vendor"
            onClick={() => onData("vendor")}
            className={({ isActive }) =>
              `px-6 py-3 cursor-pointer flex items-center gap-3 transition font-medium ${
                isActive ? "bg-gray-800 text-cyan-400 border-l-4 border-cyan-400" : "hover:bg-gray-800/60 text-gray-300"
              }`
            }
          >
            <User size={20} />
            <span>Vendor</span>
          </NavLink>

          <NavLink
            to="/products"
            onClick={() => onData("products")}
            className={({ isActive }) =>
              `px-6 py-3 cursor-pointer flex items-center gap-3 transition font-medium ${
                isActive ? "bg-gray-800 text-cyan-400 border-l-4 border-cyan-400" : "hover:bg-gray-800/60 text-gray-300"
              }`
            }
          >
            <Package size={20} />
            <span>Product List</span>
          </NavLink>

          {/* <li
            className="px-6 py-3 hover:bg-gray-800/60 cursor-pointer flex items-center gap-3 text-gray-300 transition"
            onClick={() => onData("message")}
          >
            <Mail size={20} />
            <span>Messages</span>
          </li>

          <li
            className="px-6 py-3 hover:bg-gray-800/60 cursor-pointer flex items-center gap-3 text-gray-300 transition"
            onClick={() => onData("settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

