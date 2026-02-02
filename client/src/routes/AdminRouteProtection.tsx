import { Navigate, Outlet } from "react-router-dom";
import { AuthUserState } from "@/store/auth.store";

export default function AdminRouteProtection() {
  const user = AuthUserState((state) => state.user);
  const isLoading = AuthUserState((state) => state.isLoading);

  if (isLoading) {
    return null; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isSuperAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
