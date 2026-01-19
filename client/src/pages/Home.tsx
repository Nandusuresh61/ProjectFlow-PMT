import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate()
  const user = AuthUserState((state) => state.user);
  const clearUser = AuthUserState((state) => state.clearUser)
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      clearUser();
      toast.success(response.message);
      setTimeout(()=>{
        navigate('/login');
      },500);
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  return (
    <>
      <h1>welcome {user?.fullName}</h1>
      <Button
        onClick={handleLogout}
        className="bg-black text-white hover:bg-slate-200 w-full py-6 text-lg font-bold rounded-xl"
      >
        LogOut
      </Button>
    </>
  );
}
