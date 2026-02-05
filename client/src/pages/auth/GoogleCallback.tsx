import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { googleAuth } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const setUser = AuthUserState((state) => state.setUser);
  const setLoading = AuthUserState((state) => state.setLoading);

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await googleAuth(code);

        if (response.data && response.data.user) {
          setUser(response.data.user);
          toast.success("Login successful");
          navigate("/home");
        } else {
          throw new Error("No user data received");
        }
      } catch (err: any) {
        console.error("Google Auth Error:", err);
        toast.error(err.message || "Google login failed");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleGoogleAuth();
  }, [navigate, setUser, setLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        <p>Signing you in with Google...</p>
      </div>
    </div>
  );
}
