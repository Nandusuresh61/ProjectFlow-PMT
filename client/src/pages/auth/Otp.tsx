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
import { BackgroundAtmosphere } from "../workspace/components/BaseComponents";

type OtpValues = { otp: string };

const fields: FormField<OtpValues>[] = [
  {
    name: "otp",
    label: "One-Time Password",
    type: "text",
    placeholder: "123456",
    inputClassName:
      "text-center text-4xl tracking-[0.5em] font-black h-20 bg-[#19376D]/10 border-[#576CBC]/20 text-[#A5D7E8] placeholder:text-[#576CBC]/20 focus-visible:ring-[#A5D7E8]/30 rounded-2xl",
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
      <span className="text-[#576CBC]/60">Didn't receive the code? </span>
      {timer > 0 ? (
        <span className="text-[#576CBC]/60 font-medium">Resend in {timer}s</span>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="text-[#A5D7E8] font-bold hover:underline underline-offset-4 transition-all"
        >
          Click to resend
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060c16] text-white font-sans flex flex-col relative overflow-hidden selection:bg-[#A5D7E8] selection:text-[#0B2447]">
      <BackgroundAtmosphere />
      <GridBackground />

      <nav className="relative z-10 p-6 flex items-center justify-between">
        <Link to="/" className="group">
          <Logo
            iconClassName="bg-[#A5D7E8] text-[#0B2447] shadow-[0_0_20px_rgba(165,215,232,0.2)] group-hover:scale-110 transition-transform"
            textClassName="text-white"
          />
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="text-[#576CBC]/60 hover:text-white hover:bg-white/5">
            Log in
          </Button>
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 md:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">Verify email</h1>
            <p className="text-[#576CBC]/60 font-medium">
              We've sent a code to{" "}
              <span className="text-white font-bold">{pendingEmail}</span>
            </p>
          </div>

          <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-[3rem] p-10 shadow-3xl backdrop-blur-3xl">
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
