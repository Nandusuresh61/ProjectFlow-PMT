import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRouteProtection from "./AdminRouteProtection";
const SuperAdminLayout = lazy(() => import("@/components/layouts/SuperAdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Workspaces = lazy(() => import("@/pages/admin/WorkspaceUsers"));
const Plans = lazy(() => import("@/pages/admin/Plans"));


export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminRouteProtection />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="plans" element={<Plans />} />
        </Route>
      </Route>
    </Routes>
  );
}
