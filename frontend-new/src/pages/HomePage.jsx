import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatContainer from "@/components/chat/ChatContainer";
import WelcomeScreen from "@/components/chat/WelcomeScreen";

const HomePage = () => {
  const { 
    selectedUser, 
    selectedChat, 
    subscribeToMessages, 
    unsubscribeFromMessages, 
    fetchUnreadCounts 
  } = useChatStore();
  
  const { socket } = useAuthStore();

  useEffect(() => {
    if (socket) {
      subscribeToMessages();
      fetchUnreadCounts();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, subscribeToMessages, unsubscribeFromMessages, fetchUnreadCounts]);

  const showChat = selectedUser || selectedChat === "group";

  return (
    <div className="h-screen overflow-hidden pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="h-[calc(100vh-8rem)] glass-effect rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex h-full">
            {/* Sidebar */}
            <ChatSidebar />
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {showChat ? (
                <ChatContainer />
              ) : (
                <WelcomeScreen />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
