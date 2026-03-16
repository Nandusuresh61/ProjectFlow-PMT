import {
    LayoutDashboard,
    Briefcase,
    Users,
    Activity,
    Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export interface MenuItem {
    id: string;
    icon: LucideIcon;
    label: string;
}

export const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
    const navItems: MenuItem[] = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
        { id: 'projects', icon: Briefcase, label: 'Projects' },
        { id: 'team', icon: Users, label: 'Team' },
        { id: 'activity', icon: Activity, label: 'Activity' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060c16]/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 h-16">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${activeTab === item.id ? 'text-[#A5D7E8]' : 'text-[#576CBC]/60'}`}
                >
                    <item.icon size={20} />
                    <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};
