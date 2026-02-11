import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/super-admin/*" element={<AdminRoutes />} />

      <Route path="/*" element={<UserRoutes />} />
    </Routes>
  );
}
