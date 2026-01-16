import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  pendingEmail: string | null;

  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (value: boolean) => void;
  setPendingEmail: (email: string | null) => void;
}


export const AuthUserState = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      pendingEmail: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          pendingEmail: null,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (value) => set({ isLoading: value }),

      setPendingEmail: (email) => set({ pendingEmail: email }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
