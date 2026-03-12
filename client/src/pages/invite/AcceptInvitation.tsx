import { Loader } from "@/components/ui/Loader";
import { acceptInvitation } from "@/services/Invitation/invitation.api";
import { AuthUserState } from "@/store/auth.store";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isAuthenticated = AuthUserState((state) => state.isAuthenticated);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid invitation link");
      navigate("/");
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem("invite_token", token);
      toast.success("Invitation link captured. Please log in or sign up to continue.");
      navigate("/login");
      return;
    }

    const processInvitation = async () => {
      try {
        const response = await acceptInvitation(token);
        toast.success(response.message);
        localStorage.removeItem("invite_token");
        navigate("/");
      } catch (error: any) {
        toast.error(error.message);
        navigate("/");
      }
    };
    processInvitation();
  }, [token, isAuthenticated, navigate]);

  return <Loader fullScreen />;
}
