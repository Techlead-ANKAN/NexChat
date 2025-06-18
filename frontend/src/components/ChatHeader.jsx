import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import "./ChatHeader.css";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser?._id);

  return (
    <motion.div 
      className="chat-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div className="header-glow" />
      
      {/* User info */}
      <div className="user-info-container">
        <div className="avatar-container">
          <div className={`avatar-glow ${isOnline ? "online" : "offline"}`} />
          <div className="user-avatar">
            {selectedUser?.profilePic ? (
              <img 
                src={selectedUser.profilePic} 
                alt={selectedUser.fullName} 
                className="avatar-image"
              />
            ) : (
              <div className="avatar-initial">
                {selectedUser?.fullName?.charAt(0)}
              </div>
            )}
          </div>
          {isOnline && <div className="online-pulse" />}
        </div>
        
        <div className="user-details">
          <h3 className="user-name">{selectedUser?.fullName}</h3>
          <div className="user-status">
            <span className={`status-indicator ${isOnline ? "online" : "offline"}`} />
            <span>{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      
      {/* Close button */}
      <motion.button
        className="close-button"
        onClick={() => setSelectedUser(null)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="close-icon" />
      </motion.button>
    </motion.div>
  );
};

export default ChatHeader;