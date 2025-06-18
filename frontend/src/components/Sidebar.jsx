// A
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  LogOut,
  Settings,
  Plus,
  Menu,
  X,
  Circle,
  CircleDot,
  Loader,
  MessageSquare
} from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import "./Sidebar.css";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    searchQuery,
    setSearchQuery
  } = useChatStore();

  const { authUser, onlineUsers = [], logout } = useAuthStore();

  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnline = !showOnlineOnly || onlineUsers.includes(user._id);
    return matchesSearch && matchesOnline;
  });

  const closeSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <>
      {isMobile && (
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
      )}

      <AnimatePresence>
        {(mobileOpen || !isMobile) && (
          <motion.div
            className={`nexchat-sidebar ${mobileOpen ? 'mobile-open' : ''} ${isClosing ? 'closing' : ''}`}
            initial={isMobile ? { x: -300 } : false}
            animate={isMobile ? { x: 0 } : false}
            exit={isMobile ? { x: -300 } : false}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isMobile && (
              <button
                className="mobile-close"
                onClick={closeSidebar}
              >
                <X size={24} />
              </button>
            )}

            <div className="sidebar-header">
              <div className="logo-container">
                <div className="logo-glow"></div>
                <div className="logo-icon">
                  <MessageSquare size={28} />
                </div>
                <div className="app-name">NexChat</div>
              </div>
            </div>

            <div className="search-filter-container">
              <div className="search-bar">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="search-glow"></div>
              </div>

              <button
                className={`online-filter ${showOnlineOnly ? 'active' : ''}`}
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              >
                {showOnlineOnly && <div className="active-indicator"></div>}
                <CircleDot className="filter-icon" size={16} />
                <span>Online Only</span>
              </button>
            </div>

            <div className="contacts-container">
              <div className="contacts-header">
                <User className="contacts-icon" size={18} />
                <span>Contacts</span>
                <div className="count-badge">{filteredUsers.length}</div>
              </div>

              <div className="contacts-list">
                {isUsersLoading ? (
                  <div className="loading-contacts">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="contact-skeleton">
                        <div className="avatar-skeleton"></div>
                        <div className="info-skeleton">
                          <div className="name-skeleton"></div>
                          <div className="status-skeleton"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="no-contacts">
                    <div className="empty-icon">
                      <div className="empty-line"></div>
                      <div className="empty-line vertical"></div>
                    </div>
                    <p>No contacts found</p>
                  </div>
                ) : (
                  filteredUsers.map(user => {
                    const isOnline = onlineUsers.includes(user._id);
                    return (
                      <motion.div
                        key={user._id}
                        className={`contact-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                        onClick={() => handleSelectUser(user)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="avatar-container">
                          <div className="avatar-glow"></div>
                          <div className="user-avatar">
                            {user.profilePic ? (
                              <img
                                src={user.profilePic}
                                alt={user.fullName}
                                className="avatar-image"
                              />
                            ) : (
                              <div className="avatar-initial">
                                {user.fullName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          {isOnline && <div className="online-indicator"></div>}
                        </div>

                        <div className="user-info">
                          <div className="user-name">{user.fullName}</div>
                          <div className="user-status">
                            {isOnline ? 'Online' : 'Offline'}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="user-footer">
              <div className="user-profile">
                <div className="avatar-container">
                  <div className="avatar-glow"></div>
                  <div className="user-avatar">
                    {authUser.profilePic ? (
                      <img
                        src={authUser.profilePic}
                        alt={authUser.fullName}
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-initial">
                        {authUser.fullName?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="user-details">
                  <div className="user-name">{authUser.fullName}</div>
                  <div className="user-email">{authUser.email}</div>
                </div>
              </div>

              <div className="user-actions">
                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Settings"
                >
                  <Settings size={18} />
                </motion.button>

                <motion.button
                  className="action-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Logout"
                  onClick={logout}
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
