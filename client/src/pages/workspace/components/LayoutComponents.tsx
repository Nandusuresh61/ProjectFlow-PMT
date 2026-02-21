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
    Zap,
    Menu,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Sidebar = ({ activeTab, setActiveTab }: any) => {
    const menuItems = [
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
        <aside className="w-64 h-screen flex flex-col bg-[#0B2447]/40 backdrop-blur-2xl border-r border-white/5 sticky top-0 overflow-hidden hidden lg:flex">
            <div className="py-8 px-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-black text-xs">
                        PF
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">
                        ProjectFlow
                    </span>
                </div>

                <nav className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#576CBC]/60 mb-4 px-3">Navigation</p>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${activeTab === item.id
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
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export const Header = ({ activeTab, user, onLogout }: any) => (
    <header className="h-16 bg-white/[0.02] border-b border-white/5 sticky top-0 z-40 flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
            <button className="text-[#576CBC]/60 hover:text-white transition-colors">
                <Menu size={20} />
            </button>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-6 h-6 bg-[#19376D] rounded flex items-center justify-center text-[10px] font-black">
                    PF
                </div>
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
            </div>
        </div>
    </header>
);
