import { useChatStore } from "@/store/useChatStore";
import { formatMessageTime } from "@/lib/utils";
import { Camera, TreePine } from "lucide-react";
import { motion } from "framer-motion";

const MessageList = ({ messages, authUser, messageEndRef }) => {
  const { selectedUser, selectedChat } = useChatStore();

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" 
             style={{ background: 'hsl(var(--muted) / 0.3)' }}>
          <TreePine className="w-8 h-8" />
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
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-4" style={{ paddingBottom: '2rem' }}>
      {messages.map((message, index) => {
        // Safety check for senderId
        if (!message.senderId) {
          console.warn('Message with missing senderId:', message);
          return null;
        }
        
        const isFromMe = (selectedChat === "group" ? message.senderId._id : message.senderId) === authUser._id;
        const showAvatar = index === 0 || 
          (selectedChat === "group" 
            ? messages[index - 1]?.senderId?._id !== message.senderId._id
            : (messages[index - 1]?.senderId !== message.senderId)
          );

        return (
          <motion.div
            key={message._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-end gap-3 ${isFromMe ? "justify-end" : "justify-start"}`}
          >
            {/* Avatar (for others, on left) */}
            {!isFromMe && showAvatar && (
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 mb-1 flex-shrink-0"
                   style={{ ringColor: 'hsl(var(--border))' }}>
                <img
                  src={
                    selectedChat === "group"
                      ? message.senderId?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${message.senderId?.fullName || 'Unknown'}`
                      : selectedUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.fullName}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {!isFromMe && !showAvatar && <div className="w-8 flex-shrink-0" />}

            {/* Message Content */}
            <div className={`max-w-xs lg:max-w-md ${isFromMe ? "order-1" : "order-2"}`}>
              {/* Name & Time (for group chats and others) */}
              {selectedChat === "group" && !isFromMe && showAvatar && (
                <div className="text-xs mb-1 ml-3 flex items-center gap-1"
                     style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <Camera className="w-3 h-3" />
                  <span>{message.senderId?.fullName || 'Unknown User'}</span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`
                  relative rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm
                  ${isFromMe ? "chat-bubble-sent" : "chat-bubble-received"}
                `}
              >
                {/* Message Image */}
                {message.image && (
                  <div className="mb-2">
                    <img
                      src={message.image}
                      alt="Shared content"
                      className="max-w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => window.open(message.image, '_blank')}
                    />
                  </div>
                )}

                {/* Message Text */}
                {message.text && (
                  <p className="text-sm leading-relaxed break-words">
                    {message.text}
                  </p>
                )}

                {/* Message Time */}
                <div className="text-xs mt-1" 
                     style={{ color: isFromMe ? 'rgba(255,255,255,0.8)' : 'hsl(var(--muted-foreground))' }}>
                  {formatMessageTime(message.createdAt)}
                </div>

                {/* Message Tail */}
                <div
                  className={`
                    absolute top-4 w-3 h-3 rotate-45
                    ${isFromMe ? "-right-1" : "-left-1"}
                  `}
                  style={{
                    background: isFromMe ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    ...(isFromMe ? {} : { borderLeft: '1px solid hsl(var(--border))', borderTop: '1px solid hsl(var(--border))' })
                  }}
                />
              </div>
            </div>

            {/* Avatar (for me, on right) */}
            {isFromMe && showAvatar && (
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 mb-1 order-2 flex-shrink-0"
                   style={{ ringColor: 'hsl(var(--primary) / 0.3)' }}>
                <img
                  src={authUser.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser.fullName}`}
                  alt="My profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {isFromMe && !showAvatar && <div className="w-8 order-2 flex-shrink-0" />}
          </motion.div>
        );
      })}
      
      {/* Scroll anchor */}
      <div ref={messageEndRef} className="h-1" />
    </div>
  );
};

export default MessageList;
