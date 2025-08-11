import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useResponsive } from "@/hooks/useResponsive";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    getGroupMessages,
    isMessagesLoading,
    selectedUser,
    selectedChat,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const { isMobile } = useResponsive();
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Load messages when selection changes
    const loadMessages = async () => {
      if (selectedChat === "group") {
        await getGroupMessages();
      } else if (selectedUser) {
        await getMessages(selectedUser._id);
      }
    };

    loadMessages();
  }, [
    selectedUser,
    selectedChat,
    getMessages,
    getGroupMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      }, 100);
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className={`flex-1 flex flex-col ${isMobile ? 'w-full' : ''}`}>
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full chat-container ${isMobile ? 'w-full' : ''}`}>
      <ChatHeader />
      
      {/* Messages Container with proper scrolling */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <MessageList messages={messages} authUser={authUser} messageEndRef={messageEndRef} />
      </div>
      
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
