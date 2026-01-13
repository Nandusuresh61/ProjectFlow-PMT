import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Otp from "./pages/auth/Otp";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verfiy-otp" element={<Otp/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </>
  );
}

export default App;
