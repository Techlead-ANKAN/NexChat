import { useChatStore } from "@/store/useChatStore";
import { formatMessageTime } from "@/lib/utils";
import { motion } from "framer-motion";
import logoImage from "@/assets/WBN Logo 2.jpg";

const MessageList = ({ messages, authUser, messageEndRef }) => {
  const { selectedUser, selectedChat } = useChatStore();

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-2 ring-[hsl(var(--primary))] ring-opacity-20" 
             style={{ background: 'hsl(var(--muted) / 0.3)' }}>
          <img 
            src={logoImage} 
            alt="Wild By Nature Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center text-lg font-medium mb-2">
          {selectedChat === "group" 
            ? "Welcome to the community!" 
            : "Start your wildlife photography conversation"
          }
        </p>
        <p className="text-center text-sm opacity-70">
          {selectedChat === "group" 
            ? "Be the first to share something with the community." 
            : "Send a message to begin your conversation."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2" style={{ paddingBottom: '1rem' }}>
      {messages.map((message, index) => {
        // Safety check for senderId
        if (!message.senderId || !message._id) {
          console.warn('Message with missing senderId or _id:', message);
          return null;
        }
        
        const isFromMe = selectedChat === "group" 
          ? (message.senderId?._id || message.senderId) === authUser._id
          : (message.senderId?._id || message.senderId) === authUser._id;
        const showAvatar = index === 0 || 
          (selectedChat === "group" 
            ? messages[index - 1]?.senderId?._id !== message.senderId._id
            : (messages[index - 1]?.senderId !== message.senderId)
          );

        return (
          <motion.div
            key={message._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-end gap-2 mb-1 ${isFromMe ? "justify-end" : "justify-start"}`}
          >
            {/* Avatar (for others, on left) */}
            {!isFromMe && showAvatar && selectedChat === "group" && (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1">
                <img
                  src={message.senderId?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${message.senderId?.fullName || 'Unknown'}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {!isFromMe && !showAvatar && selectedChat === "group" && <div className="w-6 flex-shrink-0" />}

            {/* Message Content */}
            <div className={`${isFromMe ? "order-1" : "order-2"}`}>
              {/* Name (for group chats and others) */}
              {selectedChat === "group" && !isFromMe && showAvatar && (
                <div className="text-xs mb-1 ml-3 text-muted-foreground font-medium">
                  {message.senderId?.fullName || 'Unknown User'}
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`
                  px-3 py-2 ${isFromMe ? "chat-bubble-sent ml-auto" : "chat-bubble-received"}
                `}
              >
                {/* Message Image */}
                {message.image && (
                  <div className="mb-2">
                    <img
                      src={message.image}
                      alt="Shared content"
                      className="max-w-full h-auto rounded-lg cursor-pointer"
                      style={{ maxWidth: '250px' }}
                      onClick={() => window.open(message.image, '_blank')}
                    />
                  </div>
                )}

                {/* Message Text */}
                {message.text && (
                  <p className="text-sm leading-relaxed break-words mb-1">
                    {message.text}
                  </p>
                )}

                {/* Message Time */}
                <div className={`text-xs text-right opacity-70 ${isFromMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                  {formatMessageTime(message.createdAt)}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {/* Scroll anchor */}
      <div ref={messageEndRef} className="h-1" />
    </div>
  );
};

export default MessageList;
