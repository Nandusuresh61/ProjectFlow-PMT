import { AuthUserState } from "@/store/auth.store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "@/components/ui/Loader";
import { useEffect, useState } from "react";

export default function ProtectedRoutes() {
  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);
  const user = AuthUserState((state) => state.user);
  const checkAuth = AuthUserState((state) => state.checkAuth);
  const location = useLocation();

  // authChecked prevents the "not authenticated → redirect to /login" flash
  // on the first render before the async checkAuth has resolved.
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setAuthChecked(true));
  }, []); // runs once on mount — only fires for protected pages

  if (!authChecked) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  if (user && user.membershipCount === 0 && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}