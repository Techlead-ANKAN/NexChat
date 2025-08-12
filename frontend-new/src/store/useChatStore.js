import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  selectedChat: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadCounts: {},
  
  // Track when we last viewed group to prevent false counts
  lastGroupViewTime: null,

  // Helper function to remove duplicate messages
  removeDuplicateMessages: (messages) => {
    const seen = new Set();
    return messages.filter(message => {
      if (seen.has(message._id)) {
        return false;
      }
      seen.add(message._id);
      return true;
    });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // Remove duplicates when setting initial messages
      const uniqueMessages = get().removeDuplicateMessages(res.data);
      set({ messages: uniqueMessages });
      
      // Mark messages as read
      await axiosInstance.post("/messages/mark-read", { senderId: userId });
      
      // Immediately reset unread count for this user for better UX
      set(state => ({
        unreadCounts: {
          ...state.unreadCounts,
          [userId]: 0
        }
      }));
      
      // Update unread counts
      get().fetchUnreadCounts();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getGroupMessages: async () => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get("/messages/group/messages");
      // Remove duplicates when setting initial messages
      const uniqueMessages = get().removeDuplicateMessages(res.data);
      set({ messages: uniqueMessages });
      
      // Mark group messages as seen (for backend tracking, not for badge)
      const authUser = useAuthStore.getState().authUser;
      const unseenMessages = uniqueMessages.filter(msg => {
        const isOwnMessage = msg.senderId._id === authUser._id;
        const isSeenByUser = msg.seenBy && msg.seenBy.some(seenUserId => 
          seenUserId.toString() === authUser._id.toString()
        );
        return !isOwnMessage && !isSeenByUser;
      });
      
      // Mark each unseen message as seen
      const markPromises = unseenMessages.map(message => 
        axiosInstance.put(`/messages/group/seen/${message._id}`)
          .catch(error => console.log("Error marking group message as seen:", error))
      );
      
      // Wait for all messages to be marked as seen
      await Promise.all(markPromises);
      
      // Update last group view time
      set({ lastGroupViewTime: Date.now() });
      
      // Update unread counts after marking messages as seen with longer delay
      setTimeout(() => {
        const { selectedChat } = get();
        // Only fetch if we're not in group chat anymore
        if (selectedChat !== "group") {
          get().fetchUnreadCounts();
        }
      }, 1000); // Longer delay to ensure backend is fully updated
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, selectedChat } = get();
    
    try {
      if (selectedChat === "group") {
        // For group messages, just send to server - don't add locally
        // The socket listener will handle adding the message
        await axiosInstance.post("/messages/group/send", messageData);
      } else {
        // For private messages, just send to server - don't add locally
        // The socket listener will handle adding the message
        await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      }
      // Don't manually add to messages array - let socket listener handle it
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  fetchUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-counts");
      
      // Transform array response to object format
      const unreadCountsObj = {};
      res.data.forEach(item => {
        if (item._id && item.count) {
          unreadCountsObj[item._id] = item.count;
        }
      });
      
      set({ unreadCounts: unreadCountsObj });
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // First unsubscribe to prevent duplicate listeners
    get().unsubscribeFromMessages();

    // Listen for regular private messages
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, selectedChat } = get();
      const { authUser } = useAuthStore.getState();
      
      // Check if message is relevant to current selection
      const isPrivateMessage = !newMessage.chatType || newMessage.chatType !== "group";
      
      // Check if this message belongs to the current private chat
      const isRelevantToCurrentChat = selectedUser && !selectedChat && (
        // Message from selected user to me
        ((newMessage.senderId?._id || newMessage.senderId) === selectedUser._id && 
         (newMessage.receiverId?._id || newMessage.receiverId) === authUser._id) ||
        // Message from me to selected user
        ((newMessage.senderId?._id || newMessage.senderId) === authUser._id && 
         (newMessage.receiverId?._id || newMessage.receiverId) === selectedUser._id)
      );

      if (isPrivateMessage && isRelevantToCurrentChat) {
        set(state => {
          // Add the new message and remove any duplicates
          const updatedMessages = get().removeDuplicateMessages([...state.messages, newMessage]);
          return { messages: updatedMessages };
        });
      } else if (isPrivateMessage && !isRelevantToCurrentChat) {
        // Update unread counts for other chats
        const senderId = newMessage.senderId?._id || newMessage.senderId;
        const { authUser } = useAuthStore.getState();
        
        // Only increment if message is not from the current user
        if (senderId !== authUser._id) {
          set(state => ({
            unreadCounts: {
              ...state.unreadCounts,
              [senderId]: (state.unreadCounts[senderId] || 0) + 1
            }
          }));
        }
      }
    });

    // Listen for group messages
    socket.on("newGroupMessage", (newGroupMessage) => {
      const { selectedChat } = get();
      
      if (selectedChat === "group") {
        set(state => {
          // Add the new message and remove any duplicates
          const updatedMessages = get().removeDuplicateMessages([...state.messages, newGroupMessage]);
          return { messages: updatedMessages };
        });
      }
      // Note: No unread count tracking for group messages - badge removed
    });

    // Listen for unread count updates
    socket.on("unreadCountUpdate", (data) => {
      console.log("Received unread count update:", data);
      if (data.type === "private") {
        set(state => ({
          unreadCounts: {
            ...state.unreadCounts,
            [data.userId]: data.count
          }
        }));
      }
      // Note: Group unread count updates removed - badge functionality removed
    });

    // Listen for group message seen events
    socket.on("groupMessageSeen", (data) => {
      const { selectedChat } = get();
      // Only refresh unread counts if we're not currently viewing the group
      // This prevents the badge from reappearing immediately after marking as seen
      if (selectedChat !== "group") {
        setTimeout(() => {
          get().fetchUnreadCounts();
        }, 500);
      }
    });

    // Listen for message delivery status
    socket.on("messageDelivered", (data) => {
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, delivered: data.delivered, deliveredAt: data.deliveredAt }
            : msg
        )
      }));
    });

    // Listen for message read status
    socket.on("messagesRead", (data) => {
      set(state => ({
        messages: state.messages.map(msg => 
          msg.senderId === data.senderId && msg.receiverId === data.readBy
            ? { ...msg, read: true, readAt: data.readAt }
            : msg
        )
      }));
    });

    // Listen for group message seen status
    socket.on("groupMessageSeen", (data) => {
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === data.messageId 
            ? { 
                ...msg, 
                seenBy: msg.seenBy ? [...msg.seenBy, data.seenBy] : [data.seenBy]
              }
            : msg
        )
      }));
    });

    // Listen for admin clearing all messages
    socket.on("allMessagesCleared", (data) => {
      set({ 
        messages: [],
        unreadCounts: {},
        communityUnreadCounts: {},
        lastGroupViewTime: Date.now()
      });
      
      // Show notification to user that admin has cleared all messages
      if (window.showToast) {
        window.showToast("All messages have been cleared by an administrator", "info");
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
    socket?.off("newGroupMessage");
    socket?.off("messageDelivered");
    socket?.off("messagesRead");
    socket?.off("groupMessageSeen");
    socket?.off("unreadCountUpdate");
    socket?.off("allMessagesCleared");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, selectedChat: null });
    
    // If selecting a user, reset their unread count immediately for better UX
    if (selectedUser) {
      set(state => ({
        unreadCounts: {
          ...state.unreadCounts,
          [selectedUser._id]: 0
        }
      }));
    }
  },

  setSelectedChat: (selectedChat) => {
    set({ selectedChat, selectedUser: null });
    
    // Update last group view time when entering group chat
    if (selectedChat === "group") {
      set({ lastGroupViewTime: Date.now() });
    }
    
    // If selecting a specific chat, reset its unread count immediately
    if (selectedChat && selectedChat._id) {
      set(state => ({
        communityUnreadCounts: {
          ...state.communityUnreadCounts,
          [selectedChat._id]: 0
        }
      }));
    }
  },
}));
