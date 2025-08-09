import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useResponsive } from "@/hooks/useResponsive";
import { Button } from "@/components/ui/Button";
import { 
  X, 
  Users, 
  Camera, 
  TreePine, 
  Mountain, 
  Binoculars,
  ArrowLeft
} from "lucide-react";
import logoImage from "@/assets/WBN Logo 2.jpg";

const ChatHeader = () => {
  const { selectedUser, selectedChat, setSelectedUser, setSelectedChat } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { isMobile } = useResponsive();

  const handleClose = () => {
    if (selectedChat === "group") {
      setSelectedChat(null);
    } else {
      setSelectedUser(null);
    }
  };

  const handleBackClick = () => {
    if (isMobile) {
      if (selectedChat === "group") {
        setSelectedChat(null);
      } else {
        setSelectedUser(null);
      }
    }
  };

  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);
  const isGroupChat = selectedChat === "group";

  return (
    <div className="bg-wild-950/50 backdrop-blur-sm border-b border-wild-800/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back Button for Mobile */}
          {isMobile && (
            <Button
              onClick={handleBackClick}
              variant="ghost"
              size="sm"
              className="p-2 text-wild-300 hover:text-white hover:bg-wild-800/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          {/* Avatar */}
          <div className="relative">
            {isGroupChat ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-nature-500/30">
                <img 
                  src={logoImage} 
                  alt="Wild By Nature Community" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-wild-700/30">
                  <img
                    src={selectedUser?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser?.fullName}`}
                    alt={selectedUser?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online status indicator */}
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-nature-500 rounded-full border-2 border-wild-950 flex items-center justify-center">
                    <Camera className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-white text-lg">
              {isGroupChat ? "Wildlife Community" : selectedUser?.fullName}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {isGroupChat ? (
                <>
                  <TreePine className="w-3 h-3" />
                  <span>Global photography community</span>
                </>
              ) : (
                <>
                  {isOnline ? (
                    <>
                      <div className="w-2 h-2 bg-nature-400 rounded-full animate-pulse" />
                      <span>Exploring • Online</span>
                    </>
                  ) : (
                    <>
                      <Mountain className="w-3 h-3 text-muted-foreground" />
                      <span>Away from nature</span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isGroupChat && (
            <div className="hidden sm:flex items-center gap-3 text-muted-foreground text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{onlineUsers.length} active</span>
              </div>
            </div>
          )}

          {/* Close button */}
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Optional: Activity indicator bar */}
      <div className="h-1 bg-gradient-to-r from-nature-500 via-gold-500 to-wild-500 opacity-20 mt-4 rounded-full" />
    </div>
  );
};

export default ChatHeader;
