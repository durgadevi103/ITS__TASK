import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import api from '../../api/axios.js';

// Default valid credentials for quick testing
// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_CREDENTIALS = [
  { email: "admin@example.com", password: "Admin12@", fullName: "Admin User" },
  { email: "user@example.com", password: "Demo123#", fullName: "Demo User" }
];

const EMSIllustration = () => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square flex items-center justify-center select-none">
      {/* Central glow ring */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-48 h-48 rounded-full bg-emerald-500/10 blur-xl"
      />

      {/* SVG Org Chart Network Lines */}
      <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection from Center Admin to Top Left HR */}
        <motion.path
          d="M100 100 L45 50"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ ease: "linear", duration: 3, repeat: Infinity }}
        />
        {/* Connection from Center Admin to Top Right Tech */}
        <motion.path
          d="M100 100 L155 50"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, 16] }}
          transition={{ ease: "linear", duration: 3, repeat: Infinity }}
        />
        {/* Connection from Center Admin to Bottom Support */}
        <motion.path
          d="M100 100 L100 160"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -16] }}
          transition={{ ease: "linear", duration: 3, repeat: Infinity }}
        />
      </svg>

      {/* Node 1: Central Admin */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 1, -1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute z-20 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-xl flex flex-col items-center justify-center p-1"
      >
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2b589f] via-[#108985] to-[#119e73] flex items-center justify-center text-white shadow-md">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <span className="text-[9px] font-black text-white mt-1 uppercase tracking-wider">HQ</span>
      </motion.div>

      {/* Node 2: HR (Top Left) */}
      <motion.div
        animate={{
          y: [0, 6, 0],
          x: [0, -3, 0]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute top-[18px] left-[15px] z-20 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg flex flex-col items-center justify-center"
      >
        <div className="w-7 h-7 rounded-lg bg-slate-850 flex items-center justify-center text-[#4ade80]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <span className="text-[8px] font-bold text-slate-200 mt-0.5">HR</span>
      </motion.div>

      {/* Node 3: Tech/Engineering (Top Right) */}
      <motion.div
        animate={{
          y: [0, 7, 0],
          x: [0, 3, 0]
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
        className="absolute top-[18px] right-[15px] z-20 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg flex flex-col items-center justify-center"
      >
        <div className="w-7 h-7 rounded-lg bg-slate-850 flex items-center justify-center text-sky-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <span className="text-[8px] font-bold text-slate-200 mt-0.5">Dev</span>
      </motion.div>

      {/* Node 4: Support/Tasks (Bottom Center) */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0, -2, 2, 0]
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
        className="absolute bottom-[10px] z-20 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg flex flex-col items-center justify-center"
      >
        <div className="w-7 h-7 rounded-lg bg-slate-855 flex items-center justify-center text-amber-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <span className="text-[8px] font-bold text-slate-200 mt-0.5">Tasks</span>
      </motion.div>

      {/* Floating Card 1: Active Employees Status (Left overlapping) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -6, 0]
        }}
        transition={{
          opacity: { duration: 0.6 },
          x: { duration: 0.6 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute left-[-25px] top-[90px] z-30 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-lg flex items-center gap-2 select-none"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="leading-none text-left">
          <span className="text-[8px] font-extrabold text-white opacity-85 block uppercase tracking-wider">Active Staff</span>
          <span className="text-xs font-black text-white">142</span>
        </div>
      </motion.div>

      {/* Floating Card 2: Performance Graph (Right overlapping) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, 6, 0]
        }}
        transition={{
          opacity: { duration: 0.6 },
          x: { duration: 0.6 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }
        }}
        className="absolute right-[-25px] bottom-[40px] z-30 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-lg flex flex-col gap-1 select-none w-28 text-left"
      >
        <div className="flex items-center justify-between">
          <span className="text-[7.5px] font-extrabold text-white opacity-85 uppercase tracking-wider">Performance</span>
          <span className="text-[8px] font-black text-emerald-400">+12%</span>
        </div>

        {/* Drawing SVG Chart */}
        <div className="h-6 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 80 20">
            {/* Draw Path */}
            <motion.path
              d="M0 18 Q15 6 30 14 T60 2 T80 8"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "loop",
                repeatDelay: 0.8
              }}
            />
            {/* Ambient Area Gradient under path */}
            <path
              d="M0 18 Q15 6 30 14 T60 2 T80 8 L80 20 L0 20 Z"
              fill="url(#grad)"
              opacity="0.15"
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(() => location.state?.message || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isHoveredLogo, setIsHoveredLogo] = useState(false);

  const fillDemoCredentials = () => {
    setEmail(DEFAULT_CREDENTIALS[0].email);
    setPassword(DEFAULT_CREDENTIALS[0].password);
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  const validateEmailField = (val) => {
    const trimmed = (val !== undefined ? val : email).trim();
    if (!trimmed) {
      setEmailError("Not valid email");
      return false;
    }
    if (/[A-Z]/.test(trimmed)) {
      setEmailError("Uppercase letters are not allowed");
      return false;
    }
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.com$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Not valid email");
      return false;
    }

    // Prevent multiple ".com" segments (e.g. user@example.com.com)
    const comCount = (trimmed.match(/\.com/g) || []).length;
    if (comCount > 1) {
      setEmailError("Not valid email");
      return false;
    }

    // Ensure no intermediate domain labels are "com"
    const parts = trimmed.split('@');
    if (parts.length === 2) {
      const domain = parts[1];
      const domainParts = domain.split('.');
      for (let i = 0; i < domainParts.length - 1; i++) {
        if (domainParts[i] === 'com') {
          setEmailError("Not valid email");
          return false;
        }
      }
    }

    setEmailError("");
    return true;
  };

  const validatePasswordField = (val) => {
    const p = val !== undefined ? val : password;
    if (!p) {
      setPasswordError("Password is required");
      return false;
    }
    if (p.length !== 8) {
      setPasswordError("Password must be exactly 8 characters");
      return false;
    }
    const letters = p.replace(/[^a-zA-Z]/g, "").length;
    const numbers = p.replace(/[^0-9]/g, "").length;
    const specials = p.replace(/[a-zA-Z0-9]/g, "").length;

    if (letters === 0) {
      setPasswordError("Password must contain letters");
      return false;
    }
    if (numbers === 0) {
      setPasswordError("Password must contain numbers");
      return false;
    }
    if (specials !== 1) {
      setPasswordError("Password must contain exactly one special character");
      return false;
    }
    if (letters + numbers + specials !== p.length) {
      setPasswordError("Password can only contain letters, numbers, and one special character");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleLoginBackend = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");
    setPasswordError("");

    const isEmailValid = validateEmailField();
    const isPasswordValid = validatePasswordField();

    if (!isEmailValid || !isPasswordValid) {
      setError("Please fix the errors highlighted in red.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email: email.trim(), pass: password });
      const data = response.data;

      if (data.success === true) {
        setSuccess(data.message || "Login successful.");
        if (onLoginSuccess) {
          const userObj = {
            email: email.trim(),
            username: data.user?.username || email.trim().split('@')[0]
          };
          onLoginSuccess(userObj);
          sessionStorage.setItem('currentUser', JSON.stringify(userObj));
        }
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setError("account not valid");
        setEmailError("account not valid");
        setPasswordError("account not valid");
      }
    } catch {
      setError("Network error. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 25 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 24,
        stiffness: 140,
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 160 }
    }
  };

  return (
    <div className="w-full h-screen min-h-screen bg-gradient-to-tr from-[#2b589f] via-[#108985] to-[#119e73] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden">

      {/* Repeating Company Logo Watermark Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none select-none"
        style={{
          backgroundImage: "url('/company%20logo.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Outer Floating Background Spheres */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[120px] pointer-events-none"
      />

      {/* Main card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl h-full md:h-[580px] bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-3 md:p-4 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10"
      >

        {/* Left Pane (Form) */}
        <div className="w-full md:w-1/2 flex flex-col justify-between items-center h-full py-2 px-1 sm:px-4 md:px-6 overflow-y-auto scrollbar-none">

          {/* Top Header/Nav */}
          <motion.div variants={itemVariants} className="w-full flex justify-start items-center mb-2">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1 bg-transparent border-none text-gray-400 hover:text-gray-650 transition text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to dashboard</span>
            </motion.button>
          </motion.div>

          {/* Form Container */}
          <div className="w-full max-w-[340px] my-auto">

            {/* Logo and Titles */}
            <div className="text-center mb-4 flex flex-col items-center">
              <motion.div
                onMouseEnter={() => setIsHoveredLogo(true)}
                onMouseLeave={() => setIsHoveredLogo(false)}
                layout
                animate={{
                  scale: isHoveredLogo ? 1.08 : [1, 1.04, 1],
                  rotate: isHoveredLogo ? 0 : [0, 1, -1, 0]
                }}
                transition={{
                  scale: { duration: 0.2 },
                  rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#2b589f] via-[#108985] to-[#119e73] text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-2xl select-none uppercase shadow-xl shadow-slate-900/15 cursor-pointer overflow-hidden mb-2"
              >
                <motion.span layout="position">EMS</motion.span>
                <AnimatePresence>
                  {isHoveredLogo && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 6 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="whitespace-nowrap text-[9.5px] font-extrabold tracking-wider text-emerald-250 lowercase first-letter:uppercase"
                    >
                      Employee System
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <h1 className="text-2xl font-black text-[#2b589f] tracking-tight mb-0.5 w-full">Welcome home</h1>
              <p className="text-gray-400 text-[11px] font-semibold w-full">Please enter your credentials below.</p>
            </div>

            {/* Demo Credentials Alert / Shortcut */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -1, shadow: "0 6px 15px rgba(0,0,0,0.05)" }}
              className="mb-3 bg-white/50 border border-white/60 rounded-2xl p-2.5 text-[10px] text-slate-650 flex items-center justify-between gap-2 shadow-sm backdrop-blur-sm"
            >
              <div className="leading-tight">
                <span className="font-bold text-slate-800 block mb-0.5">Demo Credentials:</span>
                <span className="text-slate-450 font-medium">admin@example.com / Admin12@</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={fillDemoCredentials}
                className="flex items-center gap-1 bg-gradient-to-r from-[#2b589f] via-[#108985] to-[#119e73] hover:opacity-90 text-white font-bold px-2 py-1 rounded-xl transition text-[9px] whitespace-nowrap shadow shadow-slate-900/10 cursor-pointer border-none"
              >
                <Sparkles className="w-2.5 h-2.5" />
                Auto Fill
              </motion.button>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-3 bg-red-50 border border-red-200 rounded-xl p-2 flex items-center gap-2 text-red-700 text-[11px] font-bold"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-3 bg-emerald-50 border border-emerald-200 rounded-xl p-2 flex items-center gap-2 text-emerald-700 text-[11px] font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLoginBackend}>
              {/* Email */}
              <motion.div variants={itemVariants} className="mb-3">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      if (error) setError("");

                      const trimmedVal = val.trim();
                      const firstComIndex = trimmedVal.indexOf('.com');
                      if (firstComIndex !== -1) {
                        const afterCom = trimmedVal.substring(firstComIndex + 4);
                        if (afterCom.length > 0) {
                          setEmailError("Not valid email");
                        } else {
                          setEmailError("");
                        }
                      } else {
                        setEmailError("");
                      }
                    }}
                    placeholder="Email"
                    className={`w-full rounded-full py-2.5 pl-5 pr-11 text-xs text-gray-900 outline-none border transition font-bold bg-white ${emailError
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#108985] focus:ring-1 focus:ring-[#108985] group-hover:border-slate-300"
                      }`}
                  />
                  <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 transition-transform duration-200 group-focus-within:scale-110 ${emailError ? "text-red-500" : "text-gray-400 group-focus-within:text-[#2b589f]"}`} />
                </div>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-1 pl-3 text-[9.5px] text-red-500 font-bold flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{emailError}</span>
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="mb-3">
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                      setPasswordError("");
                    }}
                    placeholder="Password"
                    className={`w-full rounded-full py-2.5 pl-5 pr-11 text-xs text-gray-900 outline-none border transition font-bold bg-white ${passwordError
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#108985] focus:ring-1 focus:ring-[#108985] group-hover:border-slate-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 hover:text-gray-650 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-1 pl-3 text-[9.5px] text-red-500 font-bold flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>{passwordError}</span>
                  </motion.p>
                )}
              </motion.div>

              {/* Checkbox and Forgot Password */}
              <motion.div variants={itemVariants} className="flex items-center justify-between text-[11px] text-gray-400 mb-4.5 px-1 font-semibold">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#156e49] focus:ring-[#156e49] cursor-pointer"
                  />
                  <span>Remember for 30 days</span>
                </label>
                <button
                  type="button"
                  className="bg-transparent border-none hover:underline cursor-pointer text-gray-400 hover:text-slate-655"
                >
                  Forgot password?
                </button>
              </motion.div>

              {/* Login Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.015, boxShadow: "0 8px 20px -3px rgba(43, 88, 159, 0.25)" }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#2b589f] via-[#108985] to-[#119e73] hover:opacity-90 disabled:opacity-75 text-white py-2.5 rounded-full font-black transition duration-250 flex items-center justify-center gap-2 cursor-pointer text-xs mb-3 border-none shadow"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>

            {/* Separator */}
            <motion.div variants={itemVariants} className="flex items-center justify-between gap-2 mb-3 px-1 select-none">
              <div className="h-[1px] bg-gray-100 flex-grow"></div>
              <span className="text-gray-400 text-[10px] font-bold">or</span>
              <div className="h-[1px] bg-gray-100 flex-grow"></div>
            </motion.div>

            {/* Social Logins */}
            <motion.div variants={itemVariants} className="flex justify-center gap-3.5 mb-3">
              <motion.button
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="border border-gray-200 w-9 h-9 rounded-full bg-transparent flex items-center justify-center cursor-pointer hover:bg-gray-50 transition duration-200"
              >
                <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.59 2.96-1.4z" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="border border-gray-200 w-9 h-9 rounded-full bg-transparent flex items-center justify-center cursor-pointer hover:bg-gray-50 transition duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.788-6.228-6.228 0-3.44 2.788-6.228 6.228-6.228 1.54 0 2.94.557 4.028 1.485l3.079-3.078C19.182 2.029 15.914 1 12.24 1 6.033 1 12.24s4.033 11.24 11.24 11.24c5.898 0 10.74-3.9 10.74-10.74 0-.66-.06-1.29-.18-1.9H12.24z"
                  />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="border border-gray-200 w-9 h-9 rounded-full bg-transparent flex items-center justify-center cursor-pointer hover:bg-gray-50 transition duration-200"
              >
                <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.button>
            </motion.div>

            {/* Redirection link */}
            <motion.div variants={itemVariants} className="text-center mt-3.5 text-[11px] text-gray-400 font-semibold">
              <span>Don't have an account? </span>
              <span
                onClick={() => navigate("/signup")}
                className="text-[#2b589f] font-black cursor-pointer hover:text-[#119e73] hover:underline"
              >
                Sign Up
              </span>
            </motion.div>
          </div>

          {/* Left footer */}
          <motion.div variants={itemVariants} className="w-full text-center mt-3">
            <p className="text-[9.5px] text-gray-400 font-semibold">
              © 2026 ITS. All Rights Reserved.
            </p>
          </motion.div>
        </div>
        {/* Right Pane (Branding Fluid Artwork with Parallax Overlay) */}
        <div className="hidden md:block w-1/2 h-full p-1.5">
          <div className="w-full h-full bg-gradient-to-br from-[#2b589f] via-[#108985] to-[#119e73] relative overflow-hidden rounded-[24px] md:rounded-[30px] flex items-center justify-center">

            {/* Background Image Layer */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay bg-cover bg-center transition-all duration-700 hover:scale-105"
              style={{ backgroundImage: "url('/ems_bg.png')" }}
            />

            {/* Spinning Tech Ring behind centered text */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full border-2 border-white/5 border-dashed pointer-events-none flex items-center justify-center z-10"
            >
              <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full border border-white/10 border-double"></div>
            </motion.div>

            {/* Centered Big Branding Text Overlay with High Motion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="z-30 text-center select-none px-6 flex flex-col items-center justify-center"
            >
              <motion.h1
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.06, 1],
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.2)",
                    "0 0 40px rgba(255,255,255,0.6)",
                    "0 0 20px rgba(255,255,255,0.2)"
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-5xl lg:text-7xl font-extrabold tracking-widest text-white uppercase drop-shadow-2xl font-sans"
              >
                ITS <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-sky-300 to-teal-300 drop-shadow-lg">EMS</span>
              </motion.h1>

              <motion.p
                animate={{
                  y: [0, 6, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="text-blue-100/90 text-xs md:text-sm font-black tracking-widest uppercase mt-4 max-w-[280px] md:max-w-md mx-auto leading-relaxed drop-shadow-md"
              >
                Employee Management System
              </motion.p>
            </motion.div>

            {/* Animating Glow Spheres */}
            <motion.div
              animate={{
                scale: [1, 1.15, 0.9, 1],
                x: [0, 20, -10, 0],
                y: [0, -15, 20, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[-10%] right-[-10%] w-[320px] h-[320px] rounded-full bg-white/10 blur-[60px] pointer-events-none"
            />
            <motion.div
              animate={{
                scale: [1, 0.9, 1.1, 1],
                x: [0, -15, 25, 0],
                y: [0, 20, -15, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-[-15%] left-[-10%] w-[380px] h-[380px] rounded-full bg-white/10 blur-[80px] pointer-events-none"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 0.85, 1],
                x: [0, 10, -15, 0],
                y: [0, 15, -10, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[25%] left-[20%] w-[200px] h-[200px] rounded-full bg-white/5 blur-[50px] pointer-events-none"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
