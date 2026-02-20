import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { AuthUserState } from "@/store/auth.store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { resendOtp, verifyUserOtp } from "@/services/auth/auth.api";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";

type OtpValues = { otp: string };

const fields: FormField<OtpValues>[] = [
  {
    name: "otp",
    label: "One-Time Password",
    type: "text",
    placeholder: "123456",
    inputClassName:
      "text-center text-2xl tracking-[0.5em] font-mono h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-white/20",
    inputProps: { maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" },
  },
];

const INITIAL_VALUES: OtpValues = { otp: "" };

export default function Otp() {
  const pendingEmail = AuthUserState((state) => state.pendingEmail);
  const setUser = AuthUserState((state) => state.setUser);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!pendingEmail) navigate("/signup");
  }, [pendingEmail, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!pendingEmail) {
      toast.error("Email not found.");
      return;
    }
    try {
      const response = await resendOtp({ email: pendingEmail });
      toast.success(response.message);
      setTimer(60);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP!");
    }
  };

  const handleSubmit = async (values: OtpValues) => {
    if (values.otp.length !== 6) {
      toast.error("OTP must be 6 digits!");
      return;
    }
    if (!pendingEmail) {
      toast.error("Email not found");
      navigate("/signup");
      return;
    }
    try {
      const response = await verifyUserOtp({ email: pendingEmail, otp: values.otp });
      setUser(response.data!.user);
      toast.success(response.message);
      setTimeout(() => navigate("/home"), 300);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const ResendFooter = (
    <div className="text-center text-sm">
      <span className="text-slate-500">Didn't receive the code? </span>
      {timer > 0 ? (
        <span className="text-slate-500">Resend in {timer}s</span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="text-white underline hover:text-slate-200 transition-colors"
        >
          Click to resend
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-hidden">
      <GridBackground />

      <nav className="relative z-10 p-6 flex items-center justify-between">
        <Link to="/" className="group">
          <Logo
            iconClassName="bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform"
            textClassName="text-white"
          />
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
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
            <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
            <p className="text-slate-500">
              We've sent a code to{" "}
              <span className="text-white font-medium">{pendingEmail}</span>
            </p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <CustomForm
              fields={fields}
              initialValues={INITIAL_VALUES}
              onSubmit={handleSubmit}
              submitLabel="Verify Email"
              loadingLabel="Verifying..."
              footer={ResendFooter}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
