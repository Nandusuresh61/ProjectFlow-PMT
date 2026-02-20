import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { registerUser } from "@/services/auth/auth.api";
import { toast } from "sonner";
import { AuthUserState } from "@/store/auth.store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { RegisterUserSchema } from "shared";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";

type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const fields: FormField<SignUpValues>[] = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "John Doe" },
  { name: "email", label: "Email", type: "email", placeholder: "m@example.com" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
];

const INITIAL_VALUES: SignUpValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const OAuthFooter = (
  <>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-white/10" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-[#0A0A0A] px-2 text-slate-500">Or continue with</span>
      </div>
    </div>
    <GoogleAuthButton />
  </>
);

export default function SignUp() {
  const isLoading = AuthUserState((state) => state.isLoading);
  const setLoading = AuthUserState((state) => state.setLoading);
  const setPendingEmail = AuthUserState((state) => state.setPendingEmail);
  const navigate = useNavigate();

  const handleSubmit = async (values: SignUpValues) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      toast.success(response.message);
      setPendingEmail(values.email);
      setTimeout(() => navigate("/verify-otp"), 500);
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
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-slate-500">Enter your details below to create your account</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <CustomForm
              fields={fields}
              initialValues={INITIAL_VALUES}
              schema={RegisterUserSchema as any}
              onSubmit={handleSubmit}
              submitLabel="Create Account"
              loadingLabel="Creating Account..."
              isLoading={isLoading}
              footer={OAuthFooter}
            />
          </div>

          <p className="text-center text-sm text-slate-500">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-white">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white">Privacy Policy</a>.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
