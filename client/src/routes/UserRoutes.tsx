import Login from "@/pages/auth/Login";
import Otp from "@/pages/auth/Otp";
import ResetPassword from "@/pages/auth/ResetPassword";
import SignUp from "@/pages/auth/SignUp";
import Home from "@/pages/Home";
import LandingPage from "@/pages/landing/LandingPage";
import NotFound from "@/pages/NotFound";

import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import GoogleCallback from "@/pages/auth/GoogleCallback";

export default function UserRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* User Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>

      {/* Catch-all 404 for User Routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}