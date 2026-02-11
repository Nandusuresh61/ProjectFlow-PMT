import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  pendingEmail: string | null;
  isOnboarded: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (value: boolean) => void;
  setPendingEmail: (email: string | null) => void;
  setIsOnboarded: (status: boolean) => void;
}


export const AuthUserState = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      pendingEmail: null,
      isOnboarded: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          pendingEmail: null,
        }),

      setIsOnboarded: (status: boolean) => set({ isOnboarded: status }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isOnboarded: false,
        }),

      setLoading: (value) => set({ isLoading: value }),

      setPendingEmail: (email) => set({ pendingEmail: email }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);
