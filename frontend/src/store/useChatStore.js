// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios.js";
// import { useAuthStore } from "./useAuthStore.js";

// export const useChatStore = create((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUsers: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   // sendMessage: async (messageData) => {
//   //   const { selectedUser, messages } = get();
//   //   try {
//   //     const res = await axiosInstance.post(
//   //       `/messages/send/${selectedUser._id}`,
//   //       messageData
//   //     );
//   //     set({ messages: [...messages, res.data] });
//   //   } catch (error) {
//   //     toast.error(error.response.data.message);
//   //   }
//   // },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     try {
//       const res = await axiosInstance.post(
//         `/messages/send/${selectedUser._id}`,
//         messageData
//       );
//       set({ messages: [...messages, res.data] });
//     } catch (error) {
//       // Handle error properly
//       let errorMessage = "Failed to send message";
//       if (error.response) {
//         if (error.response.status === 413) {
//           errorMessage = "Image is too large. Please use a smaller file.";
//         } else {
//           errorMessage = error.response.data?.message || errorMessage;
//         }
//       }
//       toast.error(errorMessage);
//       throw error; // Propagate error to calling function
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {
//       if (newMessage.senderId !== selectedUser._id) return;
//       set({ messages: [...get().messages, newMessage] });
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("newMessage");
//   },

//   setSelectedUser: (selectedUser) => {
//     set({ selectedUser });
//   },
// }));

// import { create } from "zustand";
// import toast from "react-hot-toast";
// import { axiosInstance } from "../lib/axios.js";
// import { useAuthStore } from "./useAuthStore.js";

// export const useChatStore = create((set, get) => ({
//   messages: [],
//   users: [],
//   selectedUser: null, // Fixed: was selectedUsers
//   isUsersLoading: false,
//   isMessagesLoading: false,

//   getUsers: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/users");
//       set({ users: res.data });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch users");
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({ messages: res.data });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch messages");
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     if (!selectedUser || !selectedUser._id) {
//       toast.error("No user selected or invalid user ID");
//       return;
//     }

//     try {
//       const res = await axiosInstance.post(
//         `/messages/send/${selectedUser._id}`,
//         messageData
//       );
//       set({ messages: [...messages, res.data] });
//     } catch (error) {
//       let errorMessage = "Failed to send message";
//       if (error.response) {
//         if (error.response.status === 413) {
//           errorMessage = "Image is too large. Please use a smaller file.";
//         } else {
//           errorMessage = error.response.data?.message || errorMessage;
//         }
//       }
//       toast.error(errorMessage);
//       throw error;
//     }
//   },

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;
//     if (!socket) return;

//     socket.on("newMessage", (newMessage) => {
//       if (newMessage.senderId !== selectedUser._id) return;
//       set({ messages: [...get().messages, newMessage] });
//     });
//   },

//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;
//     if (socket) {
//       socket.off("newMessage");
//     }
//   },

//   setSelectedUser: (selectedUser) => {
//     set({ selectedUser });
//   },
// }));

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  selectedChat: null, // null for P2P, "group" for group chat
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadCounts: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // New function to get group messages
  getGroupMessages: async () => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get("/messages/group/messages");
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch group messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, selectedChat, messages } = get();
    
    try {
      let res;
      if (selectedChat === "group") {
        // Send group message
        res = await axiosInstance.post("/messages/group/send", messageData);
      } else if (selectedUser && selectedUser._id) {
        // Send direct message
        res = await axiosInstance.post(
          `/messages/send/${selectedUser._id}`,
          messageData
        );
      } else {
        toast.error("No user or chat selected");
        return;
      }
      
      set({ messages: [...messages, res.data] });
    } catch (error) {
      let errorMessage = "Failed to send message";
      if (error.response) {
        if (error.response.status === 413) {
          errorMessage = "Image is too large. Please use a smaller file.";
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      toast.error(errorMessage);
      throw error;
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Request notification permission if needed
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const showNotification = (title, body) => {
      console.log("🔔 Triggering Notification:", title, body);
      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/nexchat-logo.png", // Place this in /public folder
        });

        // Optional: Focus the app when clicked
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    };

    socket.off("newMessage"); // prevent duplicates
    socket.off("newGroupMessage"); // prevent duplicates
    
    // Handle direct messages
    socket.on("newMessage", (newMessage) => {
      console.log("📩 Received new message:", newMessage);

      const selectedUser = get().selectedUser;
      const selectedChat = get().selectedChat;
      const messages = get().messages;
      const unreadCounts = get().unreadCounts;

      // Add message to current chat (if same user and not group chat)
      const alreadyExists = messages.some((msg) => msg._id === newMessage._id);
      if (
        selectedUser &&
        selectedChat !== "group" &&
        newMessage.senderId === selectedUser._id &&
        !alreadyExists
      ) {
        set({ messages: [...messages, newMessage] });
      } else {
        // Increment unread count
        const currentCount = unreadCounts[newMessage.senderId] || 0;
        set({
          unreadCounts: {
            ...unreadCounts,
            [newMessage.senderId]: currentCount + 1,
          },
        });
      }

      // Show notification always
      showNotification(
        `Message from ${newMessage.senderName || "Someone"}`,
        newMessage.text || "You received a new message"
      );
    });

    // Handle group messages
    socket.on("newGroupMessage", (newMessage) => {
      console.log("📩 Received new group message:", newMessage);

      const selectedChat = get().selectedChat;
      const messages = get().messages;
      const authUser = useAuthStore.getState().authUser;

      // Don't add our own messages (they're already added when sending)
      if (newMessage.senderId._id === authUser._id) return;

      // Add message to current chat if group chat is selected
      const alreadyExists = messages.some((msg) => msg._id === newMessage._id);
      if (selectedChat === "group" && !alreadyExists) {
        set({ messages: [...messages, newMessage] });
      }

      // Show notification always
      showNotification(
        `Group message from ${newMessage.senderId.fullName}`,
        newMessage.text || "You received a new group message"
      );
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("newGroupMessage");
    }
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser, selectedChat: null }); // Reset to P2P chat

    if (selectedUser?._id) {
      await get().markMessagesAsRead(selectedUser._id);
    }
  },

  setSelectedChat: (chatType) => {
    if (chatType === "group") {
      set({ selectedUser: null, selectedChat: "group" });
    }
  },

  fetchUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-counts");
      const unreadData = res.data;

      const countsMap = {};
      unreadData.forEach(({ _id, count }) => {
        countsMap[_id] = count;
      });

      set({ unreadCounts: countsMap });
    } catch (error) {
      console.error("Failed to fetch unread counts", error);
    }
  },

  markMessagesAsRead: async (senderId) => {
    try {
      await axiosInstance.post("/messages/mark-read", { senderId });
      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [senderId]: 0,
        },
      }));
    } catch (error) {
      console.error("Failed to mark messages as read", error);
    }
  },
}));
