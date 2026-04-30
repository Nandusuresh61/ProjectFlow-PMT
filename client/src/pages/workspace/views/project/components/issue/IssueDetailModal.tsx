import type { IssueData, SprintData } from "@/services/sprint/sprint.api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link2, FileText, Image as ImageIcon, Link as LinkIcon, ExternalLink } from "lucide-react";
import { IssueTypeIcon } from "./IssueTypeIcon";

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
    issuesMap
}: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void, 
    issue: IssueData | null,
    membersMap: Record<string, { userId: string, fullName: string, profileImage: string, role: string }>,
    sprintsMap?: Record<string, SprintData>,
    issuesMap?: Record<string, IssueData>
}) {
    if (!issue) return null;

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

                        {/* Subtasks */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-[#19376D]/50 pb-2">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Subtasks</span>
                                <span className="text-xs font-bold text-[#A5D7E8]">
                                    {(issue.subtasks || []).filter((t: { completed: boolean }) => t.completed).length || 0} / {issue.subtasks?.length || 0} completed
                                </span>
                            </div>

                            {issue.subtasks && (issue.subtasks || []).length > 0 ? (
                                <div className="space-y-2">
                                    {issue.subtasks.map((task: { id: string, title: string, completed: boolean }) => (
                                        <div key={task.id} className="flex items-center gap-3 group bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                                            <input 
                                                type="checkbox" 
                                                disabled 
                                                checked={task.completed}
                                                className="w-4 h-4 outline-none rounded appearance-none border border-[#576CBC]/40 bg-[#19376D]/20 opacity-70 checked:bg-[#A5D7E8]" 
                                            />
                                            <span className={`text-sm ${task.completed ? 'text-white/40 line-through' : 'text-white/90'}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-[#576CBC]/50 italic">No subtasks added.</p>
                            )}
                        </div>

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

                        {issue.type === "STORY" && issue.sizeLabel && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Size</span>
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

                        {issue.sprintId && (
                            <div className="space-y-1.5">
                                <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Sprint</span>
                                <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center text-sm text-white">
                                    {sprintsMap?.[issue.sprintId]?.name || issue.sprintId}
                                </div>
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
            </DialogContent>
        </Dialog>
    );
}

export default IssueDetailModal;
