import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api", 
    withCredentials: true, 
});

interface SignupData {
    email: string;
    username: string;
    fullName: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

export function formatMessageTime(date: string){
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

// ✅ Function to sign up a new user
export async function signupUser(userData: SignupData) {
    try {
        const response = await API.post("/auth/signup", userData);
        return response.data;
    } catch (error: any) {
        console.error("Signup Error:", error.response?.data);
        throw error;
    }
}

// ✅ Function to log in a user
export async function loginUser(credentials: LoginData) {
    try {
        const response = await API.post("/auth/login", credentials);
        return response.data;
    } catch (error: any) {
        console.error("Login Error:", error.response?.data);
        throw error;
    }
}