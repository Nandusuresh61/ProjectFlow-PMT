import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridBackground } from "@/components/ui/gridBackground";

export default function Otp() {
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
              Verify your email
            </h1>
            <p className="text-slate-500">
              We've sent a code to{" "}
              <span className="text-white font-medium">m@example.com</span>
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-400">
                  One-Time Password
                </Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  type="text"
                  maxLength={6}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20 text-center text-2xl tracking-[0.5em] font-mono h-14"
                />
              </div>
            </div>

            <Button className="w-full font-bold h-12 bg-white text-black hover:bg-slate-200">
              Verify Email
            </Button>

            <div className="text-center text-sm">
              <span className="text-slate-500">Didn't receive the code? </span>
              <button className="text-white underline hover:text-slate-200">
                Click to resend
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
