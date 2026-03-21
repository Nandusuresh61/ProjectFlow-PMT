import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { registerUser } from "@/services/auth/auth.api";
import { toast } from "sonner";
import { AuthUserState } from "@/store/auth.store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { RegisterUserSchema } from "@/shared/schema/auth/RegisterUserSchema";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";
import { BackgroundAtmosphere } from "../workspace/components/BackgroundAtmosphere";


type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const fields: FormField<SignUpValues>[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "m@example.com",
  },
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
        <span className="bg-[#060c16] px-2 text-[#576CBC]/60 font-bold tracking-widest">
          Or continue with
        </span>
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
      navigate("/verify-otp");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
          <Button
            variant="ghost"
            className="text-[#576CBC]/60 hover:text-white hover:bg-white/5"
          >
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
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Create Account
            </h1>
            <p className="text-[#576CBC]/60 font-medium">
              Join the collective to start shipping.
            </p>
          </div>

          <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 shadow-3xl backdrop-blur-3xl">
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

          <p className="text-center text-sm text-[#576CBC]/60 font-medium">
            By clicking continue, you agree to our{" "}
            <a href="#" className="text-[#A5D7E8] font-bold hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#A5D7E8] font-bold hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </main>
    </div>
  );
}
