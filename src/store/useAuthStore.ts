import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

interface User {
    _id: string;
    email: string;
    username: string;
    fullName: string;
    password: string;
    profilePic?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AuthState {
    authUser: null | User;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    onlineUsers: User[];
    socket: Socket | null;
    checkAuth: () => Promise<void>;
    signup: (formData: any) => Promise<boolean>;
    login: (formData: any) => Promise<void>;
    logout: (navigate: (path: string) => void) => Promise<void>;
    updateProfile: (formData: any) => Promise<void>;
    connectSocket: () => Promise<void>;
    disconnectSocket: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log("No token found. Skipping authentication check.");
            set({ authUser: null, isCheckingAuth: false });
            return;
        }

        try {
            const response = await axiosInstance.get('/auth/check');
            set({ authUser: response.data });
            get().connectSocket();
            console.log("User authenticated:", response.data);
        } catch (error) {
            console.error("Authentication check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data: any) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/auth/signup', data);

            console.log(response.data);

            if (response.data.message.includes('successfully')) {
                toast.success("Account created successfully");
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An unexpected error occurred");
            console.log(error);
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data: any) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/auth/login', data);
            set({ authUser: response.data });
            console.log(response.data);

            if (response.data.message.includes('successfully')) {
                toast.success("Logged In successfully");
                get().connectSocket();
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An unexpected error occurred");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async (navigate: (path: string) => void) => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            get().disconnectSocket();
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "An unexpected error occurred during logout.";
            toast.error(errorMessage);
            console.error("Logout error:", error);
        }
    },

    updateProfile: async (formData: any) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put('/auth/update-profile', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            set({ authUser: response.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log(error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error?.response?.data?.message || "An error occurred while updating the profile.";
                toast.error(errorMessage);
            }
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: async () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });

        socket.connect();
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },

    disconnectSocket: async () => {
        if (get().socket?.connected) get().socket?.disconnect();
    }
}));
