import type { IssueData, SprintData } from "@/services/sprint/sprint.api";
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal, Calendar, Target, MoveVertical, Paperclip, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IssueTypeIcon } from '../issue/IssueTypeIcon';

interface SprintSectionProps {
    sprint: SprintData;
    issues: IssueData[];
    onIssueDrop: (issueId: string, targetSprintId: string) => void;
    onIssueClick: (issue: IssueData) => void;
    onEditIssue: (issue: IssueData) => void;
    onAddTask?: (storyId: string) => void;
    onStart?: (sprint: SprintData) => void;
    onEdit?: (sprint: SprintData) => void;
    membersMap: Record<string, { userId: string, fullName: string, profileImage: string, role: string }>;
    canManage?: boolean;
    tasksMap: Record<string, IssueData[]>;
    loadingTasks: Set<string>;
    onToggleStory: (storyId: string) => void;
    expandedStories: Set<string>;
}

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Plus } from 'lucide-react';

const priorityDot: Record<string, string> = {
    HIGH: 'bg-rose-500',
    MEDIUM: 'bg-amber-400',
    LOW: 'bg-emerald-400',
};

export const SprintSection = ({
    sprint,
    issues,
    onIssueDrop,
    onIssueClick,
    onEditIssue,
    onAddTask,
    onStart,
    onEdit,
    membersMap,
    canManage,
    tasksMap,
    loadingTasks,
    onToggleStory,
    expandedStories
}: SprintSectionProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        if (sprint.status === 'COMPLETED') return;
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (sprint.status === 'COMPLETED') return;
        e.preventDefault();
        setIsOver(false);
        const issueId = e.dataTransfer.getData('issueId');
        if (issueId) {
            onIssueDrop(issueId, sprint.sprintId);
        }
    };

    const formatDate = (date?: Date | string) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getAssigneeInitials = (assigneeId: string) => {
        if (!assigneeId) return '--';
        const member = membersMap[assigneeId];
        if (!member) return '--';
        return member.fullName.substring(0, 2).toUpperCase();
    };

    return (
        <div 
            className={cn(
                "group/sprint bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden transition-all mb-4",
                isOver && "border-[#A5D7E8] bg-[#A5D7E8]/[0.02] shadow-[0_0_20px_rgba(165,215,232,0.05)]",
                sprint.status === 'COMPLETED' && "opacity-60 grayscale-[0.2]",
                isCollapsed && "pb-0"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-white/[0.01]" onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className="flex items-center gap-4">
                    <div className="p-1 rounded-md hover:bg-white/5 transition-colors">
                        {isCollapsed ? <ChevronRight size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-black text-white tracking-tight">{sprint.name}</h3>
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border",
                                sprint.status === 'ACTIVE' 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : sprint.status === 'COMPLETED'
                                        ? "bg-white/5 text-white/40 border-white/10"
                                        : "bg-[#19376D]/50 text-[#A5D7E8] border-[#A5D7E8]/10"
                            )}>
                                {sprint.status}
                            </span>
                            <span className="text-xs text-white/20 font-medium">({issues.length} issues)</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                            {sprint.startDate && (
                                <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold uppercase tracking-wide">
                                    <Calendar size={10} />
                                    <span>{formatDate(sprint.startDate)} — {formatDate(sprint.endDate)}</span>
                                </div>
                            )}
                            {sprint.goal && (
                                <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold uppercase tracking-wide truncate max-w-[200px]">
                                    <Target size={10} />
                                    <span>{sprint.goal}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {canManage && sprint.status === 'PLANNED' && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 bg-[#A5D7E8]/10 border-[#A5D7E8]/20 text-[#A5D7E8] hover:bg-[#A5D7E8] hover:text-[#0B2447] font-bold transition-all text-[10px] uppercase tracking-wider"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStart?.(sprint);
                            }}
                        >
                            Start Sprint
                        </Button>
                    )}
                    {canManage && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white hover:bg-white/5">
                                    <MoreHorizontal size={14} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#060d1a] border-[#19376D] text-white">
                                <DropdownMenuItem 
                                    className="gap-2 focus:bg-white/5 focus:text-[#A5D7E8] cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit?.(sprint);
                                    }}
                                >
                                    <Pencil size={14} />
                                    <span>Edit Sprint</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* List */}
            {!isCollapsed && (
                <div className="divide-y divide-white/[0.03] border-t border-white/[0.05] bg-black/10">
                    {issues.length === 0 ? (
                        <div className="px-5 py-8 text-center bg-white/[0.01]">
                            <p className="text-xs text-white/20 font-medium uppercase tracking-widest">No issues in this sprint</p>
                            <p className="text-[10px] text-white/10 mt-1">Drag and drop issues here to plan your work</p>
                        </div>
                    ) : (
                        (() => {
                            const topLevelIssues = issues.filter(i => !i.parentId);
                            const childrenIssues = issues.filter(i => i.parentId);
                            const tasksByParent: Record<string, IssueData[]> = {};
                            childrenIssues.forEach(task => {
                                if (task.parentId) {
                                    if (!tasksByParent[task.parentId]) tasksByParent[task.parentId] = [];
                                    tasksByParent[task.parentId].push(task);
                                }
                            });

                            return (
                                <div className="divide-y divide-white/[0.03]">
                                    {topLevelIssues.map(issue => (
                                        <SprintIssueRow 
                                            key={issue.issueId}
                                            issue={issue}
                                            sprint={sprint}
                                            tasks={tasksMap[issue.issueId] || []}
                                            isLoadingTasks={loadingTasks.has(issue.issueId)}
                                            isExpanded={expandedStories.has(issue.issueId)}
                                            onToggleExpand={() => onToggleStory(issue.issueId)}
                                            onIssueClick={onIssueClick}
                                            onEditIssue={onEditIssue}
                                            onAddTask={onAddTask}
                                            getAssigneeInitials={getAssigneeInitials}
                                            canManage={canManage}
                                        />
                                    ))}
                                    {childrenIssues.filter(task => !topLevelIssues.some(story => story.issueId === task.parentId)).map(task => (
                                        <SprintIssueRow 
                                            key={task.issueId}
                                            issue={task}
                                            sprint={sprint}
                                            tasks={[]}
                                            isExpanded={false}
                                            onToggleExpand={() => {}}
                                            onIssueClick={onIssueClick}
                                            onEditIssue={onEditIssue}
                                            getAssigneeInitials={getAssigneeInitials}
                                            isOrphan
                                            canManage={canManage}
                                        />
                                    ))}
                                </div>
                            );
                        })()
                    )}
                </div>
            )}
        </div>
    );
};

interface SprintIssueRowProps {
    issue: IssueData;
    sprint: SprintData;
    tasks: IssueData[];
    isLoadingTasks?: boolean;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onIssueClick: (issue: IssueData) => void;
    onEditIssue: (issue: IssueData) => void;
    onAddTask?: (storyId: string) => void;
    getAssigneeInitials: (id: string) => string;
    isOrphan?: boolean;
    canManage?: boolean;
}

const SprintIssueRow = ({ 
    issue, 
    sprint, 
    tasks, 
    isLoadingTasks,
    isExpanded,
    onToggleExpand,
    onIssueClick, 
    onEditIssue, 
    onAddTask, 
    getAssigneeInitials, 
    isOrphan, 
    canManage 
}: SprintIssueRowProps) => {

    return (
        <div className="flex flex-col">
            <div 
                draggable={sprint.status !== 'COMPLETED'}
                onDragStart={(e) => {
                    if (sprint.status === 'COMPLETED') {
                        e.preventDefault();
                        return;
                    }
                    e.dataTransfer.setData('issueId', issue.issueId);
                    e.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => {
                    if (issue.type === 'STORY') {
                        onToggleExpand();
                    }
                }}
                className={cn(
                    "grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4.5 hover:bg-white/[0.03] transition-colors group",
                    sprint.status === 'COMPLETED' ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                    isOrphan && "opacity-50"
                )}
            >
                <div className="flex items-center gap-4 min-w-0">
                    <MoveVertical size={12} className="text-white/10 group-hover:text-[#A5D7E8]/30 transition-colors flex-shrink-0" />
                    {issue.type === 'STORY' && (
                        <div className="text-white/20 group-hover:text-[#A5D7E8] transition-colors">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    )}
                    <IssueTypeIcon type={issue.type} size={18} className="flex-shrink-0" />
                    <span className="text-xs font-mono text-white/25 flex-shrink-0">{issue.issueKey}</span>
                    <span className="text-base text-white/90 group-hover:text-white transition-colors truncate font-medium">{issue.title}</span>
                    {(issue.attachments || []).length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-white/20 font-bold ml-1.5 px-1.5 py-0.5 rounded bg-white/[0.03]">
                            <Paperclip size={10} className="text-[#A5D7E8]/60" />
                            <span>{(issue.attachments || []).length}</span>
                        </div>
                    )}
                    {issue.continuedFromIssueId && (
                        <div className="flex items-center gap-1 text-[9px] text-[#A5D7E8]/60 font-bold ml-1.5 px-1.5 py-0.5 rounded bg-[#A5D7E8]/5 border border-[#A5D7E8]/10" title="Continued from previous sprint">
                            <History size={8} />
                            <span>Cont.</span>
                        </div>
                    )}
                    {issue.continuedIssueId && (
                        <div className="flex items-center gap-1 text-[9px] text-amber-400/60 font-bold ml-1.5 px-1.5 py-0.5 rounded bg-amber-400/5 border border-amber-400/10" title="Continued in next sprint">
                            <ChevronRight size={8} />
                            <span>Split</span>
                        </div>
                    )}
                    {isOrphan && <span className="text-[9px] text-[#A5D7E8]/40 border border-[#A5D7E8]/10 px-1 rounded uppercase tracking-tighter ml-1">Subtask</span>}
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
                            onIssueClick(issue);
                        }}
                    >
                        View
                    </button>
                    {canManage && (
                        <button
                            className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-black text-white/60 hover:text-white uppercase tracking-wider rounded-lg transition-all border border-white/5 hover:border-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditIssue(issue);
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
                        <div className="px-6 py-4 flex items-center gap-2 text-white/30 italic text-xs">
                            <div className="w-3 h-3 border-2 border-[#A5D7E8]/30 border-t-[#A5D7E8] rounded-full animate-spin" />
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
                                                onIssueClick(task);
                                            }}
                                        >
                                            View
                                        </button>
                                        {canManage && (
                                            <button
                                                className="opacity-0 group-hover:opacity-100 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[9px] font-black text-white/60 hover:text-white uppercase tracking-wider rounded-md transition-all border border-white/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditIssue(task);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {tasks.length === 0 && (
                                <div className="px-6 py-4 text-white/20 text-xs italic">
                                    No tasks in this story yet.
                                </div>
                            )}

                            {canManage && (
                                <div className="px-6 py-3 bg-white/[0.01] border-t border-white/[0.03]">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddTask?.(issue.issueId);
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
};
