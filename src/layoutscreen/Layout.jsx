import React, { useState } from 'react'
import Navbar from '../mainscreen/Navbar'
import Sidebar from '../mainscreen/Sidebar'
import { Outlet } from 'react-router-dom'


const Layout = () => {


    const [useData,setData] = useState("Home")
  
   

    console.log("layout",useData)

    const handleGetdata = (value) =>{
    console.log(value)
    setData(value)

    }
  return (
<div>
  <Navbar usedata={useData} />

  <div className="flex">
    <Sidebar frstValue={handleGetdata} />

    <main className="ml-64 mt-16 p-5 w-full">
      <Outlet />
    </main>
  </div>
</div>
  )
}

export default Layout
