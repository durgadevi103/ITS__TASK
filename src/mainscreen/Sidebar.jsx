import {
  Home,
  User,
  Settings,
  Mail,
  LogOut,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";


const Sidebar = ({frstValue,secondValue}) => {
  
    const onData =(data)=> {
        console.log("sidebar",data)
        frstValue(data)
    }
console.log("loaded")

// const handleLogout = () =>{


// }

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">

      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        MyApp
      </div>

      {/* Menu */}
      <ul className="mt-6">

<NavLink to="/home">
  <li className="px-6 py-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3">
    <Home size={20} />
    Home
  </li>
</NavLink>

<NavLink to="/grid">
  <li className="px-6 py-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3">
    <Home size={20} />
    Grid
  </li>
</NavLink>


        <li className="px-6 py-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3"
        onClick={() => onData("profile")}>
          <User size={20} />
          <span >Profile</span>
        </li>

        <li className="px-6 py-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3"
        onClick={() => onData("message")}>
          <Mail size={20} />
          <span >Messages</span>
        </li>

        <li className="px-6 py-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3"
        onClick={() => onData("settings")}>
          <Settings size={20} />
          <span 
          >Settings</span>
        </li>

      </ul>

      {/* Logout */}
      {/* <div className="absolute bottom-6 w-full px-6">
        <Link to="/Login">
        <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg flex items-center justify-center gap-2">
          <LogOut size={18} />
          Logout
        </button>
        </Link>
      </div> */}

    </div>
  );
};

export default Sidebar;
