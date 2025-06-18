// src/components/chat/ChatContainer.jsx
import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import "./ChatContainer.css"

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const enrichedMessages = messages.map((message) => ({
    ...message,
    isOwnMessage: message.senderId === authUser._id,
    senderProfilePic:
      message.senderId === authUser._id
        ? authUser.profilePic || "/avatar.png"
        : selectedUser?.profilePic || "/avatar.png",
    formattedTime: formatMessageTime(message.createdAt),
  }));

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 50);
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className={`chat-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="user-info-container">
          <div className="avatar-container">
            <div className="avatar-glow online"></div>
            <div className="user-avatar">
              {selectedUser?.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.name}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-initial">
                  {selectedUser?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="online-pulse"></div>
          </div>
          <div className="user-details">
            <div className="user-name">{selectedUser?.name || "Select a user"}</div>
            <div className="user-status">
              <div className="status-indicator online"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <button className="close-button">
          <svg className="close-icon" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="messages-container" onScroll={handleScroll}>
        {isMessagesLoading ? (
          <div className="loading-messages">
            <div className="message-skeleton">
              <div className="avatar-skeleton"></div>
              <div className="content-skeleton">
                <div className="bubble-skeleton"></div>
                <div className="bubble-skeleton"></div>
              </div>
            </div>
            <div className="message-skeleton own">
              <div className="content-skeleton">
                <div className="bubble-skeleton"></div>
              </div>
            </div>
          </div>
        ) : enrichedMessages.length === 0 ? (
          <div className="no-messages">
            <div className="empty-icon">
              <div className="chat-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-5h2v2h-2v-2zm0-6h2v4h-2V5z" />
                </svg>
              </div>
            </div>
            <h3>No messages yet</h3>
            <p>Start a conversation with {selectedUser?.name || "this user"}</p>
          </div>
        ) : (
          enrichedMessages.map((message) => (
            <div
              key={message._id}
              className={`message ${message.isOwnMessage ? "own" : ""}`}
            >
              {!message.isOwnMessage && (
                <div className="avatar-container">
                  <div className="avatar-glow"></div>
                  <div className="user-avatar">
                    {message.senderProfilePic ? (
                      <img
                        src={message.senderProfilePic}
                        alt="Avatar"
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-initial">
                        {selectedUser?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="message-content">
                {!message.isOwnMessage && (
                  <div className="sender-name">{selectedUser?.name}</div>
                )}
                {message.image && (
                  <div className="image-message">
                    <img
                      src={message.image}
                      alt="Sent"
                      className="message-image"
                    />
                  </div>
                )}
                {message.text && (
                  <div className="message-bubble">
                    <div className="message-text">{message.text}</div>
                  </div>
                )}
                <div className="message-time">{message.formattedTime}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} className="message-end" />
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <div className="input-form">
          <div className="input-glow"></div>
          <button className="attachment-button">
            <svg className="button-icon" viewBox="0 0 24 24">
              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
            </svg>
          </button>
          <input type="file" className="hidden-input" />
          <div className="text-input-wrapper">
            <input
              type="text"
              className="text-input"
              placeholder="Type a message..."
            />
          </div>
          <button className="send-button">
            <svg className="send-icon" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
            <div className="send-glow"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;