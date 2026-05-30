import { AuthUserState } from "@/store/auth.store";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
    onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
    const user = AuthUserState((state) => state.user);

    return (
        <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-zinc-400 hover:text-white"
                    onClick={onMenuClick}
                >
                    <Menu size={20} />
                </Button>
                <h2 className="text-lg font-semibold text-white">Super Admin Panel</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{user?.fullName || "Super Admin"}</p>
                        <p className="text-xs text-zinc-500">Administrator</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold border border-green-500/20 overflow-hidden">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={user.fullName || 'Admin'} className="w-full h-full object-cover" />
                        ) : (
                            user?.fullName?.charAt(0).toUpperCase() || "SA"
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
