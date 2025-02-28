import { create } from 'zustand'

interface ThemeStore {
    theme: string;
    setTheme: (theme: string | null) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: localStorage.getItem("chat-theme") || "dark",
    setTheme: (theme: string | null) => {
        localStorage.setItem("chat-theme", theme || "dark");
        set({ theme: theme || "dark" });
    },
}));