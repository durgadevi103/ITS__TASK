import React, { useState } from 'react'
import Navbar from '../mainscreen/Navbar'
import Sidebar from '../mainscreen/Sidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  const [useData, setData] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleGetdata = (value) => {
    setData(value);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      <Navbar usedata={useData} onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <div className="flex flex-1 relative">
        <Sidebar
          frstValue={handleGetdata}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="ml-0 md:ml-64 mt-16 w-full md:w-[calc(100%-16rem)] min-h-[calc(100vh-4rem)] overflow-x-hidden transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout


