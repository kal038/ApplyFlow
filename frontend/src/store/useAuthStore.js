import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export const useAuthStore = create()(devtools(persist((set) => ({
    isAuthenticated: false,
    user: null,
    login: async (email, password) => {
        const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Login failed");
        }
        const user = await response.json();
        set({ isAuthenticated: true, user }, false, "login");
    },
    signup: async (email, password) => {
        const response = await fetch("/api/v1/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Signup failed");
        }
        const user = await response.json();
        set({ isAuthenticated: true, user }, false, "signup");
    },
    logout: async () => {
        const response = await fetch("/api/v1/auth/logout", {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error("Logout failed");
        }
        set({ isAuthenticated: false, user: null }, false, "logout");
    },
}), {
    name: "applyflow-auth",
    partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
    }),
}), { name: "AuthStore" }));
