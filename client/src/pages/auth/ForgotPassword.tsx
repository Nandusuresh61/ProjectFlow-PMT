import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { toast } from "sonner";
import { forgotPassoword } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { ForgotEmailSchema } from "@/shared/schema/auth/ForgotEmailSchema";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";
import { BackgroundAtmosphere } from "../workspace/components/BackgroundAtmosphere";

type ForgotPasswordValues = { email: string };

const fields: FormField<ForgotPasswordValues>[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "name@example.com",
    inputProps: { autoComplete: "email" },
  },
];

const INITIAL_VALUES: ForgotPasswordValues = { email: "" };

const BackToLoginFooter = (
  <div className="text-center text-sm">
    <Link to="/login" className="text-[#576CBC]/60 hover:text-[#A5D7E8] font-bold transition-colors underline-offset-4 hover:underline">
      ← Back to Login
    </Link>
  </div>
);

export default function ForgotPassword() {
  const setPendingEmail = AuthUserState((state) => state.setPendingEmail);
  const navigate = useNavigate();

  const handleSubmit = async (values: ForgotPasswordValues) => {
    try {
      const response = await forgotPassoword(values.email);
      setPendingEmail(values.email);
      toast.success(response.message);
      navigate("/reset-password");
    } catch (error: any) {
      toast.error(error?.message || "Reset OTP error");
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
        <Link to="/login">
          <Button variant="ghost" className="text-[#576CBC]/60 hover:text-white hover:bg-white/5">
            Log in
          </Button>
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 py-6 md:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Forgot Password?</h1>
            <p className="text-[#576CBC]/60 font-medium">Enter your email to receive a verification code</p>
          </div>

          <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 shadow-3xl backdrop-blur-3xl">
            <CustomForm
              fields={fields}
              initialValues={INITIAL_VALUES}
              schema={ForgotEmailSchema as any}
              onSubmit={handleSubmit}
              submitLabel="Send Verification Code"
              loadingLabel="Sending..."
              footer={BackToLoginFooter}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
