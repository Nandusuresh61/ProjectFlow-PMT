import { getMe } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);
  const setUser = AuthUserState((state) => state.setUser);
  const clearUser = AuthUserState((state) => state.clearUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await getMe();
        setUser(response.data!.user);
      } catch (error) {
        clearUser();
      } finally {
        setIsChecking(false);
      }
    };

    if (isAuthenticated) {
      verifySession();
    } else {
      setIsChecking(false);
    }
  }, []);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
