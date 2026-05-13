import { Navigate, Outlet } from "react-router-dom";
import { AuthUserState } from "@/store/auth.store";
import { Loader } from "@/components/ui/Loader";

export default function AdminRouteProtection() {
  const user = AuthUserState((state) => state.user);
  const isLoading = AuthUserState((state) => state.isLoading);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!user || !user.isSuperAdmin) {
    return <Navigate to="/home/dashboard" replace />;
  }

  return <Outlet />;
}
