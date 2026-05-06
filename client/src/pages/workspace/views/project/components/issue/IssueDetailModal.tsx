import type { IssueData, SprintData } from "@/services/sprint/sprint.api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link2, FileText, Image as ImageIcon, Link as LinkIcon, ExternalLink } from "lucide-react";
import { IssueTypeIcon } from "./IssueTypeIcon";
import { CommentSection } from "./CommentSection";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { Clock, History, Trash2, Edit2, Plus, Timer, ArrowRight } from "lucide-react";
import { getIssueWorkLogs, deleteWorkLog, type WorkLogData } from "@/services/issue/worklog.api";
import { WorkLogModal } from "./WorkLogModal";
import { format } from "date-fns";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/utils/error";

const sizeColors: Record<string, string> = {
    "XS": "bg-slate-100 text-slate-800",
    "S": "bg-blue-100 text-blue-800",
    "M": "bg-green-100 text-green-800",
    "L": "bg-yellow-100 text-yellow-800",
    "XL": "bg-red-100 text-red-800"
};

const priorityColors: Record<string, string> = {
    "HIGH": "text-rose-400 bg-rose-400/10",
    "MEDIUM": "text-amber-400 bg-amber-400/10",
    "LOW": "text-emerald-400 bg-emerald-400/10"
};

const statusLabels: Record<string, string> = {
    "BACKLOG": "Backlog",
    "TODO": "To Do",
    "IN_PROGRESS": "In Progress",
    "DONE": "Done"
};

const priorityLabels: Record<string, string> = {
    "HIGH": "High",
    "MEDIUM": "Medium",
    "LOW": "Low"
};

export function IssueDetailModal({ 
    open, 
    onOpenChange, 
    issue,
    membersMap,
    sprintsMap,
    issuesMap,
    onUpdate
}: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void, 
    issue: IssueData | null,
    membersMap: Record<string, { userId: string, fullName: string, profileImage: string, role: string }>,
    sprintsMap?: Record<string, SprintData>,
    issuesMap?: Record<string, IssueData>,
    onUpdate?: () => void
}) {
    const [workLogs, setWorkLogs] = useState<WorkLogData[]>([]);
    const [isWorkLogModalOpen, setIsWorkLogModalOpen] = useState(false);
    const [selectedWorkLog, setSelectedWorkLog] = useState<WorkLogData | null>(null);

    const fetchWorkLogs = useCallback(async () => {
        if (!issue?.issueId) return;
        try {
            const res = await getIssueWorkLogs(issue.issueId);
            if (res.success && res.data) {
                setWorkLogs(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch worklogs", error);
        }
    }, [issue?.issueId]);

    useEffect(() => {
        if (open && issue?.issueId) {
            fetchWorkLogs();
        }
    }, [open, issue?.issueId, fetchWorkLogs]);

    if (!issue) return null;

    const totalLogged = workLogs.reduce((acc, log) => acc + log.hours, 0);
    const remaining = issue.remainingHours ?? (issue.estimatedHours ? Math.max(0, issue.estimatedHours - totalLogged) : null);

    const assignee = issue.assigneeId ? membersMap[issue.assigneeId] : null;
    const parentStory = issue.parentId ? issuesMap?.[issue.parentId as string] : null;
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="w-[95vw] max-w-4xl max-h-[96vh] bg-[#060d1a] border-[#19376D] text-white p-0 overflow-hidden shadow-2xl gap-0 flex flex-col"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#19376D] flex items-center justify-between bg-[#19376D]/10">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-[#19376D] text-[#A5D7E8] px-2 py-1 rounded">
                            {issue.issueKey}
                        </span>
                        <DialogTitle className="text-lg font-bold">{issue.title}</DialogTitle>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden min-h-0">
                    {/* Main Body */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 min-h-0">
                        <div className="space-y-1.5 flex flex-col min-h-32">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Description</span>
                            <div className="flex-1 w-full bg-[#19376D]/10 border border-[#576CBC]/20 rounded-md p-4 text-white/90 whitespace-pre-wrap leading-relaxed shadow-inner">
                                {issue.description || <span className="text-[#576CBC]/40 italic">No description provided.</span>}
                            </div>
                        </div>

                        {issue.type === "STORY" && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-[#19376D]/50 pb-2">
                                    <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Acceptance Criteria</span>
                                    <span className="text-xs font-bold text-[#A5D7E8]">
                                        {issue.acceptanceCriteria?.length || 0} items
                                    </span>
                                </div>

                                {issue.acceptanceCriteria && issue.acceptanceCriteria.length > 0 ? (
                                    <div className="space-y-2">
                                        {issue.acceptanceCriteria.map((criteria: string, index: number) => (
                                            <div key={index} className="flex items-center gap-3 group bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#A5D7E8]/30" />
                                                <span className="text-sm text-white/90">
                                                    {criteria}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-[#576CBC]/50 italic">No acceptance criteria added.</p>
                                )}
                            </div>
                        )}

                        {/* Attachments */}
                        <div className="space-y-3 pt-6 border-t border-[#19376D]/50">
                            <div className="flex items-center justify-between">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest text-white/50">Attachments</span>
                                <span className="text-xs font-bold text-[#A5D7E8]">
                                    {issue.attachments?.length || 0} files
                                </span>
                            </div>

                            {issue.attachments && (issue.attachments || []).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {issue.attachments.map((file: { name: string, url: string, type: string }, idx: number) => (
                                        <a 
                                            key={idx}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/[0.05] hover:border-[#A5D7E8]/30 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 bg-[#19376D]/20 rounded-lg text-[#A5D7E8] group-hover:bg-[#A5D7E8] group-hover:text-[#0B2447] transition-colors">
                                                    {file.type === "IMAGE" && <ImageIcon size={16} />}
                                                    {file.type === "PDF" && <FileText size={16} />}
                                                    {file.type === "LINK" && <LinkIcon size={16} />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-white/90 group-hover:text-white truncate">
                                                        {file.name}
                                                    </span>
                                                    <span className="text-[10px] text-[#576CBC]/60 uppercase tracking-widest font-black">
                                                        {file.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <ExternalLink size={14} className="text-[#576CBC]/40 group-hover:text-[#A5D7E8] transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-[#576CBC]/50 italic">No attachments uploaded.</p>
                            )}
                        </div>

                        {/* Worklogs Section */}
                        {issue.type !== "STORY" && (
                            <div className="pt-6 border-t border-[#19376D]/50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <History size={16} className="text-[#A5D7E8]" />
                                        <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest text-white/50">Worklogs</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setSelectedWorkLog(null);
                                            setIsWorkLogModalOpen(true);
                                        }}
                                        className="text-xs font-bold text-[#A5D7E8] hover:text-white transition-colors flex items-center gap-1 bg-[#A5D7E8]/10 px-2 py-1 rounded"
                                    >
                                        <Plus size={12} /> Log Work
                                    </button>
                                </div>

                                {workLogs.length > 0 ? (
                                    <div className="space-y-3">
                                        {workLogs.map((log) => {
                                            const user = membersMap[log.userId];
                                            return (
                                                <div key={log.workLogId} className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/[0.04] transition-all">
                                                    <div className="w-8 h-8 rounded-full bg-[#19376D] flex items-center justify-center text-[10px] font-black text-[#A5D7E8] flex-shrink-0">
                                                        {user ? user.fullName.substring(0, 2).toUpperCase() : "??"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold text-white/90">{user?.fullName || "Unknown User"}</span>
                                                                <span className="text-xs text-[#A5D7E8] font-black bg-[#A5D7E8]/10 px-1.5 py-0.5 rounded">{log.hours}h</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-[#576CBC]/60 font-medium">
                                                                    {format(new Date(log.createdAt), "MMM d, h:mm a")}
                                                                </span>
                                                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                                                    <button 
                                                                        onClick={() => {
                                                                            setSelectedWorkLog(log);
                                                                            setIsWorkLogModalOpen(true);
                                                                        }}
                                                                        className="p-1 hover:text-[#A5D7E8] transition-colors"
                                                                    >
                                                                        <Edit2 size={12} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={async () => {
                                                                            if (confirm("Delete this worklog?")) {
                                                                                try {
                                                                                    await deleteWorkLog(log.workLogId);
                                                                                    toast.success("Worklog deleted");
                                                                                    fetchWorkLogs();
                                                                                    onUpdate?.();
                                                                                } catch (err) {
                                                                                    toast.error(getErrorMessage(err));
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="p-1 hover:text-rose-400 transition-colors"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {log.note && (
                                                            <p className="text-xs text-white/60 mt-1 leading-relaxed">{log.note}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6 bg-white/[0.01] rounded-xl border border-dashed border-white/5">
                                        <Clock size={24} className="text-white/5 mb-2" />
                                        <p className="text-xs text-[#576CBC]/40 italic">No work logged yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comments Section */}
                        <div className="pt-6 border-t border-[#19376D]/50">
                            <CommentSection issueId={issue.issueId} membersMap={membersMap} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 bg-[#19376D]/5 border-t lg:border-t-0 lg:border-l border-[#19376D] p-4 sm:p-6 space-y-6 overflow-y-auto">
                        
                        <div className="space-y-1.5">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Status</span>
                            <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center text-sm font-bold text-white uppercase tracking-wider">
                                {statusLabels[issue.status] || issue.status}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Issue Type</span>
                            <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center gap-2 text-sm text-white capitalize">
                                <span>
                                    <IssueTypeIcon type={issue.type} size={14} />
                                </span>
                                {issue.type.charAt(0).toUpperCase() + issue.type.slice(1).toLowerCase()}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Priority</span>
                            <div className={`w-full border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center text-sm font-bold capitalize ${priorityColors[issue.priority] || 'text-white bg-[#19376D]/20'}`}>
                                {priorityLabels[issue.priority] || issue.priority}
                            </div>
                        </div>

                        {(issue.type === "STORY" || issue.type === "BUG") && issue.sizeLabel && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Story Points</span>
                                <div className={`w-12 h-10 rounded-md flex items-center justify-center text-sm font-bold ${sizeColors[issue.sizeLabel] || 'bg-[#19376D]/20 text-white'}`}>
                                    {issue.sizeLabel}
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Assignee</span>
                            <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center gap-2 text-sm text-white">
                                {assignee ? (
                                    <>
                                        <div className="w-6 h-6 rounded-full bg-[#19376D] flex items-center justify-center text-[10px] font-black text-[#A5D7E8]">
                                            {assignee.fullName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span>{assignee.fullName}</span>
                                    </>
                                ) : (
                                    <span className="text-white/40 italic">Unassigned</span>
                                )}
                            </div>
                        </div>

                        {issue.type !== "STORY" && (
                            <div className="space-y-3 pt-4 border-t border-[#19376D]/20">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <Timer size={12} /> Time Tracking
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-[#19376D]/20 border border-[#576CBC]/10 rounded-lg p-2 flex flex-col items-center text-center">
                                        <span className="text-[9px] font-bold text-[#576CBC]/60 uppercase tracking-tighter">Estimated</span>
                                        <span className="text-sm font-black text-white">{issue.estimatedHours ? `${issue.estimatedHours}h` : '--'}</span>
                                    </div>
                                    <div className="bg-[#19376D]/20 border border-[#576CBC]/10 rounded-lg p-2 flex flex-col items-center text-center">
                                        <span className="text-[9px] font-bold text-[#576CBC]/60 uppercase tracking-tighter">Logged</span>
                                        <span className="text-sm font-black text-[#A5D7E8]">{totalLogged > 0 ? `${totalLogged}h` : '0h'}</span>
                                    </div>
                                    <div className="bg-[#19376D]/20 border border-[#576CBC]/10 rounded-lg p-2 flex flex-col items-center text-center">
                                        <span className="text-[9px] font-bold text-[#576CBC]/60 uppercase tracking-tighter">Remaining</span>
                                        <span className="text-sm font-black text-emerald-400">{remaining !== null ? `${remaining}h` : '--'}</span>
                                    </div>
                                </div>
                                {issue.estimatedHours && (
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-full rounded-full transition-all duration-500",
                                                (totalLogged / issue.estimatedHours) > 1 ? "bg-rose-500" : "bg-[#A5D7E8]"
                                            )}
                                            style={{ width: `${Math.min(100, (totalLogged / issue.estimatedHours) * 100)}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {(issue.type === "TASK" || issue.type === "BUG") && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Parent Story</span>
                                {parentStory ? (
                                    <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md px-3 py-2.5 flex items-start gap-2.5">
                                        <IssueTypeIcon type="STORY" size={13} className="flex-shrink-0 mt-0.5" />
                                        <div className="min-w-0">
                                            <span className="text-[10px] font-mono text-[#A5D7E8] block">{parentStory.issueKey}</span>
                                            <span className="text-xs text-white/80 leading-tight block truncate" title={parentStory.title}>{parentStory.title}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center gap-2 text-sm">
                                        <Link2 size={13} className="text-white/20" />
                                        <span className="text-white/30 italic text-xs">No parent story</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {issue.type === "STORY" && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Child Tasks</span>
                                {(issue as any).taskIds && (issue as any).taskIds.length > 0 ? (
                                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {(issue as any).taskIds.map((taskId: string) => {
                                            const childTask = issuesMap?.[taskId];
                                            if (!childTask) return null;
                                            return (
                                                <div key={taskId} className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md px-3 py-2 flex items-center justify-between group">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <IssueTypeIcon type={childTask.type} size={12} className="flex-shrink-0" />
                                                        <div className="min-w-0 flex flex-col">
                                                            <span className="text-[9px] font-mono text-[#A5D7E8]/60 leading-none mb-0.5">{childTask.issueKey}</span>
                                                            <span className="text-xs text-white/80 leading-tight truncate">{childTask.title}</span>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                                        childTask.status === "DONE" ? "text-emerald-400 bg-emerald-400/10" : "text-white/40 bg-white/5"
                                                    )}>
                                                        {childTask.status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center gap-2 text-sm">
                                        <span className="text-white/30 italic text-xs">No tasks added yet</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {issue.sprintId && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Sprint</span>
                                <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center text-sm text-white">
                                    {sprintsMap?.[issue.sprintId]?.name || issue.sprintId}
                                </div>
                            </div>
                        )}

                        {issue.continuedFromIssueId && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Continued From</span>
                                {issuesMap?.[issue.continuedFromIssueId] ? (
                                    <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md px-3 py-2 flex items-center gap-2">
                                        <History size={12} className="text-[#A5D7E8]" />
                                        <span className="text-xs text-white/80">{issuesMap[issue.continuedFromIssueId].issueKey}</span>
                                    </div>
                                ) : (
                                    <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md px-3 py-2 flex items-center gap-2">
                                        <History size={12} className="text-white/20" />
                                        <span className="text-xs text-white/40 italic">Previous part exists</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {issue.continuedIssueId && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Continued In</span>
                                {issuesMap?.[issue.continuedIssueId] ? (
                                    <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md px-3 py-2 flex items-center gap-2">
                                        <ArrowRight size={12} className="text-[#A5D7E8]" />
                                        <span className="text-xs text-white/80">{issuesMap[issue.continuedIssueId].issueKey}</span>
                                    </div>
                                ) : (
                                    <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md px-3 py-2 flex items-center gap-2">
                                        <ArrowRight size={12} className="text-white/20" />
                                        <span className="text-xs text-white/40 italic">Next part exists</span>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-4 border-t border-[#19376D] bg-[#19376D]/5">
                    <button 
                        type="button" 
                        onClick={() => onOpenChange(false)}
                        className="font-bold bg-[#19376D]/60 text-white hover:bg-[#19376D] transition-all rounded-xl h-9 px-6 border border-[#576CBC]/30"
                    >
                        Close
                    </button>
                </div>

                <WorkLogModal 
                    open={isWorkLogModalOpen}
                    onOpenChange={setIsWorkLogModalOpen}
                    issueId={issue.issueId}
                    onSuccess={() => {
                        fetchWorkLogs();
                        onUpdate?.();
                    }}
                    editLog={selectedWorkLog}
                />
            </DialogContent>
        </Dialog>
    );
}

export default IssueDetailModal;
