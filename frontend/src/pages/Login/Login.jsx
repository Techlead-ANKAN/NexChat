import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import "./Login.css";
import {useAuthStore} from "../../store/useAuthStore.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {login} = useAuthStore();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    const result = await login(formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  return (
    <div className="login-container">
      {/* Animated background elements */}
      <div className="background-animation">
        {/* Neon glowing orbs */}
        <motion.div
          className="orb orb-sky"
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="orb orb-emerald"
          animate={{
            x: [0, -120, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="orb orb-pink"
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Animated grid pattern */}
        <div className="grid-pattern">
          <motion.div
            className="grid-inner"
            animate={{
              backgroundPosition: ["0px 0px", "50px 50px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Floating geometric shapes */}
        <motion.div
          className="shape diamond"
          animate={{
            y: [0, -20, 0],
            rotate: [45, 225, 45],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="shape circle"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="login-content">
        {/* Left side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="form-container"
        >
          <div className="form-card">
            {/* Neon border glow effect */}
            <div className="neon-border-top" />
            <div className="neon-border-side" />

            <div className="form-content">
              <div className="form-header">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="logo-icon"
                >
                  <div className="logo-glow" />
                  <MessageCircle className="logo-icon-inner" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="app-title"
                >
                  NexChat
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="app-subtitle"
                >
                  Enter the future of communication
                </motion.p>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onSubmit={handleSubmit}
                className="login-form"
              >
                {/* Email Field */}
                <div className="form-field">
                  <label htmlFor="email" className="input-label">
                    <Mail className="label-icon" />
                    Email Address
                  </label>
                  <div className="input-container">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`form-input ${errors.email ? "input-error" : ""}`}
                      required
                    />
                    <AnimatePresence>
                      {formData.email && !errors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          className="input-success"
                        >
                          <CheckCircle2 className="success-icon" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="error-message"
                      >
                        <AlertCircle className="error-icon" />
                        {errors.email}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div className="form-field">
                  <label htmlFor="password" className="input-label">
                    <Lock className="label-icon" />
                    Password
                  </label>
                  <div className="input-container">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`form-input ${errors.password ? "input-error" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {errors.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="error-message"
                      >
                        <AlertCircle className="error-icon" />
                        {errors.password}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-700 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>
                  <a href="/forgot-password" className="text-sm text-sky-400 hover:text-sky-300">
                    Forgot password?
                  </a>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="submit-container">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="submit-button"
                  >
                    <div className="button-glow" />
                    {isLoading ? (
                      <div className="loading-indicator">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="loading-spinner"
                        />
                        Signing In...
                      </div>
                    ) : (
                      <span className="button-text">Sign In</span>
                    )}
                  </button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="login-link-container"
              >
                <p className="login-text">
                  Don't have an account?{" "}
                  <a href="/signup" className="login-link">
                    Sign up
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Animated illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="illustration-container"
        >
          <div className="illustration">
            {/* Central hub */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="central-hub"
            >
              <div className="hub-glow" />
              <div className="hub-inner">
                <MessageCircle className="hub-icon" />
              </div>
            </motion.div>

            {/* Floating chat cards */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="chat-card chat-card-sky"
            >
              <div className="chat-header">
                <div className="avatar avatar-sky" />
                <div className="avatar-placeholder" />
              </div>
              <div className="chat-content">
                <div className="chat-line" />
                <div className="chat-line chat-line-short" />
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -3, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              className="chat-card chat-card-emerald"
            >
              <div className="chat-header">
                <div className="avatar avatar-emerald" />
                <div className="avatar-placeholder" />
              </div>
              <div className="chat-content">
                <div className="chat-line" />
                <div className="chat-line chat-line-medium" />
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 2,
              }}
              className="chat-card chat-card-pink"
            >
              <div className="chat-header">
                <div className="avatar avatar-pink" />
                <div className="avatar-placeholder" />
              </div>
              <div className="chat-content">
                <div className="chat-line" />
                <div className="chat-line chat-line-long" />
                <div className="chat-line chat-line-short" />
              </div>
            </motion.div>

            {/* Connection lines */}
            <svg className="connection-lines" style={{ zIndex: -1 }}>
              <motion.path
                d="M200 150 L300 300"
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,4"
                animate={{
                  strokeDashoffset: [0, -12],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.path
                d="M350 180 L300 300"
                stroke="url(#gradient2)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,4"
                animate={{
                  strokeDashoffset: [0, -12],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5,
                }}
              />
              <motion.path
                d="M220 450 L300 300"
                stroke="url(#gradient3)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="8,4"
                animate={{
                  strokeDashoffset: [0, -12],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1,
                }}
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;