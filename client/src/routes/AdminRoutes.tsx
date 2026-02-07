import { Routes, Route } from "react-router-dom";
import SuperAdmin from "@/pages/SuperAdmin";
import AdminRouteProtection from "./AdminRouteProtection";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminRouteProtection />}>
        {/* Matches /super-admin/ */}
        <Route path="/" element={<SuperAdmin />} />
      </Route>
    </Routes>
  );
}
