import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
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
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedChat === "group") {
      getGroupMessages();
    } else if (selectedUser) {
      getMessages(selectedUser._id);
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    selectedChat,
    getMessages,
    getGroupMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
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
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full chat-container">
      <ChatHeader />
      
      <div className="flex-1 overflow-hidden relative">
        <MessageList messages={messages} authUser={authUser} messageEndRef={messageEndRef} />
      </div>
      
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
