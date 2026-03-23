import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    Video,
    Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MobileNavItem {
    id: string;
    icon: LucideIcon;
    label: string;
}

const NAV_ITEMS: MobileNavItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'chat', icon: MessageSquare, label: 'Inbox' },
    { id: 'meetings', icon: Video, label: 'Meetings' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

export interface MobileNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060d1a]/95 backdrop-blur-xl flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all
                    ${activeTab === id ? 'text-[#A5D7E8]' : 'text-[#576CBC]/50 hover:text-white/60'}`}
            >
                <Icon size={19} />
                <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
            </button>
        ))}
    </nav>
);
