import { AuthUserState } from "@/store/auth.store";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);
  const isLoading = AuthUserState((state) => state.isLoading);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
