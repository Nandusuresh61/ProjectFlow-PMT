import { create } from "zustand";
import type { User } from "@/types/auth.types";
import { persist } from "zustand/middleware";
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const AuthUserState = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    { name: "auth-store" }
  )
);
