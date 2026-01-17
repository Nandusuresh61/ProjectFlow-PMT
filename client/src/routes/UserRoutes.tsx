import Login from "@/pages/auth/Login";
import Otp from "@/pages/auth/Otp";
import ResetPassword from "@/pages/auth/ResetPassword";
import SignUp from "@/pages/auth/SignUp";
import Home from "@/pages/Home";
import LandingPage from "@/pages/landing/LandingPage";

import { Routes, Route } from "react-router-dom";

export default function UserRoutes() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<Otp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
      </Routes>
  );
}
