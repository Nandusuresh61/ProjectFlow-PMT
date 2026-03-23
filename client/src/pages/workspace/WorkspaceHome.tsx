import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthUserState } from '@/store/auth.store';
import { logoutUser } from '@/services/auth/auth.api';
import { useWorkspaceStore } from '@/store/workspace.store';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './views/DashboardView';
import { TeamView } from './views/TeamView';
import { SettingsView } from './views/SettingsView';
import { ChatView } from './views/ChatView';
import { MeetingsView } from './views/MeetingsView';
import { InviteModal, CreateWorkspaceModal } from './views/ComplementaryViews';
import { ProjectOverviewView } from './views/project/ProjectOverviewView';
import { ProjectBacklogView } from './views/project/ProjectBacklogView';
import { ProjectBoardView } from './views/project/ProjectBoardView';
import { ProjectSprintView } from './views/project/ProjectSprintView';
import { ProjectSprintPerformanceView } from './views/project/ProjectSprintPerformanceView';
import { ProjectTeamView } from './views/project/ProjectTeamView';
import type { SidebarMode, Project } from './types/sidebar.types';

// ─── Mock Projects ─────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
    { id: '1', name: 'ProjectFlow PMT', color: '#A5D7E8', key: 'PF' },
    { id: '2', name: 'Marketing Site', color: '#7C9AC7', key: 'MS' },
    { id: '3', name: 'Mobile App', color: '#576CBC', key: 'MA' },
];

// ─── Content Router ───────────────────────────────────────────────────────────
interface ContentRouterProps {
    mode: SidebarMode;
    activeTab: string;
    selectedProject: Project | null;
    openInvite: () => void;
}

const ContentRouter = ({ mode, activeTab, selectedProject, openInvite }: ContentRouterProps) => {
    if (mode === 'project' && selectedProject) {
        switch (activeTab) {
            case 'overview': return <ProjectOverviewView project={selectedProject} />;
            case 'backlogs': return <ProjectBacklogView project={selectedProject} />;
            case 'board': return <ProjectBoardView project={selectedProject} />;
            case 'sprint': return <ProjectSprintView project={selectedProject} />;
            case 'sprint-performance': return <ProjectSprintPerformanceView project={selectedProject} />;
            case 'project-team': return <ProjectTeamView project={selectedProject} openInvite={openInvite} />;
            default: return <ProjectOverviewView project={selectedProject} />;
        }
    }

    switch (activeTab) {
        case 'dashboard': return <DashboardView openInvite={openInvite} />;
        case 'team': return <TeamView openInvite={openInvite} />;
        case 'chat': return <ChatView />;
        case 'meetings': return <MeetingsView />;
        case 'settings': return <SettingsView />;
        default: return <DashboardView openInvite={openInvite} />;
    }
};

// ─── WorkspaceHome ────────────────────────────────────────────────────────────
export default function WorkspaceHome() {
    const navigate = useNavigate();
    const [sidebarMode, setSidebarMode] = useState<SidebarMode>('workspace');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const user = AuthUserState(state => state.user);
    const clearUser = AuthUserState(state => state.clearUser);
    const { fetchWorkspaces } = useWorkspaceStore();

    useEffect(() => { fetchWorkspaces(); }, [fetchWorkspaces]);

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        setSidebarMode('project');
        setActiveTab('overview');
    };

    const handleBackToWorkspace = () => {
        setSidebarMode('workspace');
        setSelectedProject(null);
        setActiveTab('dashboard');
    };

    const handleTabChange = (tab: string) => setActiveTab(tab);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await logoutUser();
            toast.success(response.message || 'Logged out successfully');
            setTimeout(() => { clearUser(); navigate('/login'); }, 800);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to logout');
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#060d1a] font-sans text-white selection:bg-[#A5D7E8]/30 selection:text-white overflow-hidden">
            <BackgroundAtmosphere />

            <Sidebar
                mode={sidebarMode}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(v => !v)}
                selectedProject={selectedProject}
                projects={MOCK_PROJECTS}
                onSelectProject={handleSelectProject}
                onCreateProject={() => toast.info('Create Project feature coming soon!')}
                onBackToWorkspace={handleBackToWorkspace}
            />

            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                <Header
                    activeTab={activeTab}
                    mode={sidebarMode}
                    selectedProject={selectedProject}
                    user={user}
                    onLogout={handleLogout}
                    onOpenCreateWorkspace={() => setIsCreateWorkspaceModalOpen(true)}
                />
                {isLoggingOut && <div className="sr-only">Logging out…</div>}

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-8 pb-20 lg:pb-8 custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${sidebarMode}-${activeTab}`}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ContentRouter
                                    mode={sidebarMode}
                                    activeTab={activeTab}
                                    selectedProject={selectedProject}
                                    openInvite={() => setIsInviteModalOpen(true)}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />

            <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
            <CreateWorkspaceModal isOpen={isCreateWorkspaceModalOpen} onClose={() => setIsCreateWorkspaceModalOpen(false)} />
        </div>
    );
}
