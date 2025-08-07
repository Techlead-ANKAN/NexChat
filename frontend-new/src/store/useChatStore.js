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
      set({ messages: res.data });
      
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
      set({ messages: res.data });
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
        await axiosInstance.post("/messages/group/send", messageData);
      } else {
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
    const { selectedUser, selectedChat } = get();
    if (!selectedUser && selectedChat !== "group") return;

    const socket = useAuthStore.getState().socket;

    // Listen for regular private messages
    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedChat = 
        (selectedChat === "group" && newMessage.isGroupMessage) ||
        (selectedUser && (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id));

      if (isMessageFromSelectedChat) {
        set({
          messages: [...get().messages, newMessage],
        });
      } else {
        // Update unread counts for other chats
        get().fetchUnreadCounts();
      }
    });

    // Listen for group messages
    socket.on("newGroupMessage", (newGroupMessage) => {
      if (selectedChat === "group") {
        set({
          messages: [...get().messages, newGroupMessage],
        });
      } else {
        // Update unread counts for group chat
        get().fetchUnreadCounts();
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
    socket?.off("newGroupMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, selectedChat: null });
  },

  setSelectedChat: (selectedChat) => {
    set({ selectedChat, selectedUser: null });
  },
}));
