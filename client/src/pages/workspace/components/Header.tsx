import { ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import type { IUser } from 'shared';

export interface HeaderProps {
    activeTab: string;
    user: IUser | null;
    onLogout: () => void;
    onOpenCreateWorkspace: () => void;
}

export const Header = ({ activeTab, user, onLogout, onOpenCreateWorkspace }: HeaderProps) => (
    <header className="h-16 bg-[#060c16]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden sm:block translate-y-[-1px]">
                <WorkspaceSwitcher onOpenCreate={onOpenCreateWorkspace} />
            </div>
            <ChevronRight size={14} className="text-white/20 hidden sm:block" />
            <span className="text-sm font-bold text-white capitalize">{activeTab}</span>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 border-l border-white/5">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white leading-none mb-1">{user?.fullName || "Admin"}</p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-8 h-8 rounded-lg bg-black text-white text-[10px] font-black flex items-center justify-center cursor-pointer border border-white/10"
                >
                    {user?.fullName?.substring(0, 2).toUpperCase() || "AD"}
                </motion.div>

                <motion.button
                    onClick={onLogout}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(244, 63, 94, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:border-rose-500/40 transition-colors ml-1 md:ml-2"
                >
                    <LogOut size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Logout</span>
                </motion.button>
            </div>
        </div>
    </header>
);
