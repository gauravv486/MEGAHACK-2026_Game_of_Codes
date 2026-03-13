import { create } from "zustand";
import api from "../api/axios.js";

const useRideStore = create((set) => ({
    rides: [],
    currentRide: null,
    loading: false,
    error: null,
    total: 0,

    searchRides: async (params) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/rides/search", { params });
            set({ rides: res.data.rides, total: res.data.total, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message, loading: false });
        }
    },

    getRideById: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/rides/${id}`);
            set({ currentRide: res.data.ride, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message, loading: false });
        }
    },

    createRide: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/rides/create", data);
            set({ loading: false });
            return { success: true, ride: res.data.ride };
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to create ride";
            set({ error: msg, loading: false });
            return { success: false, message: msg };
        }
    },

    clearRides: () => set({ rides: [], currentRide: null }),
}));

export default useRideStore;
