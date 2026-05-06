import { useState, useEffect, useCallback } from 'react';
import { Zap, Calendar, CheckCircle2, Circle, Clock, Loader2, AlertCircle, Pencil, TrendingUp, Percent, RotateCcw, Timer, Hourglass } from 'lucide-react';
import { toast } from 'sonner';
import type { Project } from '../../types/sidebar.types';
import {
    getActiveSprint,
    type ActiveSprintData,
    getProjectSprints,
    type SprintData,
    getSprintAnalytics,
    type SprintAnalyticsData,
    getSprintPerformanceSummary,
    type SprintPerformanceSummaryData,
    getSprintBurndown,
    type BurndownResponseData,
    getSprintAllocation,
    type SprintAllocationData
} from '@/services/sprint/sprint.api';

import { getProjectMembers, type ProjectMember } from '@/services/project/project.api';
import { CompleteSprintModal } from './components/CompleteSprintModal';
import { EditSprintModal } from './components/sprint/EditSprintModal';
import { SprintBurndownChart } from './components/sprint/SprintBurndownChart';
import { SprintAllocationSection } from './components/sprint/SprintAllocationSection';
import { Button } from '@/components/ui/button';
import { useWorkspaceStore } from "@/store/workspace.store";
import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import { Briefcase } from "lucide-react";


interface ProjectSprintViewProps {
    project: Project;
}

const statusIcon = {
    'TODO': <Circle size={15} className="text-white/20" />,
    'IN_PROGRESS': <Zap size={15} className="text-[#A5D7E8]" />,
    'DONE': <CheckCircle2 size={15} className="text-emerald-400" />,
    'BACKLOG': <Circle size={15} className="text-white/10" />,
    'REVIEW': <Clock size={15} className="text-amber-400" />,
};

const statusLabel = {
    'BACKLOG': 'Backlog',
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'REVIEW': 'Review',
    'DONE': 'Done',
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const ProjectSprintView = ({ project }: ProjectSprintViewProps) => {
    const role = useWorkspaceStore(state => state.currentWorkspaceRole);
    const isMemberOrViewer = role === WorkspaceRoleEnum.WORKSPACE_MEMBER || role === WorkspaceRoleEnum.WORKSPACE_VIEWER;
    const canManage = role === WorkspaceRoleEnum.WORKSPACE_OWNER || role === WorkspaceRoleEnum.WORKSPACE_ADMIN;


    const [data, setData] = useState<ActiveSprintData | null>(null);
    const [analytics, setAnalytics] = useState<SprintAnalyticsData | null>(null);
    const [summary, setSummary] = useState<SprintPerformanceSummaryData | null>(null);
    const [burndownData, setBurndownData] = useState<BurndownResponseData | null>(null);
    const [allocationData, setAllocationData] = useState<SprintAllocationData | null>(null);
    const [members, setMembers] = useState<ProjectMember[]>([]);

    const [allSprints, setAllSprints] = useState<SprintData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        if (isMemberOrViewer) return;
        try {
            setLoading(true);
            const [sprintRes, membersRes, allSprintsRes, summaryRes] = await Promise.all([
                getActiveSprint(project.id),
                getProjectMembers(project.id),
                getProjectSprints(project.id).catch(() => ({ success: false, data: [] })),
                getSprintPerformanceSummary(project.id).catch(() => ({ success: false, data: null }))
            ]);

            if (sprintRes.success && sprintRes.data) {
                setData(sprintRes.data);
                if (sprintRes.data.sprint) {
                    const [analyticsRes, burndownRes, allocationRes] = await Promise.all([
                        getSprintAnalytics(sprintRes.data.sprint.sprintId).catch(() => ({ success: false, data: null })),
                        getSprintBurndown(sprintRes.data.sprint.sprintId).catch(() => ({ success: false, data: null })),
                        getSprintAllocation(sprintRes.data.sprint.sprintId).catch(() => ({ success: false, data: null }))
                    ]);
                    setAnalytics(analyticsRes.success && analyticsRes.data ? analyticsRes.data : null);
                    setBurndownData(burndownRes.success && burndownRes.data ? burndownRes.data : null);
                    setAllocationData(allocationRes.success && allocationRes.data ? allocationRes.data : null);
                } else {
                    setAnalytics(null);
                    setBurndownData(null);
                    setAllocationData(null);
                }

            }
            if (membersRes.success && membersRes.data) {
                setMembers(membersRes.data);
            }
            if (allSprintsRes.success && allSprintsRes.data) {
                setAllSprints(allSprintsRes.data);
            }
            if (summaryRes.success && summaryRes.data) {
                setSummary(summaryRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch sprint data:', error);
        } finally {
            setLoading(false);
        }
    }, [project.id, isMemberOrViewer]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isMemberOrViewer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                    <Briefcase className="text-white/20" size={24} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Access Restricted</h3>
                    <p className="text-white/40 text-sm max-w-xs mt-1">
                        You don't have the required permissions to view this section. Please contact your workspace administrator.
                    </p>
                </div>
            </div>
        );
    }

    const { sprint, issues } = data || { sprint: null, issues: [] };
    const sprintLevelIssues = issues.filter(i => i.type === 'STORY' || i.type === 'BUG');
    const incompleteIssues = sprintLevelIssues.filter(i => i.status !== 'DONE');
    const completedIssues = sprintLevelIssues.filter(i => i.status === 'DONE');
    const completionRate = Math.round(analytics?.completionRate ?? 0);
    const historicalSprints = summary?.sprints ?? [];

    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} days` : 'Ends today';
    };

    const formatDateRange = (start?: string, end?: string) => {
        if (!start || !end) return 'Not set';
        const s = new Date(start);
        const e = new Date(end);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return `${s.toLocaleDateString(undefined, options)} – ${e.toLocaleDateString(undefined, options)}`;
    };

    const getAssigneeInitials = (assigneeId: string | null) => {
        if (!assigneeId) return '--';
        const member = members.find(m => m.userId === assigneeId);
        return member ? getInitials(member.fullName) : '??';
    };

    const getIssueEffort = (issue: ActiveSprintData['issues'][number]) => {
        if (issue.type === 'TASK') return `${issue.estimatedHours ?? 0}h`;
        if (issue.type === 'BUG' && issue.estimatedHours) return `${issue.storyPoints || 0}pt / ${issue.estimatedHours}h`;
        return `${issue.storyPoints || 0}pt`;
    };

    const renderHistoricalSprintList = () => (
        <div className="bg-white/[0.025] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                <span className="text-sm font-bold text-white/50">Historical Sprints</span>
                <span className="text-xs font-medium text-white/20">{historicalSprints.length} completed</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
                {historicalSprints.map(item => (
                    <div key={item.sprintId} className="grid grid-cols-2 md:grid-cols-[1fr_90px_110px_130px_120px] gap-3 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors">
                        <div className="min-w-0 col-span-2 md:col-span-1">
                            <p className="text-sm font-bold text-white/80 truncate">{item.sprintName}</p>
                            <p className="text-xs text-white/25">{item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'Completed'}</p>
                        </div>
                        <span className="text-xs font-black text-[#A5D7E8]">{item.velocity} pts</span>
                        <span className="text-xs font-bold text-white/50">{Math.round(item.completionRate)}% complete</span>
                        <span className="text-xs font-bold text-white/35">{item.completedStoryPoints}/{item.committedStoryPoints} pts</span>
                        <span className="text-xs font-bold text-white/35">{item.spilloverStoryPoints} spillover</span>
                    </div>
                ))}
                {historicalSprints.length === 0 && (
                    <div className="px-5 py-10 text-center">
                        <p className="text-white/20 text-sm font-medium">No completed sprints yet</p>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <Loader2 className="w-8 h-8 text-[#A5D7E8] animate-spin" />
                <p className="text-white/50 text-sm font-medium">Loading sprint...</p>
            </div>
        );
    }

    if (!sprint) {
        return (
            <div className="space-y-5">
                <div className="flex flex-col items-center justify-center min-h-[320px] gap-4 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                        <AlertCircle className="text-white/20" size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">No Active Sprint</h3>
                        <p className="text-white/40 text-sm max-w-xs mt-1">
                            There is no sprint currently active for this project. Go to the backlog to start a new sprint.
                        </p>
                    </div>
                </div>
                {renderHistoricalSprintList()}
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">{sprint.name}</h1>
                    <p className="text-[#576CBC]/50 text-sm font-medium mt-0.5">{project.name} · Active sprint</p>
                </div>
                {canManage && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white/[0.05] border-white/10 text-white text-xs font-black hover:bg-white/10 transition-all"
                        >
                            <Pencil size={14} />
                            Edit Sprint
                        </Button>
                        <button
                            onClick={() => setIsCompleteModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A5D7E8] text-[#0B2447] text-xs font-black hover:bg-[#A5D7E8]/90 transition-all shadow-lg shadow-[#A5D7E8]/10 h-9"
                        >
                            <CheckCircle2 size={14} />
                            Complete Sprint
                        </button>
                    </div>
                )}
            </div>

            {/* Sprint meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/[0.025] rounded-2xl p-4 flex items-center gap-3">
                    <Calendar size={17} className="text-[#A5D7E8] opacity-60" />
                    <div>
                        <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-0.5">Sprint Period</p>
                        <p className="text-sm font-semibold text-white">{formatDateRange(sprint.startDate, sprint.endDate)}</p>
                    </div>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4 flex items-center gap-3">
                    <Clock size={17} className="text-amber-400 opacity-60" />
                    <div>
                        <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-0.5">Time Remaining</p>
                        <p className="text-sm font-semibold text-white">{sprint.endDate ? getDaysRemaining(sprint.endDate) : 'N/A'}</p>
                    </div>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-white/25 uppercase tracking-wider">Progress</p>
                        <span className="text-sm font-bold text-white">{completionRate}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#A5D7E8] rounded-full transition-all"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                    <p className="text-xs text-white/25 mt-1">{analytics?.completedStoryPoints ?? 0}/{analytics?.committedStoryPoints ?? 0} story points</p>
                </div>
            </div>

            {/* Analytics cards */}
            <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
                <div className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white/25 mb-2">
                        <TrendingUp size={14} />
                        <p className="text-xs font-bold uppercase tracking-wider">Velocity</p>
                    </div>
                    <p className="text-2xl font-black text-white">{analytics?.velocity ?? 0}</p>
                    <p className="text-xs text-white/25 mt-0.5">points</p>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white/25 mb-2">
                        <Percent size={14} />
                        <p className="text-xs font-bold uppercase tracking-wider">Completion</p>
                    </div>
                    <p className="text-2xl font-black text-white">{completionRate}%</p>
                    <p className="text-xs text-white/25 mt-0.5">{analytics?.completedIssues ?? 0}/{analytics?.committedIssues ?? 0} issues</p>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white/25 mb-2">
                        <RotateCcw size={14} />
                        <p className="text-xs font-bold uppercase tracking-wider">Spillover</p>
                    </div>
                    <p className="text-2xl font-black text-white">{analytics?.spilloverStoryPoints ?? 0}</p>
                    <p className="text-xs text-white/25 mt-0.5">points</p>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white/25 mb-2">
                        <Timer size={14} />
                        <p className="text-xs font-bold uppercase tracking-wider">Logged</p>
                    </div>
                    <p className="text-2xl font-black text-white">{analytics?.loggedHours ?? 0}h</p>
                    <p className="text-xs text-white/25 mt-0.5">{analytics?.committedEstimatedHours ?? 0}h estimated</p>
                </div>
                <div className="bg-white/[0.025] rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-white/25 mb-2">
                        <Hourglass size={14} />
                        <p className="text-xs font-bold uppercase tracking-wider">Remaining</p>
                    </div>
                    <p className="text-2xl font-black text-white">{analytics?.remainingHours ?? 0}h</p>
                    <p className="text-xs text-white/25 mt-0.5">open estimate</p>
                </div>
            </div>

            {/* Burndown Chart Section */}
            {burndownData && (
                <div className="grid grid-cols-1 gap-5">
                    <SprintBurndownChart data={burndownData} />
                </div>
            )}

            {/* Allocation Section */}
            <SprintAllocationSection allocation={allocationData} />

            {/* Issue list */}

            <div className="bg-white/[0.025] rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                    <span className="text-sm font-bold text-white/50">Sprint Issues</span>
                    <span className="text-xs font-medium text-white/20">{issues.length} issues</span>
                </div>
                <div className="divide-y divide-white/[0.03]">
                    {issues.map(issue => (
                        <div key={issue.issueId} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                            {statusIcon[issue.status as keyof typeof statusIcon] || statusIcon.TODO}
                            <span className="text-xs font-mono text-white/20 w-16 flex-shrink-0">{issue.issueKey}</span>
                            <p className={`text-sm flex-1 truncate ${issue.status === 'DONE' ? 'text-white/30 line-through' : 'text-white/80'}`}>
                                {issue.title}
                            </p>
                            <span className="text-[10px] font-bold text-white/25 px-2 py-0.5 bg-white/[0.04] rounded-lg uppercase tracking-wider">
                                {statusLabel[issue.status as keyof typeof statusLabel] || issue.status}
                            </span>
                            <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8]">
                                {getAssigneeInitials(issue.assigneeId)}
                            </div>
                            <span className="text-xs font-bold text-white/25 w-20 text-right">{getIssueEffort(issue)}</span>
                        </div>
                    ))}
                    {issues.length === 0 && (
                        <div className="px-5 py-10 text-center">
                            <p className="text-white/20 text-sm font-medium">No issues in this sprint</p>
                        </div>
                    )}
                </div>
            </div>

            {renderHistoricalSprintList()}

            {sprint && (
                <CompleteSprintModal
                    open={isCompleteModalOpen}
                    onOpenChange={setIsCompleteModalOpen}
                    sprint={sprint}
                    incompleteIssuesCount={incompleteIssues.length}
                    completedIssuesCount={completedIssues.length}
                    availableSprints={allSprints.filter(s => s.sprintId !== sprint.sprintId)}
                    onSuccess={() => {
                        fetchData();
                        toast.success('Sprint completed and data updated');
                    }}
                    workspaceId={project.workspaceId}
                />
            )}

            {sprint && (
                <EditSprintModal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    sprint={sprint}
                    workspaceId={project.workspaceId}
                    onSuccess={() => {
                        fetchData();
                    }}
                />
            )}
        </div>
    );
};
