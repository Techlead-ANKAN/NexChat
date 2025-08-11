import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useResponsive } from "@/hooks/useResponsive";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { 
  Camera, 
  TreePine, 
  Users, 
  Search, 
  Mountain,
  Leaf,
  Binoculars
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/WBN Logo 2.jpg";

const ChatSidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    selectedChat,
    setSelectedUser, 
    setSelectedChat, 
    isUsersLoading,
    unreadCounts,
    fetchUnreadCounts
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const { isMobile } = useResponsive();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
    fetchUnreadCounts();
  }, [getUsers, fetchUnreadCounts]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOnlineFilter = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    return matchesSearch && matchesOnlineFilter;
  });

  if (isUsersLoading) {
    return (
      <div className={cn(
        "sidebar flex items-center justify-center",
        isMobile ? "w-full" : "w-20 lg:w-80"
      )}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={cn(
      "sidebar flex flex-col",
      isMobile ? "w-full" : "w-20 lg:w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div className={cn("block", !isMobile && "hidden lg:block")}>
            <h3 className="font-display font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Wildlife Community</h3>
            <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>Connect with photographers</p>
          </div>
        </div>

        {/* Search */}
        <div className={cn("relative mb-4", !isMobile && "hidden lg:block")}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <Input
            placeholder="Search photographers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 form-input"
          />
        </div>

        {/* Filter */}
        <div className={cn("items-center justify-between", isMobile ? "flex" : "hidden lg:flex")}>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="w-4 h-4 rounded focus:ring-2 focus:ring-[hsl(var(--primary))]"
              style={{ 
                backgroundColor: 'hsl(var(--input))', 
                borderColor: 'hsl(var(--border))',
                accentColor: 'hsl(var(--primary))'
              }}
            />
            <span className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Online only</span>
          </label>
          <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
        {/* Community Chat */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedChat("group")}
          className={cn(
            "w-full p-3 mb-2 flex items-center gap-3 rounded-xl transition-all duration-200",
            selectedChat === "group"
              ? "bg-gradient-to-r from-nature-500/20 to-gold-500/20 border border-nature-500/30"
              : "hover:bg-wild-800/30"
          )}
        >
          <div className="relative mx-auto lg:mx-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-nature-500/30">
              <img 
                src={logoImage} 
                alt="Wild By Nature Community" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className={cn("text-left min-w-0 flex-1", !isMobile && "hidden lg:block")}>
            <div className="font-semibold text-white font-display">Community Chat</div>
            <div className="text-sm text-muted-foreground">Connect with everyone</div>
          </div>
        </motion.button>

        {/* Divider */}
        <div className="border-b border-wild-800/30 my-3 mx-2" />

        {/* Photographers List */}
        <div className="space-y-1">
          {filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const unreadCount = unreadCounts[user._id] || 0;
            const hasUnread = unreadCount > 0 && selectedUser?._id !== user._id;

            return (
              <motion.button
                key={user._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedUser(user)}
                className={cn(
                  "w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200",
                  selectedUser?._id === user._id && selectedChat !== "group"
                    ? "bg-gradient-to-r from-wild-600/20 to-wild-700/20 border border-wild-500/30"
                    : "hover:bg-wild-800/30"
                )}
              >
                {/* Avatar */}
                <div className="relative mx-auto lg:mx-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-wild-700/30">
                    <img
                      src={user.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Online Status - Enhanced Green Dot */}
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-wild-950 shadow-lg animate-pulse">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  )}

                  {/* WhatsApp-Style Unread Message Count Badge - Top Left */}
                  {hasUnread && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -left-1 z-10"
                    >
                      <div className={cn(
                        "bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-wild-950",
                        unreadCount > 99 ? "w-7 h-5 px-1" : 
                        unreadCount > 9 ? "w-6 h-5" : "w-5 h-5"
                      )}>
                        <span className="leading-none">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      </div>
                      {/* Subtle pulsing animation for new messages */}
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                    </motion.div>
                  )}
                </div>

                {/* User Info - Desktop */}
                <div className={cn("text-left min-w-0 flex-1", !isMobile && "hidden lg:block")}>
                  <div className="font-medium text-white truncate flex items-center gap-2">
                    {user.fullName}
                    {isOnline && <Mountain className="w-3 h-3 text-nature-400" />}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    {isOnline ? (
                      <>
                        <Binoculars className="w-3 h-3" />
                        <span>Exploring wilderness</span>
                      </>
                    ) : (
                      <>
                        <Leaf className="w-3 h-3" />
                        <span>Away from nature</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 px-4">
            <TreePine className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No photographers found</p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              {searchTerm ? "Try a different search" : "Check back later"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={cn("p-3 border-t border-wild-800/30 bg-wild-950/30", !isMobile && "hidden lg:block")}>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <TreePine className="w-3 h-3" />
          <span>Wild By Nature Chat</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
