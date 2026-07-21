import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from "./components/login/Login";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './components/signup/Signup'
import Navbar from './mainscreen/Navbar'
import Sidebar from './mainscreen/Sidebar'
import Layout from './layoutscreen/Layout'
import Home from './components/Home/home'
import Grid from './components/grid/Grid'


function App() {

    return (
<BrowserRouter>
  <Routes>

    <Route path="/" element={<Layout />}>

      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="Grid" element={<Grid/>}/>
      {/* <Route path="profile" element={<Profile />} />
      <Route path="messages" element={<Messages />} />
      <Route path="settings" element={<Settings />} /> */}

    </Route>

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

  </Routes>
</BrowserRouter>
  );
}

export default App
