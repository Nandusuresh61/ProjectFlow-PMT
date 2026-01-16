import { getMe } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { useEffect } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = AuthUserState((user) => user.setUser);
  const clearUser = AuthUserState((user) => user.clearUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await getMe();

        setUser(response.user);
      } catch {
        clearUser();
      }
    };
    initAuth();
  }, [setUser, clearUser]);

  return <>{children}</>;
};
