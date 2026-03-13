import { create } from "zustand";
import api from "../api/axios.js";

const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    error: null,
    initialized: false,

    register: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/auth/register", data);
            set({ user: res.data.user, loading: false });
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed";
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    login: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/auth/login", data);
            set({ user: res.data.user, loading: false });
            return { success: true, role: res.data.user.role };
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed";
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            set({ user: null });
        }
    },

    getMe: async () => {
        set({ loading: true });
        try {
            const res = await api.get("/auth/me");
            set({ user: res.data.user, initialized: true, loading: false });
        } catch {
            set({ user: null, initialized: true, loading: false });
        }
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
