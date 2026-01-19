import { AuthUserState } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoutes() {
  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}
