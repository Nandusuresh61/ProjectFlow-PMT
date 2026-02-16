import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridBackground } from "@/components/ui/gridBackground";
import { useState } from "react";
import { toast } from "sonner";
import { forgotPassoword } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { ForgotEmailSchema } from "shared";

export default function ForgotPassword() {
  const setPendingEmail = AuthUserState((state) => state.setPendingEmail);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const result = ForgotEmailSchema.safeParse(email);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await forgotPassoword(email);
      setPendingEmail(email);
      toast.success(response.message);
      navigate("/reset-password");
    } catch (error: any) {
      toast.error(error?.message || "Reset otp error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />

      {/* Navbar Minimal */}
      <nav className="relative z-10 p-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tighter group"
        >
          <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
            PF
          </div>
          <span className="text-white">ProjectFlow</span>
        </Link>
        <Link to="/login">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-white/5"
          >
            Log in
          </Button>
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 md:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-slate-500">
              Enter your email to receive a verification code
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-400">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="name@example.com"
                  type="email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20 h-12"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full font-bold h-12 bg-white text-black hover:bg-slate-200"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>

            <div className="text-center text-sm">
              <Link
                to="/login"
                className="text-slate-500 hover:text-white transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
