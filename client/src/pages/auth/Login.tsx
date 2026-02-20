import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { toast } from "sonner";
import { loginUser } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { LoginUserSchema } from "shared";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";

type LoginValues = { email: string; password: string };

const fields: FormField<LoginValues>[] = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "m@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    labelSuffix: (
      <Link
        to="/forgot-password"
        className="text-xs text-slate-500 hover:text-white transition-colors underline-offset-4 hover:underline"
      >
        Forgot password?
      </Link>
    ),
  },
];

const INITIAL_VALUES: LoginValues = { email: "", password: "" };

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

export default function Login() {
  const setUser = AuthUserState((state) => state.setUser);
  const isLoading = AuthUserState((state) => state.isLoading);
  const setLoading = AuthUserState((state) => state.setLoading);

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      setUser(response.data!.user);
      toast.success(response.message);
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
        <Link to="/signup">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
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
            <p className="text-slate-500">Enter your credentials to access your account</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <CustomForm
              fields={fields}
              initialValues={INITIAL_VALUES}
              schema={LoginUserSchema as any}
              onSubmit={handleLogin}
              submitLabel="Sign In"
              loadingLabel="Signing in..."
              isLoading={isLoading}
              footer={OAuthFooter}
            />
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
