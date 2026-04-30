import { Loader } from "@/components/ui/Loader";
import { acceptInvitation, getInvitationDetails } from "@/services/Invitation/invitation.api";
import { AuthUserState } from "@/store/auth.store";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/error";

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

    const processInvitation = async () => {
      try {
        if (!isAuthenticated) {
          const response = await getInvitationDetails(token);
          localStorage.setItem("invite_token", token);
          toast.success("Invitation link captured. Please log in or sign up to continue.");
          
          const { email, isRegistered } = response.data;
          
          if (isRegistered) {
            navigate("/login", { state: { prefillEmail: email, isInvite: true } });
          } else {
            navigate("/signup", { state: { prefillEmail: email, isInvite: true } });
          }
        } else {
          const response = await acceptInvitation(token);
          toast.success(response.message);
          localStorage.removeItem("invite_token");
          navigate("/home/dashboard");
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error) || "Failed to process invitation");
        navigate("/");
      }
    };
    
    processInvitation();
  }, [token, isAuthenticated, navigate]);

  return <Loader fullScreen />;
}
