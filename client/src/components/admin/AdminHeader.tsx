import { AuthUserState } from "@/store/auth.store";
import { Bell, Search, Menu } from "lucide-react";
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
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="h-9 w-64 rounded-md border border-zinc-700 bg-zinc-950 pl-9 pr-4 text-sm text-zinc-300 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder:text-zinc-600"
                    />
                </div>

                <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-zinc-900"></span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{user?.fullName || "Super Admin"}</p>
                        <p className="text-xs text-zinc-500">Administrator</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold border border-green-500/20">
                        {user?.fullName?.charAt(0).toUpperCase() || "SA"}
                    </div>
                </div>
            </div>
        </header>
    );
}
