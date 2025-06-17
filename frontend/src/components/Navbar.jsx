import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleSettings = () => {
    // Placeholder for settings functionality
    console.log("Settings clicked");
    setIsOpen(false);
  };

  const handleProfile = () => {

    // Placeholder for profile functionality
    navigate("/profile");
    console.log("Profile clicked");
    setIsOpen(false);
  };

  const isAuthenticated = !!authUser;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`nexchat-navbar ${scrolled ? "nexchat-navbar-scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="nexchat-navbar-container">
        {/* Logo */}
        <motion.div
          className="nexchat-logo-container"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="nexchat-logo-icon">
            <div className="nexchat-logo-glow" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="nexchat-logo-icon-inner"
              aria-hidden="true"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
            </svg>
          </div>
        </motion.div>

        {/* User Actions */}
        <div className="nexchat-user-actions">
          {isAuthenticated ? (
            <motion.div
              className="nexchat-user-profile"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className="nexchat-settings-button"
                onClick={handleSettings}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings size={18} />
              </motion.button>

              <div
                className="nexchat-avatar"
                onClick={handleProfile}
              >
                {authUser?.fullName?.charAt(0) || <User size={18} />}
              </div>

              <motion.button
                className="nexchat-logout-button"
                onClick={handleLogout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LogOut size={18} />
              </motion.button>
            </motion.div>
          ) : (
            <>
              <motion.a
                href="/login"
                className="nexchat-login-button"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.a>
              <motion.a
                href="/signup"
                className="nexchat-signup-button"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.a>
            </>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className="nexchat-mobile-menu-button"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nexchat-mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="nexchat-mobile-nav-links">
              {isAuthenticated ? (
                <>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <button
                      className="nexchat-mobile-profile-button"
                      onClick={handleProfile}
                    >
                      <User size={16} className="nexchat-mr-2" />
                      Profile
                    </button>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <button
                      className="nexchat-mobile-settings-button"
                      onClick={handleSettings}
                    >
                      <Settings size={16} className="nexchat-mr-2" />
                      Settings
                    </button>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      className="nexchat-mobile-logout-button"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="nexchat-mr-2" />
                      Sign Out
                    </button>
                  </motion.li>
                </>
              ) : (
                <>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <a
                      href="/login"
                      className="nexchat-mobile-login-button"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </a>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <a
                      href="/signup"
                      className="nexchat-mobile-signup-button"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </a>
                  </motion.li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;