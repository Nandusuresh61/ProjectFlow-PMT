import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { googleAuth } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { Loader } from "@/components/ui/Loader";
import { acceptInvitation } from "@/services/Invitation/invitation.api";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const checkAuth = AuthUserState((state) => state.checkAuth);
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
          const pendingToken = localStorage.getItem("invite_token");
          if (pendingToken) {
            try {
              await acceptInvitation(pendingToken);
              localStorage.removeItem("invite_token");
              toast.success("Joined workspace successfully!");
            } catch (inviteErr) {
              console.error("Failed to accept invitation:", inviteErr);
            }
          }

          await checkAuth();

          toast.success("Login successful");
          navigate("/home/dashboard");
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
  }, [navigate, checkAuth, setLoading]);

  return <Loader fullScreen text="Authenticating..." />;
}
