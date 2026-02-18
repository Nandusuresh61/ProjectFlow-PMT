import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridBackground } from "@/components/ui/gridBackground";
import { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { PasswordInput } from "@/components/ui/PasswordInput";


export default function ResetPassword() {
  const pendingEmail = AuthUserState((state) => state.pendingEmail);
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!pendingEmail) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword({
        email: pendingEmail,
        otp,
        password: newPassword,
      });

      toast.success(res.message || "Password reset successful");

      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />

      <nav className="relative z-10 p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-lg">
            PF
          </div>
          <span>ProjectFlow</span>
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-slate-500">
              OTP sent to <span className="text-white">{pendingEmail}</span>
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <Label>OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="123456"
                className="text-center tracking-[0.4em]"
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <PasswordInput
                id="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value) }}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-white text-black"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
