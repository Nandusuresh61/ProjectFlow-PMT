import type { IssueData, SprintData } from "@/services/sprint/sprint.api";
import { useState, useEffect, useCallback } from 'react';
import { Plus, MoreHorizontal, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Project } from '../../types/sidebar.types';
import { getActiveSprint, type ActiveSprintData, getProjectSprints } from '@/services/sprint/sprint.api';
import { updateIssue, getProjectIssues } from '@/services/issue/issue.api';
import { getMembers } from '@/services/workspace/team.api';
import { IssueDetailModal } from './components/issue/IssueDetailModal';
import { CompleteSprintModal } from './components/CompleteSprintModal';

interface ProjectBoardViewProps {
    project: Project;
    canManage: boolean;
}

interface BoardCardData {
    id: string;
    issueKey: string;
    title: string;
    tag: string;
    tagColor: string;
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
    parentTitle?: string;
    parentKey?: string;
    parentId?: string;
}

interface Column {
    id: 'todo' | 'in-progress' | 'review' | 'done';
    label: string;
    count: number;
    cards: BoardCardData[];
    accent: string;
}

const priorityDot: Record<string, string> = {
    High: 'bg-rose-500',
    Medium: 'bg-amber-400',
    Low: 'bg-emerald-400',
};

const tagColors: Record<string, string> = {
    STORY: '#576CBC',
    TASK: '#7C9AC7',
    BUG: '#E94560',
};

const BoardCard = ({ card, onClick, onParentClick }: { card: BoardCardData; onClick: () => void; onParentClick?: (e: React.MouseEvent) => void }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        draggable
        onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
            e.dataTransfer.setData('issueId', card.id);
            e.dataTransfer.effectAllowed = 'move';
            (e.target as HTMLElement).style.opacity = '0.4';
        }}
        onDragEndCapture={(e: React.DragEvent<HTMLDivElement>) => {
            (e.target as HTMLElement).style.opacity = '1';
        }}
        onClick={onClick}
        className="bg-white/[0.05] rounded-xl p-4 hover:bg-white/[0.08] transition-all cursor-pointer active:cursor-grabbing group border border-white/5"
    >
        {card.parentTitle && (
            <div 
                className="flex items-center gap-1.5 mb-2.5 px-2 py-1 rounded bg-[#A5D7E8]/10 border border-[#A5D7E8]/20 w-fit max-w-full hover:bg-[#A5D7E8]/20 hover:border-[#A5D7E8]/30 transition-all cursor-pointer group/parent relative"
                onClick={(e) => {
                    e.stopPropagation();
                    onParentClick?.(e);
                }}
            >
                <div className="flex items-center gap-1.5 group-hover/parent:opacity-0 transition-opacity duration-200">
                    <span className="text-[9px] font-black text-[#A5D7E8] uppercase tracking-tighter whitespace-nowrap">{card.parentKey}</span>
                    <span className="text-[10px] font-medium text-[#A5D7E8] truncate">{card.parentTitle}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/parent:opacity-100 transition-opacity duration-200">
                    <span className="text-[9px] font-black text-[#A5D7E8] uppercase tracking-widest whitespace-nowrap">View Parent Story</span>
                </div>
            </div>
        )}
        <div className="flex items-start justify-between mb-3">
            <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${card.tagColor}20`, color: card.tagColor }}
            >
                {card.tag}
            </span>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white/60">
                <MoreHorizontal size={14} />
            </button>
        </div>
        <p className="text-sm text-white/80 font-medium mb-3 leading-snug">{card.title}</p>
        <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/20">{card.issueKey}</span>
            <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[card.priority]}`} />
                <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8]">
                    {card.assignee}
                </div>
            </div>
        </div>
    </motion.div>
);

export const ProjectBoardView = ({ project, canManage }: ProjectBoardViewProps) => {
    const [loading, setLoading] = useState(true);
    const [activeSprintData, setActiveSprintData] = useState<ActiveSprintData | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [allSprints, setAllSprints] = useState<SprintData[]>([]);
    
    const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    const [membersMap, setMembersMap] = useState<Record<string, { userId: string, fullName: string, profileImage: string, role: string }>>({});
    const [sprintsMap, setSprintsMap] = useState<Record<string, SprintData>>({});
    const [issuesMap, setIssuesMap] = useState<Record<string, IssueData>>({});

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [sprintRes, membersRes, allSprintsRes, storiesRes] = await Promise.all([
                getActiveSprint(project.id),
                getMembers(project.workspaceId).catch(() => ({ success: false, data: [] })),
                getProjectSprints(project.id).catch(() => ({ success: false, data: [] })),
                getProjectIssues(project.id, { limit: 100 }).catch(() => ({ success: false, data: { issues: [] } }))
            ]);

            if (sprintRes.success && sprintRes.data) {
                setActiveSprintData(sprintRes.data);
                
                const iMap: Record<string, IssueData> = {};
                sprintRes.data.issues.forEach(i => {
                    iMap[i.issueId] = i;
                });
                
                if (storiesRes.success && storiesRes.data?.issues) {
                    storiesRes.data.issues.forEach((i: IssueData) => {
                        if (!iMap[i.issueId]) iMap[i.issueId] = i;
                    });
                }
                setIssuesMap(iMap);
            } else {
                setActiveSprintData(null);
            }

            if (membersRes.success && membersRes.data) {
                const mMap: Record<string, { userId: string, fullName: string, profileImage: string, role: string }> = {};
                membersRes.data.forEach((m: { userId: string, fullName: string, profileImage: string, role: string }) => {
                    mMap[m.userId] = m;
                });
                setMembersMap(mMap);
            }

            if (allSprintsRes.success && allSprintsRes.data) {
                setAllSprints(allSprintsRes.data);
                const sMap: Record<string, SprintData> = {};
                allSprintsRes.data.forEach((s: SprintData) => {
                    sMap[s.sprintId] = s;
                });
                setSprintsMap(sMap);
            }
        } catch (error) {
            console.error('Error fetching board data:', error);
            setActiveSprintData(null);
        } finally {
            setLoading(false);
        }
    }, [project.id, project.workspaceId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (selectedIssue && issuesMap[selectedIssue.issueId]) {
            setSelectedIssue(issuesMap[selectedIssue.issueId]);
        }
    }, [issuesMap]);

    const moveIssue = async (issueId: string, newStatus: string) => {
        if (!activeSprintData) return;

        const issue = activeSprintData.issues.find(i => i.issueId === issueId);
        if (!issue || issue.status === newStatus) return;

        const oldStatus = issue.status;

        setActiveSprintData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                issues: prev.issues.map(i =>
                    i.issueId === issueId ? { ...i, status: newStatus as IssueData["status"] } : i
                )
            };
        });

        try {
            const response = await updateIssue(issueId, { status: newStatus as IssueData["status"] });
            if (!response.success) {
                throw new Error(response.message || 'Failed to update status');
            }
            toast.success(`Issue moved to ${newStatus.replace('_', ' ').toLowerCase()}`);
        } catch (error) {
            console.error('Error updating issue status:', error);
            toast.error('Failed to move issue. Reverting...');

            setActiveSprintData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    issues: prev.issues.map(i =>
                        i.issueId === issueId ? { ...i, status: oldStatus } : i
                    )
                };
            });
        }
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDrop = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        const issueId = e.dataTransfer.getData('issueId');

        const statusMap: Record<string, 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'> = {
            'todo': 'TODO',
            'in-progress': 'IN_PROGRESS',
            'review': 'REVIEW',
            'done': 'DONE'
        };

        if (issueId) {
            moveIssue(issueId, statusMap[columnId]);
        }
    };

    const handleIssueClick = (issueId: string) => {
        const issue = issues.find(i => i.issueId === issueId) || issuesMap[issueId];
        if (issue) {
            setSelectedIssue(issue);
            setIsDetailModalOpen(true);
        }
    };

    const handleParentClick = (parentId: string) => {
        const parent = issuesMap[parentId];
        if (parent) {
            setSelectedIssue(parent);
            setIsDetailModalOpen(true);
        }
    };

    const issues = activeSprintData?.issues || [];
    const incompleteIssues = issues.filter(i => i.status !== 'DONE');
    const completedIssues = issues.filter(i => i.status === 'DONE');

    const columns: Column[] = [
        {
            id: 'todo',
            label: 'To Do',
            accent: 'bg-white/20',
            cards: issues
                .filter(i => (i.status === 'TODO' || i.status === 'BACKLOG') && i.type !== 'STORY')
                .map(i => {
                    const parent = i.parentId ? issuesMap[i.parentId] : null;
                    return {
                        id: i.issueId,
                        issueKey: i.issueKey,
                        title: i.title,
                        tag: i.type,
                        tagColor: tagColors[i.type] || '#576CBC',
                        assignee: i.assigneeId ? i.assigneeId.slice(0, 2).toUpperCase() : '--',
                        priority: (i.priority ? i.priority.charAt(0) + i.priority.slice(1).toLowerCase() : 'Medium') as "High" | "Medium" | "Low",
                        parentTitle: parent?.title,
                        parentKey: parent?.issueKey,
                        parentId: i.parentId || undefined
                    };
                }),
            count: 0
        },
        {
            id: 'in-progress',
            label: 'In Progress',
            accent: 'bg-[#A5D7E8]',
            cards: issues
                .filter(i => i.status === 'IN_PROGRESS' && i.type !== 'STORY')
                .map(i => {
                    const parent = i.parentId ? issuesMap[i.parentId] : null;
                    return {
                        id: i.issueId,
                        issueKey: i.issueKey,
                        title: i.title,
                        tag: i.type,
                        tagColor: tagColors[i.type] || '#576CBC',
                        assignee: i.assigneeId ? i.assigneeId.slice(0, 2).toUpperCase() : '--',
                        priority: (i.priority ? i.priority.charAt(0) + i.priority.slice(1).toLowerCase() : 'Medium') as "High" | "Medium" | "Low",
                        parentTitle: parent?.title,
                        parentKey: parent?.issueKey,
                        parentId: i.parentId || undefined
                    };
                }),
            count: 0
        },
        {
            id: 'review',
            label: 'Review',
            accent: 'bg-indigo-400',
            cards: issues
                .filter(i => i.status === 'REVIEW' && i.type !== 'STORY')
                .map(i => {
                    const parent = i.parentId ? issuesMap[i.parentId] : null;
                    return {
                        id: i.issueId,
                        issueKey: i.issueKey,
                        title: i.title,
                        tag: i.type,
                        tagColor: tagColors[i.type] || '#576CBC',
                        assignee: i.assigneeId ? i.assigneeId.slice(0, 2).toUpperCase() : '--',
                        priority: (i.priority ? i.priority.charAt(0) + i.priority.slice(1).toLowerCase() : 'Medium') as "High" | "Medium" | "Low",
                        parentTitle: parent?.title,
                        parentKey: parent?.issueKey,
                        parentId: i.parentId || undefined
                    };
                }),
            count: 0
        },
        {
            id: 'done',
            label: 'Done',
            accent: 'bg-emerald-400',
            cards: issues
                .filter(i => i.status === 'DONE' && i.type !== 'STORY')
                .map(i => {
                    const parent = i.parentId ? issuesMap[i.parentId] : null;
                    return {
                        id: i.issueId,
                        issueKey: i.issueKey,
                        title: i.title,
                        tag: i.type,
                        tagColor: tagColors[i.type] || '#576CBC',
                        assignee: i.assigneeId ? i.assigneeId.slice(0, 2).toUpperCase() : '--',
                        priority: (i.priority ? i.priority.charAt(0) + i.priority.slice(1).toLowerCase() : 'Medium') as "High" | "Medium" | "Low",
                        parentTitle: parent?.title,
                        parentKey: parent?.issueKey,
                        parentId: i.parentId || undefined
                    };
                }),
            count: 0
        }
    ].map(col => ({ ...col, count: col.cards.length } as Column));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-[#A5D7E8] animate-spin" />
                <p className="text-white/50 text-sm font-medium">Loading board...</p>
            </div>
        );
    }

    if (!activeSprintData?.sprint) {
        return (
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Board</h1>
                    <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · Kanban view</p>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <Plus className="text-white/20 w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">No active sprint</h2>
                    <p className="text-white/40 text-sm max-w-sm">
                        There is no active sprint for this project. Start a sprint from the backlog to see tasks here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Board</h1>
                        <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">
                            {project.name} · {activeSprintData.sprint.name}
                        </p>
                    </div>
                    {canManage && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCompleteModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A5D7E8] text-[#0B2447] text-xs font-black hover:bg-[#A5D7E8]/90 transition-all shadow-lg shadow-[#A5D7E8]/10"
                            >
                                <CheckCircle2 size={14} />
                                Complete Sprint
                            </button>
                            <span className="text-[10px] font-bold text-[#A5D7E8] bg-[#A5D7E8]/10 px-2 py-1 rounded-full border border-[#A5D7E8]/20">
                                ACTIVE SPRINT
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start pb-8">
                {columns.map(col => (
                    <div
                        key={col.id}
                        className={`bg-white/[0.025] rounded-3xl overflow-hidden flex flex-col min-h-[400px] transition-all duration-200 border border-white/5 ${dragOverColumn === col.id ? 'bg-white/[0.05] ring-2 ring-[#A5D7E8]/20 border-[#A5D7E8]/20' : ''}`}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDragLeave={() => setDragOverColumn(null)}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${col.accent} shadow-[0_0_8px] shadow-current opacity-70`} />
                                <span className="text-sm font-bold text-white/70 tracking-tight underline decoration-white/5 decoration-2 underline-offset-4">{col.label}</span>
                                <span className="text-[11px] font-black text-[#A5D7E8] bg-[#A5D7E8]/10 rounded-lg px-2 py-0.5 border border-[#A5D7E8]/10 ml-1">
                                    {col.count}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 space-y-3 flex-1">
                            <AnimatePresence mode="popLayout">
                                {col.cards.map(card => (
                                    <BoardCard 
                                        key={card.id} 
                                        card={card} 
                                        onClick={() => handleIssueClick(card.id)}
                                        onParentClick={() => card.parentId && handleParentClick(card.parentId)}
                                    />
                                ))}
                            </AnimatePresence>

                            {col.cards.length === 0 && (
                                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.03] rounded-2xl bg-white/[0.01]">
                                    <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center mb-2">
                                        <Plus className="text-white/10 w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">Drop here</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <IssueDetailModal
                open={isDetailModalOpen}
                onOpenChange={(open) => {
                    setIsDetailModalOpen(open);
                    if (!open) setTimeout(() => setSelectedIssue(null), 300);
                }}
                issue={selectedIssue}
                membersMap={membersMap}
                sprintsMap={sprintsMap}
                issuesMap={issuesMap}
                onUpdate={fetchData}
            />

            {activeSprintData.sprint && (
                <CompleteSprintModal
                    open={isCompleteModalOpen}
                    onOpenChange={setIsCompleteModalOpen}
                    sprint={activeSprintData.sprint}
                    incompleteIssuesCount={incompleteIssues.length}
                    completedIssuesCount={completedIssues.length}
                    availableSprints={allSprints.filter(s => s.sprintId !== activeSprintData.sprint?.sprintId)}
                    onSuccess={() => {
                        fetchData();
                        toast.success('Sprint completed and board updated');
                    }}
                    workspaceId={project.workspaceId}
                />
            )}
        </div>
    );
};
