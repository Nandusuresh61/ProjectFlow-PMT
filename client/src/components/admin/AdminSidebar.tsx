import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, CreditCard, LogOut, ChevronsLeft, ChevronsRight, Settings, X, Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth/auth.api";
import { AuthUserState } from "@/store/auth.store";
import { toast } from "sonner";
import { Logo } from "@/components/common/Logo";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ collapsed, setCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const clearUser = AuthUserState((state) => state.clearUser);
    const [, setIsLoading] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/super-admin/dashboard" },
        { icon: Building2, label: "Organizations", path: "/super-admin/organizations" },
        { icon: CreditCard, label: "Plans", path: "/super-admin/plans" },
        { icon: Users, label: "Users", path: "/super-admin/users" },
        { icon: UserPlus, label: "Admins", path: "/super-admin/admins" },
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
        <>
            <div
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-30 flex flex-col h-full bg-zinc-900 text-white transition-all duration-300 border-r border-zinc-800 shadow-xl md:shadow-none",
                    collapsed ? "w-20" : "w-64",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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

                    {/* Desktop Collapse Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex absolute -right-4 top-6 h-8 w-8 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
                    </Button>

                    {/* Mobile Close Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-zinc-400 hover:text-white"
                        onClick={() => setIsMobileOpen(false)}
                    >
                        <X size={20} />
                    </Button>
                </div>

                <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                    <div className={cn("text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3 transition-opacity duration-300", collapsed ? "opacity-0 hidden" : "opacity-100 block")}>
                        Super Admin
                    </div>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                to={item.path}
                                key={item.path}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-green-500/10 text-green-500"
                                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                                        collapsed && "justify-center px-2"
                                    )}
                                >
                                    <item.icon
                                        size={20}
                                        className={cn("transition-colors flex-shrink-0", isActive ? "text-green-500" : "text-zinc-400 group-hover:text-white")}
                                    />
                                    {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
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
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer text-zinc-400 hover:bg-zinc-800 hover:text-white",
                            collapsed && "justify-center px-2"
                        )}
                        onClick={() => toast.info("Settings not implemented yet")}
                    >
                        <Settings size={20} className="flex-shrink-0" />
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
                        <LogOut size={20} className="flex-shrink-0" />
                        {!collapsed && "Logout"}
                    </Button>
                </div>
            </div>
        </>
    );
}
