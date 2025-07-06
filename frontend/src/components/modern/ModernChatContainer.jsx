import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Info,
  Paperclip,
  Smile,
  Send,
  MessageCircle,
  Hash,
  Bell,
  Settings,
  Plus
} from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatMessageTime } from '../../lib/utils';
import './ModernChatContainer.css';

const ModernChatContainer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    getMessages,
    sendMessage,
    isMessagesLoading
  } = useChatStore();

  const { authUser, onlineUsers = [] } = useAuthStore();

  // Mock conversations for demo
  const conversations = users.map(user => ({
    id: user._id,
    user,
    lastMessage: "Hey there! How are you doing?",
    timestamp: "2m",
    unread: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
    isOnline: onlineUsers.includes(user._id)
  }));

  const filteredConversations = conversations.filter(conv =>
    conv.user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    try {
      await sendMessage({
        text: messageInput.trim(),
        image: null
      });
      setMessageInput('');
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const enrichedMessages = messages.map((message) => ({
    ...message,
    isOwnMessage: message.senderId === authUser._id,
    senderName: message.senderId === authUser._id 
      ? authUser.fullName 
      : selectedUser?.fullName,
    formattedTime: formatMessageTime(message.createdAt),
  }));

  return (
    <div className="modern-chat-container">
      {/* Minimal Sidebar */}
      <div className="minimal-sidebar">
        <div className="brand-logo">
          <div className="logo-icon">
            <MessageCircle size={24} />
          </div>
        </div>
        
        <nav className="navigation-icons">
          <button className="nav-icon active">
            <MessageCircle size={20} />
            <div className="active-indicator" />
          </button>
          <button className="nav-icon">
            <Hash size={20} />
          </button>
          <button className="nav-icon">
            <Bell size={20} />
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-icon">
            <Settings size={20} />
          </button>
          <div className="user-avatar-mini">
            {authUser?.profilePic ? (
              <img src={authUser.profilePic} alt="User" />
            ) : (
              <div className="avatar-placeholder">
                {authUser?.fullName?.charAt(0)}
              </div>
            )}
            <div className="status-indicator online" />
          </div>
        </div>
      </div>

      {/* Secondary Panel */}
      <div className="secondary-panel">
        <div className="panel-header">
          <h2 className="panel-title">Messages</h2>
          <button className="add-button">
            <Plus size={16} />
          </button>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="filter-button">
            <Filter size={16} />
          </button>
        </div>

        <div className="conversations-list">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              className={`conversation-card ${selectedUser?._id === conversation.id ? 'active' : ''}`}
              onClick={() => setSelectedUser(conversation.user)}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="conversation-avatar">
                {conversation.user.profilePic ? (
                  <img src={conversation.user.profilePic} alt={conversation.user.fullName} />
                ) : (
                  <div className="avatar-placeholder">
                    {conversation.user.fullName?.charAt(0)}
                  </div>
                )}
                {conversation.isOnline && <div className="online-dot" />}
              </div>
              
              <div className="conversation-content">
                <div className="conversation-header">
                  <span className="conversation-name">{conversation.user.fullName}</span>
                  <span className="conversation-time">{conversation.timestamp}</span>
                </div>
                <div className="conversation-preview">
                  <span className="preview-text">{conversation.lastMessage}</span>
                  {conversation.unread > 0 && (
                    <div className="unread-indicator">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat-area">
        {selectedUser ? (
          <>
            {/* Minimal Header */}
            <div className="chat-header">
              <div className="participant-info">
                <div className="participant-avatar">
                  {selectedUser.profilePic ? (
                    <img src={selectedUser.profilePic} alt={selectedUser.fullName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {selectedUser.fullName?.charAt(0)}
                    </div>
                  )}
                  {onlineUsers.includes(selectedUser._id) && <div className="online-dot" />}
                </div>
                <div className="participant-details">
                  <h3 className="participant-name">{selectedUser.fullName}</h3>
                  <span className="participant-status">
                    {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="action-icons">
                <button className="action-button">
                  <Phone size={18} />
                </button>
                <button className="action-button">
                  <Video size={18} />
                </button>
                <button className="action-button">
                  <Info size={18} />
                </button>
                <button className="action-button">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Message Container */}
            <div className="message-container">
              {isMessagesLoading ? (
                <div className="loading-messages">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="message-skeleton">
                      <div className="skeleton-avatar" />
                      <div className="skeleton-content">
                        <div className="skeleton-line" />
                        <div className="skeleton-line short" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : enrichedMessages.length === 0 ? (
                <div className="empty-messages">
                  <div className="empty-icon">
                    <MessageCircle size={48} />
                  </div>
                  <h3>No messages yet</h3>
                  <p>Start a conversation with {selectedUser.fullName}</p>
                </div>
              ) : (
                <div className="messages-list">
                  {enrichedMessages.map((message, index) => {
                    const showDateDivider = index === 0 || 
                      new Date(message.createdAt).toDateString() !== 
                      new Date(enrichedMessages[index - 1].createdAt).toDateString();

                    return (
                      <React.Fragment key={message._id}>
                        {showDateDivider && (
                          <div className="date-divider">
                            <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <motion.div
                          className={`message ${message.isOwnMessage ? 'own' : 'other'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {!message.isOwnMessage && (
                            <div className="message-avatar">
                              {selectedUser.profilePic ? (
                                <img src={selectedUser.profilePic} alt={selectedUser.fullName} />
                              ) : (
                                <div className="avatar-placeholder">
                                  {selectedUser.fullName?.charAt(0)}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="message-content">
                            {message.image && (
                              <div className="message-image">
                                <img src={message.image} alt="Shared" />
                              </div>
                            )}
                            {message.text && (
                              <div className="message-bubble">
                                <span className="message-text">{message.text}</span>
                                <div className="message-time">{message.formattedTime}</div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </React.Fragment>
                    );
                  })}
                  
                  {isTyping && (
                    <motion.div
                      className="typing-indicator"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messageEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="input-area">
              <form onSubmit={handleSendMessage} className="input-form">
                <button type="button" className="attachment-button">
                  <Paperclip size={18} />
                </button>
                
                <div className="input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="message-input"
                  />
                </div>
                
                <button 
                  type="button" 
                  className="emoji-button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile size={18} />
                </button>
                
                <motion.button
                  type="submit"
                  className="send-button"
                  disabled={!messageInput.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <div className="no-chat-icon">
                <MessageCircle size={64} />
              </div>
              <h2>Welcome to NexChat</h2>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernChatContainer;