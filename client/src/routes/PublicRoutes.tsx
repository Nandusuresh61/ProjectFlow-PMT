import { AuthUserState } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoutes() {
  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);

  const user = AuthUserState((state) => state.user);

  if (isAuthenticated) {
    if (window.location.pathname === "/invite/accept") {
      return <Outlet />;
    }

    if (user?.isSuperAdmin) {
      return <Navigate to="/super-admin" replace />;
    }

    if (user && user.membershipCount === 0) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}
