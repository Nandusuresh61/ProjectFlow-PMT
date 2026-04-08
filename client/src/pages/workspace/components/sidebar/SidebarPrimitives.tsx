import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


export interface NavItemProps {
    id: string;
    icon: LucideIcon;
    label: string;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
    badge?: number;
    children?: React.ReactNode;
}

export const NavItem = ({
    icon: Icon,
    label,
    isActive,
    isCollapsed,
    onClick,
    badge,
    children,
}: NavItemProps) => (
    <div>
        <button
            onClick={onClick}
            className={`w-full flex items-center rounded-xl transition-all relative group h-10
                ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'}
                ${isActive
                    ? 'text-white bg-white/5'
                    : 'text-[#576CBC]/70 hover:text-white hover:bg-white/5'
                }`}
        >
            {isActive && (
                <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 w-0.5 h-5 bg-[#A5D7E8] rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
            )}
            <Icon
                size={16}
                className={isActive ? 'text-[#A5D7E8]' : 'opacity-60 group-hover:opacity-100'}
            />
            {!isCollapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium whitespace-nowrap flex-1 text-left"
                >
                    {label}
                </motion.span>
            )}
            {!isCollapsed && badge !== undefined && badge > 0 && (
                <span className="text-[11px] font-bold bg-[#A5D7E8]/20 text-[#A5D7E8] rounded-full px-1.5 py-0.5 leading-none">
                    {badge}
                </span>
            )}
        </button>
        {children}
    </div>
);


export interface NavSectionProps {
    label: string;
    isCollapsed: boolean;
    children: React.ReactNode;
}

export const NavSection = ({ label, isCollapsed, children }: NavSectionProps) => (
    <div className="space-y-0.5">
        {!isCollapsed && (
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] uppercase tracking-widest font-bold text-[#576CBC]/40 mb-1 px-3 pt-4"
            >
                {label}
            </motion.p>
        )}
        {isCollapsed && <div className="h-4" />}
        {children}
    </div>
);


export interface ProjectChipProps {
    name: string;
    color: string;
    keyCode: string;
    isActive?: boolean;
    onClick: () => void;
}

export const ProjectChip = ({ name, color, keyCode, isActive, onClick }: ProjectChipProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all group text-left
            ${isActive ? 'bg-white/5 text-white' : 'text-[#576CBC]/60 hover:text-white hover:bg-white/[0.03]'}`}
    >
        <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
        />
        <span className="text-[13px] font-medium truncate flex-1">{name}</span>
        <span className="text-[9px] font-bold opacity-40">{keyCode}</span>
    </button>
);


export interface CollapsibleProjectListProps {
    isOpen: boolean;
    children: React.ReactNode;
}

export const CollapsibleProjectList = ({ isOpen, children }: CollapsibleProjectListProps) => (
    <AnimatePresence initial={false}>
        {isOpen && (
            <motion.div
                key="project-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden ml-3 pl-3 border-l border-white/5 mt-0.5 space-y-0.5"
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);


export interface ExpandableNavItemProps {
    icon: LucideIcon;
    label: string;
    isExpanded: boolean;
    isCollapsed: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
}

export const ExpandableNavItem = ({
    icon: Icon,
    label,
    isExpanded,
    isCollapsed,
    onToggle,
    children,
}: ExpandableNavItemProps) => (
    <div>
        <button
            onClick={onToggle}
            className={`w-full flex items-center rounded-xl transition-all relative group h-10
                ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'}
                text-[#576CBC]/70 hover:text-white hover:bg-white/5`}
        >
            <Icon size={16} className="opacity-60 group-hover:opacity-100" />
            {!isCollapsed && (
                <>
                    <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">
                        {label}
                    </span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight size={13} className="opacity-40" />
                    </motion.div>
                </>
            )}
        </button>
        {!isCollapsed && children}
    </div>
);


export const SidebarDivider = () => (
    <div className="h-px bg-white/[0.05] my-2 mx-3" />
);
