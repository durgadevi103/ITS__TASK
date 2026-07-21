import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  function navigateLogic() {
   navigate("/")
  }
  const location = useLocation();

  console.log(location);

  const handleLogin = () => {
    if (email === "" || password === "") {
      alert("Please fill all the fields");
    } else {
      alert("Login Successful!");
      console.log("Email:", email);
      console.log("Password:", password);
    }
    
}
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-700 to-cyan-500 flex items-center justify-center px-4">

      {/* Background Circles */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute w-72 h-72 rounded-full bg-cyan-400 blur-3xl opacity-30 top-10 left-10"
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute w-96 h-96 rounded-full bg-blue-300 blur-3xl opacity-20 bottom-0 right-0"
      />

      {/* Login Card */}

      <motion.div
        initial={{
          opacity: 0,
          y: 80,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          type: "spring",
        }}
        whileHover={{
          y: -8,
        }}
        className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-center text-white"
        >
          Login
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-200 mt-2 mb-8"
        >
          Welcome Back
        </motion.p>

        {/* Email */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-5"
        >
          <label className="block mb-2 text-white font-medium">
            Email
          </label>

          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </motion.div>

        {/* Password */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-4"
        >
          <label className="block mb-2 text-white font-medium">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="text-gray-500" />
              ) : (
                <Eye className="text-gray-500" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="text-right mb-6">
          <button className="text-cyan-200 hover:text-white">
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg"
        >
          Login
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-200 mt-6"
        >
          Don't have an account?

          <span onClick={() => navigate("/signup")} className="text-white font-semibold ml-2 cursor-pointer hover:underline">
            Sign Up
          </span>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Login
