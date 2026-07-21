import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// Default valid credentials for quick testing
export const DEFAULT_CREDENTIALS = [
  { email: "admin@example.com", password: "password123", fullName: "Admin User" },
  { email: "user@example.com", password: "123456", fullName: "Demo User" }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location.state]);

  const fillDemoCredentials = () => {
    setEmail(DEFAULT_CREDENTIALS[0].email);
    setPassword(DEFAULT_CREDENTIALS[0].password);
    setError("");
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    // Form Validations
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
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Retrieve registered users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const allUsers = [...DEFAULT_CREDENTIALS, ...storedUsers];

      // Validate credentials
      const user = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (user) {
        setSuccess(`Welcome back, ${user.fullName || 'User'}! Login successful.`);
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          fullName: user.fullName || 'User',
          loginTime: new Date().toISOString()
        }));

        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setError("Invalid email or password. Please try again or sign up.");
        setIsLoading(false);
      }
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
          Login
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-200 mt-2 mb-6"
        >
          Welcome Back
        </motion.p>

        {/* Demo Credentials Alert / Shortcut */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6 bg-cyan-950/40 border border-cyan-400/40 rounded-xl p-3 text-xs text-cyan-100 flex items-center justify-between gap-2"
        >
          <div>
            <span className="font-semibold text-cyan-300 block">Valid Demo Credentials:</span>
            <span>admin@example.com / password123</span>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-white font-medium px-2.5 py-1.5 rounded-lg transition text-xs whitespace-nowrap shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto Fill
          </button>
        </motion.div>

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

        <form onSubmit={handleLogin}>
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
            transition={{ delay: 0.6 }}
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
                placeholder="Enter password"
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

          <div className="text-right mb-6">
            <button type="button" className="text-cyan-200 hover:text-white text-sm transition">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
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
              "Login"
            )}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-200 mt-6 text-sm"
        >
          Don't have an account?
          <span
            onClick={() => navigate("/signup")}
            className="text-white font-semibold ml-2 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;

