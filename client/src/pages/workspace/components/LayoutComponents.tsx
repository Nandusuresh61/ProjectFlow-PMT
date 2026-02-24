import {
    LayoutDashboard,
    Briefcase,
    Layers,
    Users,
    MessageSquare,
    Video,
    Activity,
    Settings,
    Search,
    Bell,
    ChevronDown,
    ChevronRight,
    LogOut
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';


interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

interface MenuItem {
    id: string;
    icon: LucideIcon;
    label: string;
}

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, onToggle }: SidebarProps) => {
    const menuItems: MenuItem[] = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'projects', icon: Briefcase, label: 'Projects' },
        { id: 'issues', icon: Layers, label: 'Issues' },
        { id: 'team', icon: Users, label: 'Team' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'meetings', icon: Video, label: 'Meetings' },
        { id: 'activity', icon: Activity, label: 'Activity' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 256 }}
            className="h-screen flex flex-col bg-[#0B2447]/40 backdrop-blur-2xl border-r border-white/5 sticky top-0 left-0 z-50 overflow-hidden hidden lg:flex flex-shrink-0"
        >
            <div className={`py-8 overflow-y-auto no-scrollbar flex-1 ${isCollapsed ? 'px-4' : 'px-6'}`}>
                <Logo
                    showText={!isCollapsed}
                    onClick={onToggle}
                    className={`mb-10 px-2 cursor-pointer group transition-all ${isCollapsed ? 'justify-center' : ''}`}
                    iconClassName="bg-[#A5D7E8] text-[#0B2447] shadow-[0_0_20px_rgba(165,215,232,0.2)] group-hover:scale-110 transition-transform"
                    textClassName="text-white text-lg tracking-tight"
                />

                <nav className="space-y-1">
                    {!isCollapsed && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] uppercase tracking-widest font-bold text-[#576CBC]/60 mb-4 px-3"
                        >
                            Navigation
                        </motion.p>
                    )}
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center rounded-xl transition-all relative group h-11 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${activeTab === item.id
                                ? 'text-white bg-white/5'
                                : 'text-[#576CBC]/70 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 w-1 h-6 bg-[#A5D7E8] rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <item.icon size={18} className={`${activeTab === item.id ? 'text-[#A5D7E8]' : 'opacity-60 group-hover:opacity-100'}`} />
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </motion.aside>
    );
};

interface HeaderProps {
    activeTab: string;
    user: any;
    onLogout: () => void;
}

export const Header = ({ activeTab, user, onLogout }: HeaderProps) => (
    <header className="h-16 bg-[#060c16]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                <Logo
                    showText={false}
                    iconClassName="w-6 h-6 bg-[#19376D] text-[#A5D7E8] group-hover:bg-[#A5D7E8] group-hover:text-[#0B2447] transition-all"
                    className="flex-shrink-0"
                />
                <span className="text-sm font-semibold text-white/90">Acme Corp</span>
                <ChevronDown size={14} className="text-[#576CBC]/60 group-hover:text-white" />
            </div>
            <ChevronRight size={14} className="text-white/20" />
            <span className="text-sm font-bold text-white capitalize">{activeTab}</span>
        </div>

        <div className="flex items-center gap-6">
            <div className="relative group flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#576CBC]/40 group-focus-within:text-[#A5D7E8] transition-colors" size={16} />
                <input
                    type="text"
                    placeholder="Search issues, projects..."
                    className="bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs w-64 text-white focus:outline-none focus:bg-white/[0.08] transition-all"
                />
            </div>

            <div className="relative cursor-pointer group">
                <Bell size={20} className="text-[#576CBC]/60 group-hover:text-white transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#060c16]" />
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none mb-1">{user?.fullName || "Admin"}</p>
                </div>
                <motion.div
                    onClick={onLogout}
                    whileHover={{ scale: 1.05 }}
                    className="w-8 h-8 rounded-lg bg-black text-white text-[10px] font-black flex items-center justify-center cursor-pointer border border-white/10"
                >
                    {user?.fullName?.substring(0, 2).toUpperCase() || "AD"}
                </motion.div>

                <motion.button
                    onClick={onLogout}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(244, 63, 94, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:border-rose-500/40 transition-colors ml-2"
                >
                    <LogOut size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                </motion.button>
            </div>
        </div>
    </header>
);

