// ProfilePage.jsx
import React, { useState } from "react";
import { Camera, User, Mail, Calendar, ShieldCheck, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import "./Profile.css";
import { motion, AnimatePresence } from "framer-motion";


const Profile = () => {
  const { authUser, logout, updateProfile } = useAuthStore();
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true); // Show shimmer

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      try {
        setSelectedImg(base64Image); // Show new image immediately
        await updateProfile({ profilePic: base64Image });
      } catch (err) {
        // Optionally show error to user
        alert("Failed to upload image.");
      }
      setIsLoading(false); // Hide shimmer
    };

    reader.onerror = () => {
      setIsLoading(false);
      alert("Failed to read image file.");
    };
  };

  const profileData = {
    fullName: authUser?.fullName || "User Name",
    email: authUser?.email || "user@example.com",
    memberSince: authUser?.createdAt?.split("T")[0] || "2023-01-01",
    accountStatus: "Active",
  };

  return (
    <div className="profile-container">
      {/* Background elements - same as signup page */}
      <div className="background-animation">
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

      {/* Profile card */}
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Neon border effect */}
        <div className="neon-border-top" />
        <div className="neon-border-side" />

        {/* Header with app logo */}
        <div className="profile-header">
          <motion.div
            className="logo-icon"
            whileHover={{ rotate: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="logo-glow" />
            <div className="logo-icon-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              </svg>
            </div>
          </motion.div>
          <h1 className="app-title">NexChat Profile</h1>
        </div>

        {/* Profile content */}
        <div className="profile-content">
          {/* Left column - Profile picture */}
          <div className="profile-picture-section">
            <div
              className="avatar-container"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="avatar-glow" />
              {selectedImg ? (
                <img
                  src={selectedImg}
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  <User size={48} />
                </div>
              )}

              {/* Loading shimmer effect */}
              {isLoading && (
                <motion.div
                  className="avatar-shimmer"
                  animate={{
                    backgroundPosition: ['-100% 0', '100% 0']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              )}

              {/* Camera overlay */}
              <AnimatePresence>
                {isHovering && (
                  <motion.label
                    className="camera-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden-upload"
                    />
                  </motion.label>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              className="settings-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={18} className="mr-2" />
              Account Settings
            </motion.button>
          </div>

          {/* Right column - User info */}
          <div className="profile-info-section">
            {/* User information */}
            <div className="info-card">
              <h2 className="section-title">
                <User size={20} className="mr-2" />
                Personal Information
              </h2>

              <div className="info-group">
                <label className="info-label">Full Name</label>
                <div className="info-value-container">
                  <input
                    type="text"
                    value={profileData.fullName}
                    readOnly
                    className="info-value"
                  />
                  <div className="info-glow" />
                </div>
              </div>

              <div className="info-group">
                <label className="info-label">Email Address</label>
                <div className="info-value-container">
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="info-value"
                  />
                  <div className="info-glow" />
                </div>
              </div>
            </div>

            {/* Account information */}
            <div className="info-card">
              <h2 className="section-title">
                <ShieldCheck size={20} className="mr-2" />
                Account Information
              </h2>

              <div className="info-group">
                <label className="info-label">Member Since</label>
                <div className="info-value-container">
                  <div className="info-value-icon">
                    <Calendar size={16} className="mr-2" />
                    {profileData.memberSince}
                  </div>
                  <div className="info-glow" />
                </div>
              </div>

              <div className="info-group">
                <label className="info-label">Account Status</label>
                <div className="info-value-container">
                  <div className="status-badge">
                    {profileData.accountStatus}
                  </div>
                  <div className="info-glow" />
                </div>
              </div>
            </div>

            {/* Logout button */}
            <motion.button
              className="logout-button"
              onClick={logout}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;