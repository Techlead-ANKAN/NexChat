import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import "./NoChatSelected.css";

const NoChatSelected = () => {
  return (
    <motion.div
      className="no-chat-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="background-elements">
        <motion.div
          className="floating-orb orb-sky"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="floating-orb orb-emerald"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="floating-orb orb-pink"
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />

        {/* Grid pattern */}
        <div className="grid-pattern" />
      </div>

      {/* Main content */}
      <motion.div
        className="no-chat-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Icon with animated glow */}
        <motion.div
          className="icon-container"
          animate={{
            rotate: [0, 10, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="icon-glow" />
          <MessageCircle className="chat-icon" />
        </motion.div>

        {/* Text content */}
        <motion.div
          className="text-content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="title">
            Welcome to <span>NexChat</span>
          </h2>
          <p className="description">
            Select a conversation to start messaging, or create a new one to begin your journey
          </p>
        </motion.div>

        {/* Animated call to action */}
        <motion.div
          className="cta-container"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="cta-glow" />
          <button className="cta-button">
            Start New Conversation
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NoChatSelected;