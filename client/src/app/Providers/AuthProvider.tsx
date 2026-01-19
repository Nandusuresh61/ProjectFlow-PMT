import { useEffect } from "react";
import { getMe } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setUser = AuthUserState((state) => state.setUser);
  const clearUser = AuthUserState((state) => state.clearUser);
  const setLoading = AuthUserState((state) => state.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      try {
        const response = await getMe();
        setUser(response.data!.user);
      } catch {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
};
