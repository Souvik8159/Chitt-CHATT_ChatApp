import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  unreadMessages: {},

  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");

      console.log("Users API Response:", res.data);

      // Ensure users is always an array
      set({
        users: Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.users)
            ? res.data.users
            : [],
      });
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to fetch users");

      set({ users: [] });
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
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );

      set((state) => ({
        messages: [...state.messages, res.data],
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  getUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread");

      set({
        unreadMessages: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      console.log("NEW MESSAGE:", newMessage);

      const { selectedUser } = get();

      console.log("selectedUser:", selectedUser?._id);
      console.log("senderId:", newMessage.senderId);
      console.log(newMessage);
      console.log("receiverId:", newMessage.receiverId);

      if (selectedUser?._id === newMessage.senderId) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      } else {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [newMessage.senderId]:
              (state.unreadMessages[newMessage.senderId] || 0) + 1,
          },
        }));

        console.log(get().unreadMessages);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) =>
    set((state) => ({
      selectedUser,
      unreadMessages: {
        ...state.unreadMessages,
        [selectedUser._id]: 0,
      },
    })),
}));
