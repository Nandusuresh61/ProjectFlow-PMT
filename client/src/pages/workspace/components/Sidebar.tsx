import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    MessageSquare,
    Video,
    Settings,
    ArrowLeft,
    ClipboardList,
    Kanban,
    Zap,
    BarChart2,
    FolderKanban,
    Plus,
} from 'lucide-react';
import { WorkspaceRoleEnum } from '@/shared/enums/WorkspaceRolesEnum';
import { Logo } from '@/components/common/Logo';
import {
    NavItem,
    NavSection,
    ExpandableNavItem,
    CollapsibleProjectList,
    ProjectChip,
    SidebarDivider,
} from './sidebar/SidebarPrimitives';
import type { SidebarMode, Project } from '../types/sidebar.types';

export interface SidebarProps {
    mode: SidebarMode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    selectedProject: Project | null;
    projects: Project[];
    onSelectProject: (project: Project) => void;
    onCreateProject?: () => void;
    canCreateProject?: boolean;
    onBackToWorkspace: () => void;
    role: WorkspaceRoleEnum | null;
}

export const Sidebar = ({
    mode,
    activeTab,
    onTabChange,
    isCollapsed,
    onToggle,
    isMobileOpen,
    onCloseMobile,
    selectedProject,
    projects,
    onSelectProject,
    onCreateProject,
    canCreateProject,
    onBackToWorkspace,
    role,
}: SidebarProps) => {
    const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCloseMobile}
                        className="lg:hidden fixed inset-0 bg-[#060d1a]/80 backdrop-blur-sm z-40 transition-opacity"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                animate={{ width: isCollapsed ? 72 : 232 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`h-screen flex flex-col bg-[#060d1a] lg:sticky top-0 left-0 z-50 overflow-hidden flex-shrink-0 transition-transform duration-300 ease-in-out fixed lg:translate-x-0 border-r border-white/5 lg:border-none shadow-2xl lg:shadow-none
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
            {/* Logo */}
            <div className={`pt-6 pb-4 flex-shrink-0 ${isCollapsed ? 'px-4' : 'px-5'}`}>
                <Logo
                    showText={!isCollapsed}
                    onClick={onToggle}
                    className={`cursor-pointer group transition-all ${isCollapsed ? 'justify-center' : ''}`}
                    iconClassName="bg-[#A5D7E8] text-[#0B2447] shadow-[0_0_16px_rgba(165,215,232,0.15)] group-hover:scale-105 transition-transform"
                    textClassName="text-white text-base tracking-tight font-bold"
                />
            </div>

            <SidebarDivider />

            {/* Dynamic Nav Content */}
            <div className={`flex-1 overflow-y-auto no-scrollbar ${isCollapsed ? 'px-3' : 'px-4'} pb-4`}>
                <AnimatePresence mode="wait">
                    {mode === 'workspace' ? (
                        <WorkspaceNav
                            key="workspace-nav"
                            activeTab={activeTab}
                            isCollapsed={isCollapsed}
                            onTabChange={onTabChange}
                            projects={projects}
                            isProjectsExpanded={isProjectsExpanded}
                            onToggleProjects={() => setIsProjectsExpanded(v => !v)}
                            onSelectProject={onSelectProject}
                            onCreateProject={onCreateProject}
                            canCreateProject={canCreateProject}
                        />
                    ) : (
                        <ProjectNav
                            key="project-nav"
                            activeTab={activeTab}
                            isCollapsed={isCollapsed}
                            onTabChange={onTabChange}
                            project={selectedProject}
                            onBack={onBackToWorkspace}
                            role={role}
                        />
                    )}
                </AnimatePresence>
            </div>
            </motion.aside>
        </>
    );
};

// ─── WorkspaceNav ─────────────────────────────────────────────────────────────

interface WorkspaceNavProps {
    activeTab: string;
    isCollapsed: boolean;
    onTabChange: (tab: string) => void;
    projects: Project[];
    isProjectsExpanded: boolean;
    onToggleProjects: () => void;
    onSelectProject: (project: Project) => void;
    onCreateProject?: () => void;
    canCreateProject?: boolean;
}

const WorkspaceNav = ({
    activeTab,
    isCollapsed,
    onTabChange,
    projects,
    isProjectsExpanded,
    onToggleProjects,
    onSelectProject,
    onCreateProject,
    canCreateProject,
}: WorkspaceNavProps) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-0.5 pt-1"
    >
        {/* Monitor */}
        <NavSection label="Monitor" isCollapsed={isCollapsed}>
            <NavItem
                id="dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
                isActive={activeTab === 'dashboard'}
                isCollapsed={isCollapsed}
                onClick={() => onTabChange('dashboard')}
            />
        </NavSection>

        {/* Work */}
        <NavSection label="Work" isCollapsed={isCollapsed}>
            <ExpandableNavItem
                icon={Briefcase}
                label="Projects"
                isExpanded={isProjectsExpanded}
                isCollapsed={isCollapsed}
                onToggle={onToggleProjects}
            >
                <CollapsibleProjectList isOpen={isProjectsExpanded}>
                    {projects.map(project => (
                        <ProjectChip
                            key={project.id}
                            name={project.name}
                            color={project.color}
                            keyCode={project.key}
                            onClick={() => onSelectProject(project)}
                        />
                    ))}
                    {canCreateProject && (
                        <button
                            onClick={onCreateProject}
                            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all group text-left text-[#576CBC]/60 hover:text-[#A5D7E8] hover:bg-[#A5D7E8]/10 mt-1"
                        >
                            <Plus size={14} className="opacity-70 group-hover:opacity-100 flex-shrink-0" />
                            <span className="text-[13px] font-medium truncate flex-1">Create project</span>
                        </button>
                    )}
                </CollapsibleProjectList>
            </ExpandableNavItem>

            <NavItem
                id="team"
                icon={Users}
                label="Team"
                isActive={activeTab === 'team'}
                isCollapsed={isCollapsed}
                onClick={() => onTabChange('team')}
            />
        </NavSection>

        {/* Communicate */}
        <NavSection label="Communicate" isCollapsed={isCollapsed}>
            <NavItem
                id="chat"
                icon={MessageSquare}
                label="Inbox"
                isActive={activeTab === 'chat'}
                isCollapsed={isCollapsed}
                onClick={() => onTabChange('chat')}
            />
            <NavItem
                id="meetings"
                icon={Video}
                label="Meetings"
                isActive={activeTab === 'meetings'}
                isCollapsed={isCollapsed}
                onClick={() => onTabChange('meetings')}
            />
        </NavSection>

        <SidebarDivider />

        {/* Config */}
        <NavItem
            id="settings"
            icon={Settings}
            label="Settings"
            isActive={activeTab === 'settings'}
            isCollapsed={isCollapsed}
            onClick={() => onTabChange('settings')}
        />
    </motion.div>
);

// ─── ProjectNav ───────────────────────────────────────────────────────────────

interface ProjectNavProps {
    activeTab: string;
    isCollapsed: boolean;
    onTabChange: (tab: string) => void;
    project: Project | null;
    onBack: () => void;
    role: WorkspaceRoleEnum | null;
}

const PROJECT_NAV_ITEMS = [
    { id: 'overview', icon: FolderKanban, label: 'Overview' },
    { id: 'backlogs', icon: ClipboardList, label: 'Backlogs' },
    { id: 'board', icon: Kanban, label: 'Board' },
    { id: 'sprint', icon: Zap, label: 'Sprint' },
    { id: 'sprint-performance', icon: BarChart2, label: 'Performance' },
    { id: 'project-team', icon: Users, label: 'Team' },
] as const;

const ProjectNav = ({ activeTab, isCollapsed, onTabChange, project, onBack, role }: ProjectNavProps) => {
    const isMemberOrViewer = role === WorkspaceRoleEnum.WORKSPACE_MEMBER || role === WorkspaceRoleEnum.WORKSPACE_VIEWER;
    const restrictedTabs = ['backlogs', 'sprint', 'sprint-performance'];
    
    const visibleNavItems = PROJECT_NAV_ITEMS.filter(item => {
        if (isMemberOrViewer && restrictedTabs.includes(item.id)) return false;
        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="pt-1"
        >
            {/* Back button */}
            <button
                onClick={onBack}
                className={`w-full flex items-center gap-2 h-9 rounded-xl px-3 mb-1
                    text-[#576CBC]/60 hover:text-white hover:bg-white/5 transition-all group
                    ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
                <ArrowLeft size={14} className="opacity-60 group-hover:opacity-100 flex-shrink-0" />
                {!isCollapsed && (
                    <span className="text-[12px] font-medium">Back to menu</span>
                )}
            </button>

            {/* Project identity header */}
            {!isCollapsed && project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2.5 px-3 py-3 mb-1"
                >
                    <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-[#060d1a] flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                    >
                        {project.key}
                    </div>
                    <span className="text-[13px] font-semibold text-white truncate">
                        {project.name}
                    </span>
                </motion.div>
            )}

            <SidebarDivider />

            {/* Project nav items */}
            <div className="space-y-0.5 pt-1">
                {visibleNavItems.map(item => (
                    <NavItem
                        key={item.id}
                        id={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeTab === item.id}
                        isCollapsed={isCollapsed}
                        onClick={() => onTabChange(item.id)}
                    />
                ))}
            </div>
        </motion.div>
    );
};
