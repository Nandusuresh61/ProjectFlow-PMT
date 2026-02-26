import { useEffect } from "react";
import { AuthUserState } from "@/store/auth.store";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const initializeAuth = AuthUserState((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};