import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { toast } from "sonner";
import { forgotPassoword } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { ForgotEmailSchema } from "shared";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";

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
    <Link to="/login" className="text-slate-500 hover:text-white transition-colors">
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
            <h1 className="text-3xl font-bold tracking-tight">Forgot Password?</h1>
            <p className="text-slate-500">Enter your email to receive a verification code</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
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
