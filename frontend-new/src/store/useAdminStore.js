import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useAdminStore = create((set, get) => ({
  // State
  isLoading: false,
  dashboardStats: null,
  users: [],
  messages: [],
  selectedUser: null,
  selectedConversation: null,
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
  totalMessages: 0,

  // Filters
  userFilters: {
    search: "",
    blocked: undefined,
    page: 1,
    limit: 20
  },
  messageFilters: {
    search: "",
    chatType: "all",
    userId: "",
    page: 1,
    limit: 50
  },

  // Dashboard Methods
  getDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/dashboard/stats");
      set({ dashboardStats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch dashboard stats");
    } finally {
      set({ isLoading: false });
    }
  },

  // User Management Methods
  getAllUsers: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams({ ...get().userFilters, ...filters });
      const res = await axiosInstance.get(`/admin/users?${params}`);
      
      set({ 
        users: res.data.users,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalUsers: res.data.totalUsers,
        userFilters: { ...get().userFilters, ...filters }
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch users");
    } finally {
      set({ isLoading: false });
    }
  },

  getUserDetails: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/admin/users/${userId}`);
      set({ selectedUser: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch user details");
    } finally {
      set({ isLoading: false });
    }
  },

  toggleUserBlock: async (userId) => {
    try {
      const res = await axiosInstance.patch(`/admin/users/${userId}/toggle-block`);
      
      // Update users list
      const updatedUsers = get().users.map(user => 
        user._id === userId ? res.data.user : user
      );
      set({ users: updatedUsers });
      
      // Update selected user if it's the same user
      if (get().selectedUser?.user._id === userId) {
        set({ selectedUser: { ...get().selectedUser, user: res.data.user } });
      }
      
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to toggle user block");
    }
  },

  promoteToAdmin: async (userId) => {
    try {
      const res = await axiosInstance.patch(`/admin/users/${userId}/promote`);
      
      // Update users list
      const updatedUsers = get().users.map(user => 
        user._id === userId ? res.data.user : user
      );
      set({ users: updatedUsers });
      
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to promote user");
    }
  },

  // Message Management Methods
  getAllMessages: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams({ ...get().messageFilters, ...filters });
      const res = await axiosInstance.get(`/admin/messages?${params}`);
      
      set({ 
        messages: res.data.messages,
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalMessages: res.data.totalMessages,
        messageFilters: { ...get().messageFilters, ...filters }
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch messages");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/admin/messages/${messageId}`);
      
      // Remove message from list
      const updatedMessages = get().messages.filter(msg => msg._id !== messageId);
      set({ messages: updatedMessages });
      
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete message");
    }
  },

  getConversation: async (user1Id, user2Id, page = 1) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/admin/conversations/${user1Id}/${user2Id}?page=${page}`);
      set({ selectedConversation: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch conversation");
    } finally {
      set({ isLoading: false });
    }
  },

  // Filter Methods
  setUserFilters: (filters) => {
    set({ userFilters: { ...get().userFilters, ...filters } });
  },

  setMessageFilters: (filters) => {
    set({ messageFilters: { ...get().messageFilters, ...filters } });
  },

  // Clear Methods
  clearSelectedUser: () => set({ selectedUser: null }),
  clearSelectedConversation: () => set({ selectedConversation: null }),
  clearMessages: () => set({ messages: [] }),
  clearUsers: () => set({ users: [] }),
}));
