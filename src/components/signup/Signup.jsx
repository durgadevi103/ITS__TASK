import React, { useState } from "react";
import { User, Mail, Eye, Lock, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const navigateLogic = () => {
    navigate("/login", {
      state: {
        message: "Signup Successful",
        username: "Durga",
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-700 to-cyan-500 flex items-center justify-center px-4 py-8">

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

      {/* Signup Card */}

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
          Sign Up
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-200 mt-2 mb-8"
        >
          Create your account
        </motion.p>

        {/* Full Name */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-5"
        >
          <label className="block mb-2 text-white font-medium">
            Full Name
          </label>

          <div className="relative">
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </motion.div>

        {/* Email */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
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
          transition={{ delay: 0.65 }}
          className="mb-5"
        >
          <label className="block mb-2 text-white font-medium">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              type="button"
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

        {/* Confirm Password */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75 }}
          className="mb-8"
        >
          <label className="block mb-2 text-white font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="text-gray-500" />
              ) : (
                <Eye className="text-gray-500" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Sign Up Button */}

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={navigateLogic}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg"
        >
          Sign Up
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-200 mt-6"
        >
          Already have an account?

          <span
            onClick={() => navigate("/login")}
            className="text-white font-semibold ml-2 cursor-pointer hover:underline"
          >
            Log In
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Signup;
