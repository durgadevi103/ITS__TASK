import React, { useState } from "react";
import { User, Mail, Eye, Lock, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_CREDENTIALS } from "../login/Login";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    // Field Validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const allUsers = [...DEFAULT_CREDENTIALS, ...storedUsers];

      const userExists = allUsers.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (userExists) {
        setError("An account with this email already exists. Please log in.");
        setIsLoading(false);
        return;
      }

      // Register new user
      const newUser = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        createdAt: new Date().toISOString()
      };

      storedUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(storedUsers));

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Account created successfully! Please log in with your credentials.",
            email: newUser.email,
          },
        });
      }, 1200);
    }, 500);
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
          y: -4,
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
          className="text-center text-gray-200 mt-2 mb-6"
        >
          Create your account
        </motion.p>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-5 bg-red-500/20 border border-red-400/50 rounded-xl p-3 flex items-center gap-2 text-red-100 text-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-5 bg-emerald-500/20 border border-emerald-400/50 rounded-xl p-3 flex items-center gap-2 text-emerald-100 text-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-4"
          >
            <label className="block mb-2 text-white font-medium">
              Full Name
            </label>

            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 text-gray-900 outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-4"
          >
            <label className="block mb-2 text-white font-medium">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 text-gray-900 outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
            className="mb-4"
          >
            <label className="block mb-2 text-white font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password (min 6 chars)"
                className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 text-gray-900 outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="text-gray-500 hover:text-gray-700" />
                ) : (
                  <Eye className="text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
            className="mb-6"
          >
            <label className="block mb-2 text-white font-medium">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-xl bg-white/80 py-3 pl-4 pr-12 text-gray-900 outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="text-gray-500 hover:text-gray-700" />
                ) : (
                  <Eye className="text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Sign Up Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-70 text-white py-3 rounded-xl font-semibold shadow-lg transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-200 mt-6 text-sm"
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

