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
      
      // Mark group messages as seen
      const authUser = useAuthStore.getState().authUser;
      const unseenMessages = uniqueMessages.filter(msg => 
        msg.senderId._id !== authUser._id && 
        (!msg.seenBy || !msg.seenBy.includes(authUser._id))
      );
      
      // Mark each unseen message as seen
      for (const message of unseenMessages) {
        try {
          await axiosInstance.put(`/messages/group/seen/${message._id}`);
        } catch (error) {
          console.log("Error marking group message as seen:", error);
        }
      }
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
      set({ unreadCounts: res.data });
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
        get().fetchUnreadCounts();
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
      } else {
        // Update unread counts for group chat when not viewing it
        get().fetchUnreadCounts();
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
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
    socket?.off("newGroupMessage");
    socket?.off("messageDelivered");
    socket?.off("messagesRead");
    socket?.off("groupMessageSeen");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, selectedChat: null });
  },

  setSelectedChat: (selectedChat) => {
    set({ selectedChat, selectedUser: null });
  },
}));
