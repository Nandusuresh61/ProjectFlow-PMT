import { AuthUserState } from "@/store/auth.store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "@/components/ui/Loader";

export default function ProtectedRoutes() {
  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);
  const user = AuthUserState((state) => state.user);
  const isLoading = AuthUserState((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }


  if (!user?.isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
