import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, CreditCard, LogOut, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { toast } from "sonner";
import { Logo } from "@/components/common/Logo";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({ collapsed, setCollapsed }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const clearUser = AuthUserState((state) => state.clearUser);
    const [isLoading, setIsLoading] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/super-admin/dashboard" },
        { icon: Building2, label: "Organizations", path: "/super-admin/organizations" },
        { icon: CreditCard, label: "Plans", path: "/super-admin/plans" },
    ];

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
        <div
            className={cn(
                "flex flex-col h-screen bg-zinc-900 text-white transition-all duration-300 relative border-r border-zinc-800",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 h-16 border-b border-zinc-800">
                {!collapsed && (
                    <Logo
                        textClassName="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                    />
                )}
                {collapsed && (
                    <Logo
                        showText={false}
                        className="mx-auto"
                    />
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </Button>
            </div>

            <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">
                    {!collapsed && "Super Admin"}
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link to={item.path} key={item.path}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-green-500/10 text-green-500"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <item.icon
                                    size={20}
                                    className={cn("transition-colors", isActive ? "text-green-500" : "text-zinc-400 group-hover:text-white")}
                                />
                                {!collapsed && <span className="font-medium">{item.label}</span>}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-full" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="p-3 border-t border-zinc-800 space-y-2">
                <div
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    )}
                    onClick={() => toast.info("Settings not implemented yet")}
                >
                    <Settings size={20} />
                    {!collapsed && <span className="font-medium">Settings</span>}
                </div>

                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 hover:bg-red-500/10 hover:text-red-400 text-zinc-400",
                        collapsed && "justify-center px-0"
                    )}
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    {!collapsed && "Logout"}
                </Button>
            </div>
        </div>
    );
}
