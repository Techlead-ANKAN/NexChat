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
  selectedUser: null, // Fixed: was selectedUsers
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

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser || !selectedUser._id) {
      toast.error("No user selected or invalid user ID");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
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

    socket.on("newMessage", (newMessage) => {
      console.log("📩 New message received via socket:", newMessage);

      const { selectedUser, messages, unreadCounts } = get();

      // If chatting with the sender, just append the message
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({ messages: [...messages, newMessage] });
      } else {
        // 💡 Get fresh unreadCounts every time
        const updatedCounts = get().unreadCounts;
        const currentCount = updatedCounts[newMessage.senderId] || 0;

        set({
          unreadCounts: {
            ...updatedCounts,
            [newMessage.senderId]: currentCount + 1,
          },
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });

    if (selectedUser?._id) {
      await get().markMessagesAsRead(selectedUser._id);
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
