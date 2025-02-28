import { create } from "zustand";
import toast from "react-hot-toast/headless";
import { axiosInstance } from "../lib/axios";
import { Types } from 'mongoose';
import { useAuthStore } from "./useAuthStore";


interface user {
    fullName: string,
    username: string,
    profilePic: string,
    email: string,
    _id: string | Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
};

interface Message {
    _id: string;
    text: string;
    image?: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
}

interface ChatStore {
    messages: Message[],
    users: user[],
    selectedUser: any | null,
    isUsersLoading: boolean,
    isMessagesLoading: boolean,
    onlineUsers: string[],
    getUsers: () => Promise<void>,
    getMessages: (userId: string) => Promise<void>,
    sendMessage: (messageData: any) => Promise<void>,
    setSelectedUser: (selectedUser: user | null) => Promise<void>,
    subscribeToMessages: () => void,
    unSubscribeToMessages: () => void,
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data.filteredUsers });
            console.log(response.data.filteredUsers);
        } catch (error: any) {
            toast.error(error.response.data.message || "Error while getting users")
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true })
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data })
        } catch (error: any) {
            toast.error(error.response.message || "Error while getting messages")
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData: any) => {
        const { selectedUser, messages } = get();
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, response.data] })
            console.log("From chatStore", selectedUser._id);
        } catch (error: any) {
            toast.error(error.response.message || "Error while sending message")
        }
    },

    subscribeToMessages: () => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket?.on("newMessage", (newMessage: Message) => {
            const isMessageSentFromSelectedUser = newMessage.senderId !== selectedUser._id;
            if (isMessageSentFromSelectedUser) return;
            set({ messages: [...messages, newMessage] });
        });
    },



    unSubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: async (selectedUser) => set({ selectedUser }),
}))