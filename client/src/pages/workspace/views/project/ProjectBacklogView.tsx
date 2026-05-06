import type { IssueData, SprintData } from "@/services/sprint/sprint.api";
import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, ChevronLeft, ChevronRight, PackagePlus, Trophy, Paperclip, ChevronDown } from 'lucide-react';
import type { Project } from '../../types/sidebar.types';
import { IssueDetailModal } from './components/issue/IssueDetailModal';
import { SprintSection } from './components/sprint/SprintSection';
import { SprintCreationModal } from './components/sprint/SprintCreationModal';
import { StartSprintModal } from './components/sprint/StartSprintModal';
import { EditSprintModal } from './components/sprint/EditSprintModal';
import { IssueTypeIcon } from './components/issue/IssueTypeIcon';
import { getProjectIssues } from '@/services/issue/issue.api';
import { getProjectSprints, assignIssueToSprint } from '@/services/sprint/sprint.api';
import { getMembers } from '@/services/workspace/team.api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import IssueCreationModal from './components/issue/IssueCreationModal';
import { getErrorMessage } from "@/shared/utils/error";

interface ProjectBacklogViewProps {
    project: Project;
    canManage: boolean;
}

const priorityDot: Record<string, string> = {
    HIGH: 'bg-rose-500',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-emerald-400',
};

export const ProjectBacklogView = ({ project, canManage }: ProjectBacklogViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [editingIssue, setEditingIssue] = useState<IssueData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [issues, setIssues] = useState<IssueData[]>([]);
    const [sprints, setSprints] = useState<SprintData[]>([]);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [isStartSprintModalOpen, setIsStartSprintModalOpen] = useState(false);
    const [activeSprintToStart, setActiveSprintToStart] = useState<SprintData | null>(null);
    const [isEditSprintModalOpen, setIsEditSprintModalOpen] = useState(false);
    const [editingSprint, setEditingSprint] = useState<SprintData | null>(null);
    const [backlogIsOver, setBacklogIsOver] = useState(false);

    const [membersMap, setMembersMap] = useState<Record<string, { userId: string, fullName: string, profileImage: string, role: string }>>({});
    const [allStories, setAllStories] = useState<IssueData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set());
    const [tasksMap, setTasksMap] = useState<Record<string, IssueData[]>>({});
    const [loadingTasks, setLoadingTasks] = useState<Set<string>>(new Set());

    const [parentStoryIdForTask, setParentStoryIdForTask] = useState<string | undefined>(undefined);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalIssues, setTotalIssues] = useState(0);
    const itemsPerPage = 10;

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchIssues = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await getProjectIssues(project.id, {
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch,
                parentId: "null"
            });
            if (res.data) {
                setIssues(res.data.issues || []);
                setTotalIssues(res.data.total || 0);
            }
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || "Failed to load issues");
        } finally {
            setIsLoading(false);
        }
    }, [project.id, currentPage, debouncedSearch, itemsPerPage]);

    const fetchTasksForStory = async (storyId: string) => {
        if (loadingTasks.has(storyId)) return;

        setLoadingTasks(prev => new Set(prev).add(storyId));
        try {
            const res = await getProjectIssues(project.id, {
                parentId: storyId,
                limit: 100 // Assume a story doesn't have more than 100 tasks for now
            });
            if (res.data) {
                setTasksMap(prev => ({ ...prev, [storyId]: res.data!.issues }));
            }
        } catch (error) {
            console.error("Failed to fetch tasks for story:", storyId, error);
        } finally {
            setLoadingTasks(prev => {
                const next = new Set(prev);
                next.delete(storyId);
                return next;
            });
        }
    };

    const toggleStory = (storyId: string) => {
        setExpandedStories(prev => {
            const next = new Set(prev);
            if (next.has(storyId)) {
                next.delete(storyId);
            } else {
                next.add(storyId);
                if (!tasksMap[storyId]) {
                    fetchTasksForStory(storyId);
                }
            }
            return next;
        });
    };

    const fetchSprints = useCallback(async () => {
        try {
            const res = await getProjectSprints(project.id);
            if (res.data) {
                setSprints(res.data);
            }
        } catch (error: unknown) {
            console.error("Failed to fetch sprints:", error);
        }
    }, [project.id]);

    const fetchStories = useCallback(async () => {
        try {
            const res = await getProjectIssues(project.id, { limit: 100, type: "STORY" });
            if (res.data?.issues) {
                setAllStories(res.data.issues);
            }
        } catch (error: unknown) {
            console.error("Failed to fetch stories for lookup:", error);
        }
    }, [project.id]);

    const totalPages = Math.ceil(totalIssues / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        fetchIssues();
        fetchSprints();
        fetchStories();
    }, [fetchIssues, fetchSprints, fetchStories]);

    useEffect(() => {
        if (selectedIssue) {
            const updated = issues.find(i => i.issueId === selectedIssue.issueId);
            if (updated) {
                setSelectedIssue(updated);
            }
        }
    }, [issues]);

    useEffect(() => {
        if (project.workspaceId) {
            getMembers(project.workspaceId).then(res => {
                if (res?.data) {
                    const map: Record<string, { userId: string, fullName: string, profileImage: string, role: string }> = {};
                    res.data.forEach((m: { userId: string, role: string, fullName: string, profileImage: string }) => {
                        map[m.userId] = m;
                    });
                    setMembersMap(map);
                }
            }).catch(() => { });
        }
    }, [project.workspaceId]);

    const handleIssueCreated = () => {
        setIsModalOpen(false);
        setIsTaskModalOpen(false);
        setParentStoryIdForTask(undefined);
        fetchIssues();
        fetchStories();
        setTasksMap({}); 
    };

    const handleIssueUpdated = () => {
        setIsEditModalOpen(false);
        setEditingIssue(null);
        fetchIssues();
        fetchStories();
        setTasksMap({});
    };

    const handleSprintCreated = (newSprint: SprintData) => {
        setSprints(prev => [...prev, newSprint]);
    };

    const handleSprintStarted = (updatedSprint: SprintData) => {
        setSprints(prev => prev.map(s => s.sprintId === updatedSprint.sprintId ? updatedSprint : s));
    };

    const handleSprintUpdated = (updatedSprint: SprintData) => {
        setSprints(prev => prev.map(s => s.sprintId === updatedSprint.sprintId ? updatedSprint : s));
        fetchIssues();
    };

    const handleIssueDrop = async (issueId: string, targetSprintId: string | null) => {
        const issue = issues.find(i => i.issueId === issueId);
        if (!issue) return;

        const sourceSprintId = issue.sprintId;
        const sourceSprint = sourceSprintId ? sprints.find(s => s.sprintId === sourceSprintId) : null;
        const targetSprint = targetSprintId ? sprints.find(s => s.sprintId === targetSprintId) : null;

        if (sourceSprint?.status === 'COMPLETED') {
            toast.error("Cannot move issues out of a completed sprint");
            return;
        }

        if (targetSprint?.status === 'COMPLETED') {
            toast.error("Cannot move issues into a completed sprint");
            return;
        }

        const previousIssues = [...issues];
        setIssues(prev => prev.map(i => {
            if (i.issueId === issueId) {
                return { ...i, sprintId: targetSprintId };
            }
            return i;
        }));

        const targetName = targetSprintId
            ? targetSprint?.name || 'Sprint'
            : 'Backlog';

        try {
            const res = await assignIssueToSprint(issueId, targetSprintId);
            if (res.success) {
                toast.success(`Issue moved to ${targetName}`);
                fetchIssues(); // Refresh to get updated status and other fields
            } else {
                throw new Error(res.message);
            }
        } catch (error: unknown) {
            // Rollback
            setIssues(previousIssues);
            toast.error(getErrorMessage(error) || `Failed to move issue to ${targetName}`);
        }
    };

    const getAssigneeInitials = (assigneeId: string) => {
        if (!assigneeId) return '--';
        const member = membersMap[assigneeId];
        if (!member) return '--';
        return member.fullName.substring(0, 2).toUpperCase();
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Project Backlogs</h1>
                    <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · {issues.length} issues total</p>
                </div>
                {canManage && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSprintModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.1] text-white text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-all"
                        >
                            <PackagePlus size={15} className="text-[#A5D7E8]" />
                            Create Sprint
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#A5D7E8] text-[#060d1a] text-sm font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(165,215,232,0.15)]"
                        >
                            <Plus size={15} />
                            Add Issue
                        </button>
                    </div>
                )}
            </div>

            {sprints.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Trophy size={16} className="text-amber-400" />
                        <h2 className="text-sm font-black text-white/40 uppercase tracking-widest">Planned Sprints</h2>
                    </div>
                    {sprints.map(sprint => (
                        <SprintSection
                            key={sprint.sprintId}
                            sprint={sprint}
                            issues={issues.filter(i => i.sprintId === sprint.sprintId)}
                            onIssueDrop={handleIssueDrop}
                            onIssueClick={(issue) => {
                                setSelectedIssue(issue);
                                setIsDetailModalOpen(true);
                            }}
                            onEditIssue={(issue) => {
                                setEditingIssue(issue);
                                setIsEditModalOpen(true);
                            }}
                            onStart={canManage ? (s) => {
                                setActiveSprintToStart(s);
                                setIsStartSprintModalOpen(true);
                            } : undefined}
                            onEdit={canManage ? (s) => {
                                setEditingSprint(s);
                                setIsEditSprintModalOpen(true);
                            } : undefined}
                            onAddTask={(storyId) => {
                                setParentStoryIdForTask(storyId);
                                setIsTaskModalOpen(true);
                            }}
                            membersMap={membersMap}
                            canManage={canManage}
                            tasksMap={tasksMap}
                            loadingTasks={loadingTasks}
                            onToggleStory={toggleStory}
                            expandedStories={expandedStories}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-1">
                    <h2 className="text-sm font-black text-white/40 uppercase tracking-widest">Backlog</h2>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">
                        {issues.filter(i => !i.sprintId).length}
                    </span>
                </div>
                <div className="relative flex-1 max-w-xs">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                        type="text"
                        placeholder="Search backlog..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.04] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.07] transition-colors"
                    />
                </div>
            </div>

            <div
                className={cn(
                    "bg-white/[0.025] rounded-2xl overflow-hidden border border-transparent transition-all",
                    backlogIsOver && "border-[#A5D7E8]/30 bg-[#A5D7E8]/[0.02]"
                )}
                onDragOver={(e) => { e.preventDefault(); setBacklogIsOver(true); }}
                onDragLeave={() => setBacklogIsOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setBacklogIsOver(false);
                    const issueId = e.dataTransfer.getData('issueId');
                    if (issueId) handleIssueDrop(issueId, null);
                }}
            >
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
                    <span className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Issue</span>
                    <span className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Priority</span>
                    <span className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Assignee</span>
                    <span className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Est.</span>
                    <span className="w-8"></span>
                </div>
                <div className="divide-y divide-white/[0.03]">
                    {isLoading ? (
                        <div className="px-5 py-8 text-center text-[#576CBC]/60 text-sm">Loading issues...</div>
                    ) : issues.filter(i => !i.sprintId).length === 0 ? (
                        <div className="px-5 py-8 text-center text-[#576CBC]/60 text-sm">No issues in backlog.</div>
                    ) : (
                        issues.filter(i => !i.sprintId).map(issue => {
                            const isExpanded = expandedStories.has(issue.issueId);
                            const tasks = tasksMap[issue.issueId] || [];
                            const isLoadingTasks = loadingTasks.has(issue.issueId);

                            return (
                                <div key={issue.issueId} className="flex flex-col">
                                    <div
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData('issueId', issue.issueId);
                                            e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        onClick={() => {
                                            if (issue.type === 'STORY') {
                                                toggleStory(issue.issueId);
                                            }
                                        }}
                                        className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4.5 hover:bg-white/[0.025] transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            {issue.type === 'STORY' && (
                                                <div className="text-white/20 group-hover:text-[#A5D7E8] transition-colors">
                                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                </div>
                                            )}
                                            <IssueTypeIcon type={issue.type} size={18} className="flex-shrink-0" />
                                            <span className="text-xs font-mono text-white/25 flex-shrink-0">{issue.issueKey}</span>
                                            <span className="text-base text-white/90 group-hover:text-white transition-colors truncate font-medium">{issue.title}</span>
                                            {(issue.attachments?.length || 0) > 0 && (
                                                <div className="flex items-center gap-1 text-[10px] text-white/20 font-bold ml-1.5 px-1.5 py-0.5 rounded bg-white/[0.03]">
                                                    <Paperclip size={10} className="text-[#A5D7E8]/60" />
                                                    <span>{issue.attachments?.length}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${priorityDot[issue.priority] || 'bg-gray-400'}`} />
                                            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{issue.priority}</span>
                                        </div>
                                        <div className="w-7 h-7 rounded-full bg-[#19376D] flex items-center justify-center text-[10px] font-black text-[#A5D7E8] border border-[#A5D7E8]/10">
                                            {getAssigneeInitials(issue.assigneeId || "")}
                                        </div>
                                        <span className="text-xs text-white/30 text-right w-8 font-mono">{issue.sizeLabel || '--'}</span>
                                        <div className="flex items-center justify-end gap-2 pr-2">
                                            <button
                                                className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-[#A5D7E8]/5 hover:bg-[#A5D7E8]/10 text-[10px] font-black text-[#A5D7E8] uppercase tracking-wider rounded-lg transition-all border border-[#A5D7E8]/10 hover:border-[#A5D7E8]/30"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedIssue(issue);
                                                    setIsDetailModalOpen(true);
                                                }}
                                            >
                                                View
                                            </button>
                                            {canManage && (
                                                <button
                                                    className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-black text-white/60 hover:text-white uppercase tracking-wider rounded-lg transition-all border border-white/5 hover:border-white/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingIssue(issue);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && issue.type === 'STORY' && (
                                        <div className="bg-black/20 border-l-2 border-[#19376D] ml-10 mb-3 rounded-r-xl overflow-hidden">
                                            {isLoadingTasks ? (
                                                <div className="px-6 py-4 text-xs text-white/20 italic flex items-center gap-2">
                                                    <div className="w-3 h-3 border-2 border-[#A5D7E8]/20 border-t-[#A5D7E8] rounded-full animate-spin" />
                                                    Loading tasks...
                                                </div>
                                            ) : (
                                                <>
                                                    {tasks.length > 0 && tasks.map(task => (
                                                        <div
                                                            key={task.issueId}
                                                            className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-3.5 hover:bg-white/[0.03] transition-colors group border-b border-white/[0.02] last:border-0"
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <IssueTypeIcon type={task.type} size={14} className="text-[#A5D7E8]" />
                                                                <span className="text-[10px] font-mono text-white/40">{task.issueKey}</span>
                                                                <span className="text-sm text-white/90 group-hover:text-white transition-colors truncate font-medium">{task.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority] || 'bg-gray-400'}`} />
                                                                <span className="text-[10px] text-white/50 uppercase font-bold tracking-tight">{task.priority}</span>
                                                            </div>
                                                            <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8] border border-[#A5D7E8]/10 shadow-sm">
                                                                {getAssigneeInitials(task.assigneeId || "")}
                                                            </div>
                                                            <span className="text-[10px] text-white/30 text-right w-8 font-mono">--</span>
                                                            <div className="flex items-center justify-end gap-2 pr-2">
                                                                <button
                                                                    className="opacity-0 group-hover:opacity-100 px-2.5 py-1 bg-[#A5D7E8]/10 hover:bg-[#A5D7E8]/20 text-[9px] font-black text-[#A5D7E8] uppercase tracking-wider rounded-md transition-all border border-[#A5D7E8]/20"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedIssue(task);
                                                                        setIsDetailModalOpen(true);
                                                                    }}
                                                                >
                                                                    View
                                                                </button>
                                                                {canManage && (
                                                                    <button
                                                                        className="opacity-0 group-hover:opacity-100 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-black text-white/60 hover:text-white uppercase tracking-wider rounded-md transition-all border border-white/10"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingIssue(task);
                                                                            setIsEditModalOpen(true);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {canManage && (
                                                        <div className="px-6 py-3 bg-white/[0.01] border-t border-white/[0.03]">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setParentStoryIdForTask(issue.issueId);
                                                                    setIsTaskModalOpen(true);
                                                                }}
                                                                className="flex items-center gap-2 text-xs font-bold text-[#A5D7E8]/60 hover:text-[#A5D7E8] transition-all group/add"
                                                            >
                                                                <div className="p-1 rounded-md bg-[#A5D7E8]/5 group-hover/add:bg-[#A5D7E8]/10 transition-colors">
                                                                    <Plus size={12} />
                                                                </div>
                                                                Add Task to Story
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {totalIssues > 0 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.05] bg-white/[0.01]">
                        <div className="text-xs text-white/40">
                            Showing <span className="text-white/80">{startIndex + 1}</span> to <span className="text-white/80">{Math.min(startIndex + itemsPerPage, totalIssues)}</span> of <span className="text-white/80 font-bold">{totalIssues}</span> items
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeft size={14} />
                                Prev
                            </button>
                            <span className="text-xs font-bold text-[#A5D7E8] bg-[#19376D]/30 px-3 py-1.5 rounded-lg border border-[#A5D7E8]/20">
                                {currentPage} / {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.03] text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                Next
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <IssueCreationModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                project={project}
                onSuccess={handleIssueCreated}
            />

            <IssueCreationModal
                open={isTaskModalOpen}
                onOpenChange={(open) => {
                    setIsTaskModalOpen(open);
                    if (!open) setParentStoryIdForTask(undefined);
                }}
                project={project}
                onSuccess={handleIssueCreated}
                parentStoryId={parentStoryIdForTask}
            />

            <IssueCreationModal
                open={isEditModalOpen}
                onOpenChange={(open) => {
                    setIsEditModalOpen(open);
                    if (!open) setTimeout(() => setEditingIssue(null), 300);
                }}
                project={project}
                onSuccess={handleIssueUpdated}
                editIssue={editingIssue}
            />

            <IssueDetailModal
                open={isDetailModalOpen}
                onOpenChange={(open) => {
                    setIsDetailModalOpen(open);
                    if (!open) setTimeout(() => setSelectedIssue(null), 300);
                }}
                issue={selectedIssue}
                membersMap={membersMap}
                sprintsMap={Object.fromEntries(sprints.map(s => [s.sprintId, s]))}
                issuesMap={{
                    ...Object.fromEntries(allStories.map(i => [i.issueId, i])),
                    ...Object.fromEntries(issues.map(i => [i.issueId, i])),
                    ...Object.fromEntries(Object.values(tasksMap).flat().map(i => [i.issueId, i]))
                }}
                onUpdate={() => {
                    fetchIssues();
                    fetchSprints();
                    fetchStories();
                }}
            />

            <SprintCreationModal
                open={isSprintModalOpen}
                onOpenChange={setIsSprintModalOpen}
                projectId={project.id}
                workspaceId={project.workspaceId}
                onSuccess={handleSprintCreated}
            />

            <StartSprintModal
                open={isStartSprintModalOpen}
                onOpenChange={setIsStartSprintModalOpen}
                sprint={activeSprintToStart}
                workspaceId={project.workspaceId}
                onSuccess={handleSprintStarted}
            />

            <EditSprintModal
                open={isEditSprintModalOpen}
                onOpenChange={(open) => {
                    setIsEditSprintModalOpen(open);
                    if (!open) setTimeout(() => setEditingSprint(null), 300);
                }}
                sprint={editingSprint}
                workspaceId={project.workspaceId}
                onSuccess={handleSprintUpdated}
            />
        </div>
    );
};
