import { AuthUserState } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "@/components/ui/Loader";

export default function ProtectedRoutes() {
  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);
  const user = AuthUserState((state) => state.user);
  const isLoading = AuthUserState((state) => state.isLoading);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  if (user && user.membershipCount === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}