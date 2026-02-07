import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Admin Routes */}
            <Route path="/super-admin/*" element={<AdminRoutes />} />

            {/* User Routes*/}
            <Route path="/*" element={<UserRoutes />} />
        </Routes>
    );
}
