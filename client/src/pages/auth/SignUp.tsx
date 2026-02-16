import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { GridBackground } from "@/components/ui/gridBackground";
import React, { useState } from "react";
import { registerUser } from "@/services/auth/auth.api";
import { toast } from "sonner";
import { AuthUserState } from "@/store/auth.store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { RegisterUserSchema } from "shared";

export default function SignUp() {
  const isLoading = AuthUserState((state) => state.isLoading);
  const setLoading = AuthUserState((state) => state.setLoading);
  const setPendingEmail = AuthUserState((state) => state.setPendingEmail);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  console.log("form data :", form);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const result = RegisterUserSchema.safeParse(form);

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      toast.success(response.message);
      setPendingEmail(form.email);
      setTimeout(() => {
        navigate("/verify-otp");
      }, 500);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />

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
              Create an account
            </h1>
            <p className="text-slate-500">
              Enter your details below to create your account
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-400">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  type="text"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-400">
                  Email
                </Label>
                <Input
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  type="email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-400">
                  Password
                </Label>
                <PasswordInput
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-400">
                  Confirm Password
                </Label>
                <PasswordInput
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full font-bold h-12 bg-white text-black hover:bg-slate-200"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0A0A0A] px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <GoogleAuthButton />
          </div>

          <p className="text-center text-sm text-slate-500">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </main>
    </div>
  );
}
