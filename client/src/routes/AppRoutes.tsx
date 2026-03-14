import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import { Suspense } from "react";
import { Loader } from "@/components/ui/Loader";




export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader fullScreen size="lg" text="Loading..." />}>
      <Routes>
        <Route path="/super-admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Suspense>
  );
}
