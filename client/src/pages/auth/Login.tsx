import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { GridBackground } from "@/components/ui/gridBackground";
import { useState } from "react";
import { toast } from "sonner";
import { loginUser } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";





import { onboardingApi } from "@/services/onboarding/onboaring.api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const setUser = AuthUserState((state) => state.setUser);
  const setIsOnboarded = AuthUserState((state) => state.setIsOnboarded);
  const isLoading = AuthUserState((state) => state.isLoading);
  const setLoading = AuthUserState((state) => state.setLoading);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!form.email && !form.password) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    try {
      const response = await loginUser(form);
      console.log(response);
      const user = response.data!.user;

      try {
        const onboardingStatus = await onboardingApi.getStatus();
        setIsOnboarded(onboardingStatus.isCompleted);

        setUser(user);
        toast.success(response.message);

        if (onboardingStatus.isCompleted) {
          navigate("/home");
        } else {
          navigate("/onboarding");
        }
      } catch (statusError) {
        console.error("Failed to fetch onboarding status", statusError);
        setUser(user);
        navigate("/home"); // Fallback
      }

    } catch (error: any) {
      toast.error(error.message);
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
        <Link to="/signup">
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white hover:bg-white/5"
          >
            Sign up
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
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-slate-500">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-sm">
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-400">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-slate-500 hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20"
                />
              </div>
            </div>

            <Button
              className="w-full font-bold h-12 bg-white text-black hover:bg-slate-200"
              onClick={handleLogin}
            >
              {isLoading ? "Loading..." : "Sign In"}
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
            Don't have an account?{" "}
            <Link to="/signup" className="underline hover:text-white">
              Sign up
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
