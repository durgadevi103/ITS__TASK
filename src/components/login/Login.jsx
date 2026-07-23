import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// Default valid credentials for quick testing
export const DEFAULT_CREDENTIALS = [
  { email: "admin@example.com", password: "Adm1n@", fullName: "Admin User" },
  { email: "user@example.com", password: "User1#", fullName: "Demo User" }
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Not valid email");
      return false;
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
    if (p.length > 10) {
      setPasswordError("not allowed more than 10 characters");
      return false;
    }
    const hasLetter = /[a-zA-Z]/.test(p);
    const hasNumber = /[0-9]/.test(p);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(p);

    const missing = [];
    if (!hasLetter) missing.push("alphabet");
    if (!hasNumber) missing.push("number");
    if (!hasSpecial) missing.push("special character");

    if (missing.length > 0) {
      setPasswordError(`Required: ${missing.join(" & ")}`);
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    const isEmailValid = validateEmailField();
    const isPasswordValid = validatePasswordField();

    if (!isEmailValid || !isPasswordValid) {
      setError("Please fix the errors highlighted in red.");
      return;
    }

    const trimmedEmail = email.trim();
    setIsLoading(true);

    setTimeout(() => {
      // Retrieve registered users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const allUsers = [...DEFAULT_CREDENTIALS, ...storedUsers];

      // Validate credentials
      const user = allUsers.find(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase() && u.password === password
      );

      if (user) {
        setSuccess(`Welcome back, ${user.fullName || 'User'}! Login successful.`);
        setEmailError("");
        setPasswordError("");
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
        setError("Invalid email or password. Please check your credentials.");
        setEmailError("Not valid email or password");
        setPasswordError("Not valid email or password");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-y-auto bg-gradient-to-br from-blue-900 via-indigo-700 to-cyan-500 flex items-center justify-center px-3 sm:px-6 py-12 sm:py-16">

      {/* Top Left 'Back to Home' Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/30 transition text-xs sm:text-sm font-medium shadow-lg hover:scale-105 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </motion.button>

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
        className="absolute w-56 sm:w-72 h-56 sm:h-72 rounded-full bg-cyan-400 blur-3xl opacity-30 top-10 left-10"
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
        className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-blue-300 blur-3xl opacity-20 bottom-0 right-0"
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
        className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8 mt-8 sm:mt-0"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-center text-white"
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
            <span>admin@example.com / Adm1n@</span>
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
            <label className="block mb-2 text-white font-medium flex justify-between items-center">
              <span>Email Address</span>
              {emailError && (
                <span className="text-xs font-semibold text-red-300 bg-red-500/30 border border-red-400/50 rounded-md px-2 py-0.5 animate-pulse">
                  {emailError}
                </span>
              )}
            </label>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                  if (emailError) {
                    const val = e.target.value.trim();
                    const hasUppercase = /[A-Z]/.test(val);
                    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
                    if (!hasUppercase && regex.test(val)) {
                      setEmailError("");
                    } else if (!hasUppercase && emailError === "Uppercase letters are not allowed") {
                      setEmailError("");
                    }
                  }
                }}
                onBlur={() => {
                  if (email.trim()) {
                    validateEmailField(email);
                  }
                }}
                placeholder="e.g. user@example.com"
                className={`w-full rounded-xl py-3 pl-4 pr-12 text-gray-900 outline-none transition font-medium ${
                  emailError
                    ? "bg-red-100/95 border-2 border-red-500 text-red-900 placeholder-red-400 focus:ring-2 focus:ring-red-400"
                    : "bg-white/80 focus:ring-2 focus:ring-cyan-400"
                }`}
              />
              <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${emailError ? "text-red-500" : "text-gray-500"}`} />
            </div>

            {emailError && (
              <p className="mt-1.5 text-xs text-red-200 bg-red-950/60 border border-red-400/60 rounded-lg p-2 flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
          </motion.div>

          {/* Password with Live Character Count */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <label className="text-white font-medium">
                Password
              </label>
              <div className="flex items-center gap-2">
                {passwordError && (
                  <span className="text-xs font-semibold text-red-300 bg-red-500/30 border border-red-400/50 rounded-md px-2 py-0.5 animate-pulse">
                    {passwordError}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-md border ${
                  password.length === 10 && !passwordError
                    ? "bg-emerald-950/50 border-emerald-400/40 text-emerald-200"
                    : password.length > 10
                    ? "bg-red-950/60 border-red-400/60 text-red-300 font-bold"
                    : "bg-cyan-950/40 border-cyan-400/30 text-cyan-200"
                }`}>
                  {password.length}/10 chars
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onFocus={() => {
                  // Validate email as soon as user clicks password box!
                  validateEmailField();
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  if (error) setError("");
                  if (val.length > 10) {
                    setPasswordError("not allowed more than 10 characters");
                  } else {
                    validatePasswordField(val);
                  }
                }}
                onBlur={() => {
                  if (password) validatePasswordField();
                }}
                placeholder="Password (max 10 chars: A-Z, 0-9, @#$)"
                className={`w-full rounded-xl py-3 pl-4 pr-12 text-gray-900 outline-none transition font-medium ${
                  passwordError
                    ? "bg-red-100/95 border-2 border-red-500 text-red-900 placeholder-red-400 focus:ring-2 focus:ring-red-400"
                    : "bg-white/80 focus:ring-2 focus:ring-cyan-400"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className={passwordError ? "text-red-500" : "text-gray-500"} />
                ) : (
                  <Eye className={passwordError ? "text-red-500" : "text-gray-500"} />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="mt-1.5 text-xs text-red-200 bg-red-950/60 border border-red-400/60 rounded-lg p-2 flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{passwordError}</span>
              </p>
            )}
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


