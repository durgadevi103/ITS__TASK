import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = ({usedata}) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log("navbar", usedata)
  return (
    <nav className="fixed top-0 left-64 right-0 bg-blue-600 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center px-6 py-4">

        {/* Logo */}
       

        {/* Desktop Menu */}
        {/* <ul className="hidden md:flex gap-8 font-medium">
          
        </ul> */}

        {/* Login Button */}
       
        <button className="gap-8 font-medium bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100">
         {usedata}
        </button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 px-6 py-4">
          <ul className="space-y-4">
            

            <li>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg">
                Login
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;