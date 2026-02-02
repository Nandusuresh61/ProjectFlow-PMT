import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Loader2, User } from "lucide-react";

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const user = AuthUserState((state) => state.user);
  const clearUser = AuthUserState((state) => state.clearUser);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await logoutUser();
      toast.success(response.message || "Logged out successfully");
      setTimeout(() => {
        clearUser();
        navigate('/login');
      }, 800);
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="bg-slate-100 p-4 rounded-full w-fit mx-auto mb-4">
          <User className="w-12 h-12 text-slate-600" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Welcome back, <span className="text-blue-600">{user?.fullName || "Guest"}</span>!
        </h1>
        <p className="text-slate-500">You are currently logged into SuperAdmin dashboard.</p>
      </div>

      <Button
        onClick={handleLogout}
        disabled={isLoading}
        variant="destructive"
        className="w-full max-w-xs py-6 text-lg font-bold rounded-xl transition-all hover:scale-105"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Logging out...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </>
        )}
      </Button>
    </div>
  );
}