import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { getChatUserDataFromURL, validateUserData, mapSSOTypeToRole } from "../lib/sso-decoder.js";
import { getSSOEncryptionKey } from "../config/sso.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isSSOLoggingIn: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });
      get().connectSocket();
    } catch (error) {
      // 401 errors are expected when not authenticated - don't log them
      if (error.response?.status !== 401) {
        console.log("Error in checkAuth:", error);
      }
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  // SSO Authentication
  checkSSOAuth: async () => {
    try {
      const encryptionKey = getSSOEncryptionKey();
      const ssoUserData = getChatUserDataFromURL(encryptionKey);
      
      if (ssoUserData && validateUserData(ssoUserData)) {
        console.log("SSO user data detected:", ssoUserData);
        return await get().loginWithSSO(ssoUserData);
      }
      
      return false;
    } catch (error) {
      console.error("Error checking SSO auth:", error);
      return false;
    }
  },

  loginWithSSO: async (ssoUserData) => {
    set({ isSSOLoggingIn: true });
    try {
      const res = await axiosInstance.post("/sso/auth", ssoUserData);
      
      if (res.data.user) {
        set({ authUser: res.data.user });
        toast.success(`Welcome back, ${res.data.user.fullName}!`);
        get().connectSocket();
        
        // Clear URL parameters after successful SSO login
        const url = new URL(window.location);
        url.searchParams.delete('ur');
        window.history.replaceState({}, document.title, url.pathname);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("SSO login error:", error);
      toast.error(error.response?.data?.message || "SSO authentication failed");
      return false;
    } finally {
      set({ isSSOLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully! Welcome to Wild By Nature!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Welcome back to the wilderness!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateEmail: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-email", data);
      set({ authUser: res.data.user });
      toast.success("Email updated successfully!");
    } catch (error) {
      console.log("error in update email:", error);
      toast.error(error.response?.data?.message || "Failed to update email");
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updatePassword: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-password", data);
      toast.success("Password updated successfully!");
      // Note: User object doesn't change on password update for security
    } catch (error) {
      console.log("error in update password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      transports: ['websocket'],
      upgrade: true,
      rememberUpgrade: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      set({ socket });
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
