import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    Video,
    Settings,
    FolderKanban,
    ClipboardList,
    Kanban,
    Zap,
    Users,
    Activity,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SidebarMode } from '../types/sidebar.types';
import { WorkspaceRoleEnum } from '@/shared/enums/WorkspaceRolesEnum';

interface MobileNavItem {
    id: string;
    icon: LucideIcon;
    label: string;
}

const WORKSPACE_NAV_ITEMS: MobileNavItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'chat', icon: MessageSquare, label: 'Inbox' },
    { id: 'meetings', icon: Video, label: 'Meetings' },
    { id: 'activity', icon: Activity, label: 'Activity' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

const PROJECT_NAV_ITEMS: MobileNavItem[] = [
    { id: 'overview', icon: FolderKanban, label: 'Overview' },
    { id: 'backlogs', icon: ClipboardList, label: 'Backlogs' },
    { id: 'board', icon: Kanban, label: 'Board' },
    { id: 'sprint', icon: Zap, label: 'Sprint' },
    { id: 'project-team', icon: Users, label: 'Team' },
];

export interface MobileNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    mode: SidebarMode;
    role: WorkspaceRoleEnum | null;
}

export const MobileNav = ({ activeTab, onTabChange, mode, role }: MobileNavProps) => {
    const isMemberOrViewer = role === WorkspaceRoleEnum.WORKSPACE_MEMBER || role === WorkspaceRoleEnum.WORKSPACE_VIEWER;
    const restrictedTabs = ['backlogs', 'sprint'];

    const items = mode === 'workspace' 
        ? WORKSPACE_NAV_ITEMS 
        : PROJECT_NAV_ITEMS.filter(item => !(isMemberOrViewer && restrictedTabs.includes(item.id)));

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060d1a]/95 backdrop-blur-xl flex items-center justify-around px-2 h-16 shadow-[0_-4px_24px_rgba(0,0,0,0.3)] border-t border-white/5 pb-safe">
            {items.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => onTabChange(id)}
                    className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all
                        ${activeTab === id ? 'text-[#A5D7E8] scale-105' : 'text-[#576CBC]/50 hover:text-white/60'}`}
                >
                    <Icon size={19} />
                    <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
                </button>
            ))}
        </nav>
    );
};
