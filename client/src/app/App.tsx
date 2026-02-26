import { useEffect } from "react";
import AppRoutes from "@/routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { AuthUserState } from "@/store/auth.store";

function App() {
  const initializeAuth = AuthUserState((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
}

export default App;
