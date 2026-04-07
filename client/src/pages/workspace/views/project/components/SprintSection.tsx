import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal, Calendar, Target, MoveVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SprintSectionProps {
    sprint: {
        sprintId: string;
        name: string;
        status: string;
        goal?: string;
        startDate?: Date;
        endDate?: Date;
    };
    issues: any[];
    onIssueDrop: (issueId: string, targetSprintId: string) => void;
    onIssueClick: (issue: any) => void;
    onEditIssue: (issue: any) => void;
    onStart?: (sprint: any) => void;
    membersMap: Record<string, any>;
}

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
    onStart,
    membersMap
}: SprintSectionProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(false);
        const issueId = e.dataTransfer.getData('issueId');
        if (issueId) {
            onIssueDrop(issueId, sprint.sprintId);
        }
    };

    const formatDate = (date?: Date) => {
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
                isCollapsed && "pb-0"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.01]" onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className="flex items-center gap-4">
                    <div className="p-1 rounded-md hover:bg-white/5 transition-colors">
                        {isCollapsed ? <ChevronRight size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-black text-white tracking-tight">{sprint.name}</h3>
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border",
                                sprint.status === 'ACTIVE' 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
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
                    {sprint.status === 'PLANNED' && (
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white hover:bg-white/5">
                        <MoreHorizontal size={14} />
                    </Button>
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
                        issues.map(issue => (
                            <div 
                                key={issue.issueId}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('issueId', issue.issueId);
                                    e.dataTransfer.effectAllowed = 'move';
                                }}
                                onClick={() => onIssueClick(issue)}
                                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 hover:bg-white/[0.03] transition-colors group cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <MoveVertical size={12} className="text-white/10 group-hover:text-[#A5D7E8]/30 transition-colors flex-shrink-0" />
                                    <span className="text-xs font-mono text-white/25 flex-shrink-0">{issue.issueKey}</span>
                                    <span className="text-sm text-white/80 group-hover:text-white transition-colors truncate">{issue.title}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[issue.priority] || 'bg-gray-400'}`} />
                                    <span className="text-xs text-white/40">{issue.priority}</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[9px] font-black text-[#A5D7E8]">
                                    {getAssigneeInitials(issue.assigneeId)}
                                </div>
                                <span className="text-xs text-white/30 text-right w-6">{issue.sizeLabel || '--'}</span>
                                <div className="w-8 flex justify-end">
                                    <button 
                                        className="p-1.5 text-white/10 hover:text-[#A5D7E8] transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditIssue(issue);
                                        }}
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
