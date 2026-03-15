import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/gridBackground";
import { toast } from "sonner";
import { loginUser } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { LoginUserSchema } from "shared";
import { Logo } from "@/components/common/Logo";
import CustomForm, { type FormField } from "@/components/form/CustomFrom";
import { BackgroundAtmosphere } from "../workspace/components/BackgroundAtmosphere";
import { acceptInvitation } from "@/services/Invitation/invitation.api";

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
        className="text-xs text-[#576CBC]/60 hover:text-[#A5D7E8] transition-colors underline-offset-4 hover:underline"
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
        <span className="bg-[#060c16] px-2 text-[#576CBC]/60 font-bold tracking-widest">
          Or continue with
        </span>
      </div>
    </div>
    <GoogleAuthButton />
  </>
);

export default function Login() {
  const isLoading = AuthUserState((state) => state.isLoading);
  const setLoading = AuthUserState((state) => state.setLoading);
  const checkAuth = AuthUserState((state) => state.checkAuth);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    try {
      const response = await loginUser(values);
      const pendingToken = localStorage.getItem("invite_token");

      if (pendingToken) {
        try {
          await acceptInvitation(pendingToken);
          localStorage.removeItem("invite_token");
          toast.success("Joined workspace successfully!");
        } catch (inviteErr) {
          console.error("Invitation failed:", inviteErr);
        }
      }

      await checkAuth();
      toast.success(response.message);
      navigate("/home");
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
        <Link to="/signup">
          <Button
            variant="ghost"
            className="text-[#576CBC]/60 hover:text-white hover:bg-white/5"
          >
            Sign up
          </Button>
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 py-6 md:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Welcome back
            </h1>
            <p className="text-[#576CBC]/60 font-medium">
              Initialize session protocols to continue.
            </p>
          </div>

          <div className="bg-[#19376D]/10 border border-[#576CBC]/20 rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 shadow-3xl backdrop-blur-3xl">
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

          <p className="text-center text-sm text-[#576CBC]/60 font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#A5D7E8] font-bold hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
