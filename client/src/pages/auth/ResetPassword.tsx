import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GridBackground } from "@/components/ui/gridBackground";
import { toast } from "sonner";
import { resetPassword } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";
import { BackgroundAtmosphere } from "../workspace/components/BaseComponents";

type ResetPasswordValues = { otp: string; newPassword: string };

const INITIAL_VALUES: ResetPasswordValues = { otp: "", newPassword: "" };

export default function ResetPassword() {
  const pendingEmail = AuthUserState((state) => state.pendingEmail);
  const navigate = useNavigate();

  if (!pendingEmail) {
    navigate("/forgot-password");
    return null;
  }

  const fields: FormField<ResetPasswordValues>[] = [
    {
      name: "otp",
      label: "One-Time Password",
      type: "text",
      placeholder: "123456",
      inputProps: { maxLength: 6, inputMode: "numeric", pattern: "[0-9]*" },
      inputClassName: "text-center tracking-[0.4em] font-black text-xl h-14 bg-[#19376D]/10 border-[#576CBC]/20 text-[#A5D7E8] placeholder:text-[#576CBC]/20 focus-visible:ring-[#A5D7E8]/30 rounded-2xl",
    },
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  const handleSubmit = async (values: ResetPasswordValues) => {
    if (values.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    if (values.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await resetPassword({
        email: pendingEmail,
        otp: values.otp,
        password: values.newPassword,
      });
      toast.success(res.message || "Password reset successful");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Invalid OTP");
    }
  };

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
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 md:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white uppercase">Reset Password</h1>
            <p className="text-[#576CBC]/60 font-medium">
              OTP sent to{" "}
              <span className="text-white font-bold">{pendingEmail}</span>
            </p>
          </div>

          <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-[3rem] p-10 shadow-3xl backdrop-blur-3xl">
            <CustomForm
              fields={fields}
              initialValues={INITIAL_VALUES}
              onSubmit={handleSubmit}
              submitLabel="Reset Password"
              loadingLabel="Resetting..."
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
