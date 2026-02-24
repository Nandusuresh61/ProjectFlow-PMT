import { useEffect } from "react";
import { AuthUserState } from "@/store/auth.store";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const checkAuth = AuthUserState((state) => state.checkAuth);
  const setLoading = AuthUserState((state) => state.setLoading);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkAuth();
      setLoading(false);
    };

    init();
  }, [checkAuth, setLoading]);

  return <>{children}</>;
};