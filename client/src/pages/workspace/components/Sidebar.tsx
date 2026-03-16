import {
    LayoutDashboard,
    Briefcase,
    Layers,
    Users,
    MessageSquare,
    Video,
    Activity,
    Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';

export interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

export interface MenuItem {
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
