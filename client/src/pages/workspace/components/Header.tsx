import { ChevronRight, LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import type { User } from '@/types/auth.types';
import type { SidebarMode, Project } from '../types/sidebar.types';

export interface HeaderProps {
    activeTab: string;
    mode: SidebarMode;
    selectedProject: Project | null;
    user: User | null;
    onLogout: () => void;
    onOpenCreateWorkspace: () => void;
    onToggleMobileSidebar: () => void;
}

const tabLabel = (tab: string): string =>
    tab.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const Header = ({
    activeTab,
    mode,
    selectedProject,
    user,
    onLogout,
    onOpenCreateWorkspace,
    onToggleMobileSidebar,
}: HeaderProps) => (
    <header className="h-14 bg-[#060d1a]/90 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-1.5 -ml-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Open sidebar"
            >
                <Menu size={20} />
            </button>
            
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <div className="hidden sm:block">
                <WorkspaceSwitcher onOpenCreate={onOpenCreateWorkspace} />
            </div>
            <ChevronRight size={13} className="text-white/15 hidden sm:block" />
            {mode === 'project' && selectedProject && (
                <>
                    <span className="text-white/40 font-medium text-[13px]">Projects</span>
                    <ChevronRight size={13} className="text-white/15" />
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: selectedProject.color }}
                    />
                    <span className="text-white font-semibold text-[13px]">
                        {selectedProject.name}
                    </span>
                    <ChevronRight size={13} className="text-white/15" />
                </>
            )}
            <span className="text-white/60 font-medium text-[13px]">{tabLabel(activeTab)}</span>
            </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 pl-4">
            <NotificationBell />
            <div className="text-right hidden sm:block">
                <p className="text-[11px] font-semibold text-white/80 leading-none">
                    {user?.fullName || 'User'}
                </p>
            </div>
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-7 h-7 rounded-lg bg-[#19376D] text-[#A5D7E8] text-[10px] font-black flex items-center justify-center cursor-pointer border border-white/10 overflow-hidden"
            >
                {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                ) : (
                    user?.fullName?.substring(0, 2).toUpperCase() || 'PF'
                )}
            </motion.div>
            <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(244, 63, 94, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:border-rose-500/40 transition-colors"
            >
                <LogOut size={13} />
                <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block">
                    Logout
                </span>
            </motion.button>
        </div>
    </header>
);
