import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRouteProtection from "./AdminRouteProtection";
const SuperAdminLayout = lazy(() => import("@/components/layouts/SuperAdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Users = lazy(() => import("@/pages/admin/WorkspaceUsers"));
const Workspaces = lazy(() => import("@/pages/admin/Workspaces"));
const Plans = lazy(() => import("@/pages/admin/Plans"));
const AdminTickets = lazy(() => import("@/pages/admin/AdminTickets"));


export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminRouteProtection />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/" element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="plans" element={<Plans />} />
          <Route path="tickets" element={<AdminTickets />} />
        </Route>
      </Route>
    </Routes>
  );
}
