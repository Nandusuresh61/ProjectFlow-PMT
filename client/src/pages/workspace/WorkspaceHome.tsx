import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthUserState } from '@/store/auth.store';
import { logoutUser } from '@/services/auth/auth.api';
import { getMembers } from '@/services/workspace/team.api';
import { useWorkspaceStore } from '@/store/workspace.store';
import { getWorkspaceProjects } from '@/services/project/project.api';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { DashboardView } from './views/dashboard/DashboardView';
import { TeamView } from './views/team/TeamView';
import { SettingsView } from './views/settings/SettingsView';
import { ChatView } from './views/chat/ChatView';
import { MeetingsView } from './views/meetings/MeetingsView';
import { InviteModal } from './components/workspace/InviteModal';
import { CreateWorkspaceModal } from './components/workspace/CreateWorkspaceModal';
import { CreateProjectModal } from './views/project/components/project/CreateProjectModal';
import { EditProjectModal } from './views/project/components/project/EditProjectModal';
import { ProjectOverviewView } from './views/project/ProjectOverviewView';
import { ProjectBacklogView } from './views/project/ProjectBacklogView';
import { ProjectBoardView } from './views/project/ProjectBoardView';
import { ProjectSprintView } from './views/project/ProjectSprintView';
import { ProjectSprintPerformanceView } from './views/project/ProjectSprintPerformanceView';
import { ProjectTeamView } from './views/project/ProjectTeamView';
import type { SidebarMode, Project } from './types/sidebar.types';
import { WorkspaceRoleEnum } from '@/shared/enums/WorkspaceRolesEnum';
import { AppMessages } from '@/shared/messages/AppMessages';

const WORKSPACE_TABS = ['dashboard', 'team', 'chat', 'meetings', 'settings'] as const;
const PROJECT_TABS = ['overview', 'backlogs', 'board', 'sprint', 'sprint-performance', 'project-team'] as const;

const PROJECT_COLORS = ['#A5D7E8', '#7C9AC7', '#576CBC', '#9DB2BF', '#64B6AC', '#D0E7FF'];

interface ContentRouterProps {
    mode: SidebarMode;
    activeTab: string;
    selectedProject: Project | null;
    openInvite: () => void;
    openEditProject: () => void;
    canManageProjects: boolean;
}

const ContentRouter = ({ mode, activeTab, selectedProject, openInvite, openEditProject, canManageProjects }: ContentRouterProps) => {
    if (mode === 'project' && selectedProject) {
        switch (activeTab) {
            case 'overview': return <ProjectOverviewView project={selectedProject} onEditProject={openEditProject} canEditProject={canManageProjects} />;
            case 'backlogs': return <ProjectBacklogView project={selectedProject} />;
            case 'board': return <ProjectBoardView project={selectedProject} />;
            case 'sprint': return <ProjectSprintView project={selectedProject} />;
            case 'sprint-performance': return <ProjectSprintPerformanceView project={selectedProject} />;
            case 'project-team': return <ProjectTeamView project={selectedProject} openInvite={openInvite} />;
            default: return <ProjectOverviewView project={selectedProject} onEditProject={openEditProject} canEditProject={canManageProjects} />;
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

export default function WorkspaceHome() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [currentWorkspaceRole, setCurrentWorkspaceRole] = useState<WorkspaceRoleEnum | null>(null);

    const user = AuthUserState(state => state.user);
    const clearUser = AuthUserState(state => state.clearUser);
    const { fetchWorkspaces, currentWorkspace, workspaces } = useWorkspaceStore();

    const homePath = location.pathname.replace(/^\/home\/?/, '');
    const pathSegments = homePath ? homePath.split('/').filter(Boolean) : [];
    const isProjectRoute = pathSegments[0] === 'project' && Boolean(pathSegments[1]);
    const routeProjectId = isProjectRoute ? pathSegments[1] : null;
    const projectTabSegment = isProjectRoute ? pathSegments[2] : null;
    const workspaceTabSegment = !isProjectRoute ? pathSegments[0] : null;

    const sidebarMode: SidebarMode = isProjectRoute ? 'project' : 'workspace';
    const activeTab = isProjectRoute
        ? (PROJECT_TABS.includes((projectTabSegment ?? 'overview') as typeof PROJECT_TABS[number])
            ? (projectTabSegment ?? 'overview')
            : 'overview')
        : (WORKSPACE_TABS.includes((workspaceTabSegment ?? 'dashboard') as typeof WORKSPACE_TABS[number])
            ? (workspaceTabSegment ?? 'dashboard')
            : 'dashboard');

    useEffect(() => { fetchWorkspaces(); }, [fetchWorkspaces]);

    useEffect(() => {
        if (location.pathname === '/home' || location.pathname === '/home/') {
            navigate('/home/dashboard', { replace: true });
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        const loadCurrentWorkspaceRole = async () => {
            if (!currentWorkspace?.workspaceId || !user?.userId) {
                setCurrentWorkspaceRole(null);
                return;
            }

            if (currentWorkspace.ownerId === user.userId) {
                setCurrentWorkspaceRole(WorkspaceRoleEnum.WORKSPACE_OWNER);
                return;
            }

            try {
                const response = await getMembers(currentWorkspace.workspaceId);
                const currentMember = (response.data ?? []).find(
                    (member: { userId: string; role: WorkspaceRoleEnum }) => member.userId === user.userId
                );
                setCurrentWorkspaceRole(currentMember?.role ?? null);
            } catch (error) {
                console.error('Failed to fetch workspace role', error);
                setCurrentWorkspaceRole(null);
            }
        };

        loadCurrentWorkspaceRole();
    }, [currentWorkspace?.workspaceId, currentWorkspace?.ownerId, user?.userId]);

    const loadProjects = async () => {
        if (!currentWorkspace?.workspaceId) {
            setProjects([]);
            setSelectedProject(null);
            if (sidebarMode === 'project') {
                navigate('/home/dashboard', { replace: true });
            }
            return;
        }

        try {
            const response = await getWorkspaceProjects(currentWorkspace.workspaceId);
            const mappedProjects = (response.data ?? []).map((project, index) => ({
                id: project.projectId,
                name: project.name,
                color: PROJECT_COLORS[index % PROJECT_COLORS.length],
                key: project.projectKey,
                description: project.description,
                workspaceId: project.workspaceId,
                createdBy: project.createdBy,
                memberIds: project.memberIds,
                status: project.status,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            }));
            setProjects(mappedProjects);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            setProjects([]);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [currentWorkspace?.workspaceId, sidebarMode]);

    useEffect(() => {
        if (!routeProjectId) {
            setSelectedProject(null);
            return;
        }

        const matchedProject = projects.find((project) => project.id === routeProjectId) ?? null;
        setSelectedProject(matchedProject);

        if (routeProjectId && projects.length > 0 && !matchedProject) {
            navigate('/home/dashboard', { replace: true });
        }
    }, [routeProjectId, projects, navigate]);

    useEffect(() => {
        if (isProjectRoute && projectTabSegment && !PROJECT_TABS.includes(projectTabSegment as typeof PROJECT_TABS[number])) {
            navigate(`/home/project/${routeProjectId}/overview`, { replace: true });
        }

        if (!isProjectRoute && workspaceTabSegment && !WORKSPACE_TABS.includes(workspaceTabSegment as typeof WORKSPACE_TABS[number])) {
            navigate('/home/dashboard', { replace: true });
        }
    }, [isProjectRoute, projectTabSegment, workspaceTabSegment, navigate, routeProjectId]);

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        navigate(`/home/project/${project.id}/overview`);
    };

    const handleBackToWorkspace = () => {
        setSelectedProject(null);
        navigate('/home/dashboard');
    };

    const handleTabChange = (tab: string) => {
        if (tab === 'projects' && sidebarMode === 'workspace') {
            setIsMobileSidebarOpen(true);
            return;
        }

        if (sidebarMode === 'project' && selectedProject) {
            navigate(`/home/project/${selectedProject.id}/${tab}`);
            return;
        }

        navigate(`/home/${tab}`);
    };

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

    const canManageProjects =
        Boolean(user?.isSuperAdmin) ||
        currentWorkspaceRole === WorkspaceRoleEnum.WORKSPACE_OWNER ||
        currentWorkspaceRole === WorkspaceRoleEnum.WORKSPACE_ADMIN;

    return (
        <div className="flex h-screen w-full bg-[#060d1a] font-sans text-white selection:bg-[#A5D7E8]/30 selection:text-white overflow-hidden">
            <BackgroundAtmosphere />

            <Sidebar
                mode={sidebarMode}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(v => !v)}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                selectedProject={selectedProject}
                projects={projects}
                onSelectProject={handleSelectProject}
                canCreateProject={canManageProjects}
                onCreateProject={() => setIsCreateProjectModalOpen(true)}
                onBackToWorkspace={handleBackToWorkspace}
            />

            <main className="flex-1 flex flex-col min-w-0 relative h-full">
                <Header
                    activeTab={activeTab}
                    mode={sidebarMode}
                    selectedProject={selectedProject}
                    user={user}
                    onLogout={handleLogout}
                    onOpenCreateWorkspace={() => {
                        const hasOwnedWorkspace = workspaces.some(ws => ws.ownerId === user?.userId);
                        if (hasOwnedWorkspace) {
                            toast.error(AppMessages.WORKSPACE_ALREADY_OWNED);
                            return;
                        }
                        setIsCreateWorkspaceModalOpen(true);
                    }}
                    onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
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
                                    openEditProject={() => setIsEditProjectModalOpen(true)}
                                    canManageProjects={canManageProjects}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <MobileNav activeTab={activeTab} onTabChange={handleTabChange} mode={sidebarMode} />

            <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
            <CreateProjectModal
                isOpen={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
                onCreated={loadProjects}
            />
            <EditProjectModal
                isOpen={isEditProjectModalOpen}
                onClose={() => setIsEditProjectModalOpen(false)}
                project={selectedProject}
                onUpdated={loadProjects}
            />
            <CreateWorkspaceModal isOpen={isCreateWorkspaceModalOpen} onClose={() => setIsCreateWorkspaceModalOpen(false)} />
        </div>
    );
}
