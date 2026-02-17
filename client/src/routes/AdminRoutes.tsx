import { Routes, Route, Navigate } from "react-router-dom";
import AdminRouteProtection from "./AdminRouteProtection";
import SuperAdminLayout from "@/components/layouts/SuperAdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Organizations from "@/pages/admin/Organizations";
import Plans from "@/pages/admin/Plans";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminRouteProtection />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="organizations" element={<Organizations />} />
          <Route path="plans" element={<Plans />} />
        </Route>
      </Route>
    </Routes>
  );
}
