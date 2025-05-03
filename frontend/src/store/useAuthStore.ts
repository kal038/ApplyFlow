import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        token: null,

        login: (user, token) =>
          set(
            {
              isAuthenticated: true,
              user,
              token: token ?? null,
            },
            false,
            "login"
          ),

        logout: () =>
          set(
            {
              isAuthenticated: false,
              user: null,
              token: null,
            },
            false,
            "logout"
          ),
      }),
      { name: "applyflow-auth" }
    ),
    { name: "AuthStore" }
  )
);
