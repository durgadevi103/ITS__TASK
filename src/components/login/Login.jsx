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
    <div className="w-full h-screen min-h-screen bg-[#0e3cc9] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans relative overflow-hidden">
      
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
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/30 blur-[120px] pointer-events-none"
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
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none"
      />

      {/* Main card */}
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl h-full md:h-[580px] bg-white rounded-[32px] md:rounded-[40px] shadow-2xl p-3 md:p-4 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10"
      >
        
        {/* Left Pane (Form) */}
        <div className="w-full md:w-1/2 flex flex-col justify-between items-center h-full py-2 px-1 sm:px-4 md:px-6 overflow-y-auto scrollbar-none">
          
          {/* Top Header/Nav */}
          <motion.div variants={itemVariants} className="w-full flex justify-start items-center mb-2">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1 bg-transparent border-none text-gray-400 hover:text-gray-600 transition text-xs font-semibold cursor-pointer"
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
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#0e3cc9] to-[#6019b8] text-white text-xs font-black tracking-widest px-4 py-1.5 rounded-2xl select-none uppercase shadow-xl shadow-blue-600/15 cursor-pointer overflow-hidden mb-2"
              >
                <motion.span layout="position">EMS</motion.span>
                <AnimatePresence>
                  {isHoveredLogo && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: "auto", marginLeft: 6 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="whitespace-nowrap text-[9.5px] font-extrabold tracking-wider text-cyan-200 lowercase first-letter:uppercase"
                    >
                      Employee System
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-0.5 w-full">Welcome home</h1>
              <p className="text-gray-400 text-[11px] font-semibold w-full">Please enter your credentials below.</p>
            </div>

            {/* Demo Credentials Alert / Shortcut */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -1, shadow: "0 6px 15px rgba(0,0,0,0.05)" }}
              className="mb-3 bg-slate-50 border border-slate-150 rounded-2xl p-2.5 text-[10px] text-slate-650 flex items-center justify-between gap-2 shadow-sm"
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
                className="flex items-center gap-1 bg-[#0e3cc9] hover:bg-[#0b30a1] text-white font-bold px-2 py-1 rounded-xl transition text-[9px] whitespace-nowrap shadow shadow-blue-500/10 cursor-pointer"
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
                    className={`w-full rounded-full py-2.5 pl-5 pr-11 text-xs text-gray-900 outline-none border transition font-bold bg-white ${
                      emailError
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#0e3cc9] focus:ring-1 focus:ring-[#0e3cc9] group-hover:border-slate-350"
                    }`}
                  />
                  <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 transition-transform duration-200 group-focus-within:scale-110 ${emailError ? "text-red-500" : "text-gray-400 group-focus-within:text-[#0e3cc9]"}`} />
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
                    className={`w-full rounded-full py-2.5 pl-5 pr-11 text-xs text-gray-900 outline-none border transition font-bold bg-white ${
                      passwordError
                        ? "border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-200 focus:border-[#0e3cc9] focus:ring-1 focus:ring-[#0e3cc9] group-hover:border-slate-350"
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
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#0e3cc9] focus:ring-[#0e3cc9] cursor-pointer"
                  />
                  <span>Remember for 30 days</span>
                </label>
                <button
                  type="button"
                  className="bg-transparent border-none hover:underline cursor-pointer text-gray-400"
                >
                  Forgot password?
                </button>
              </motion.div>

              {/* Login Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.015, boxShadow: "0 8px 20px -3px rgba(14, 60, 201, 0.25)" }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0e3cc9] hover:bg-[#0b30a1] disabled:opacity-75 text-white py-2.5 rounded-full font-black transition duration-250 flex items-center justify-center gap-2 cursor-pointer text-xs mb-3"
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
                className="text-[#0e3cc9] font-black cursor-pointer hover:underline"
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
          <div className="w-full h-full bg-gradient-to-br from-[#2f19cf] via-[#1030b4] to-[#6019b8] relative overflow-hidden rounded-[24px] md:rounded-[30px] flex items-center justify-center">
            
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
              className="absolute top-[-10%] right-[-10%] w-[320px] h-[320px] rounded-full bg-indigo-500/35 blur-[60px] pointer-events-none"
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
              className="absolute bottom-[-15%] left-[-10%] w-[380px] h-[380px] rounded-full bg-cyan-400/25 blur-[80px] pointer-events-none"
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
              className="absolute top-[25%] left-[20%] w-[200px] h-[200px] rounded-full bg-purple-500/30 blur-[50px] pointer-events-none"
            />

            {/* Central Floating Branding Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -10, 0]
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 }
              }}
              className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center relative z-20"
            >
              <Sparkles className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
