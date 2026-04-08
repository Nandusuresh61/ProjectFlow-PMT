import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, CheckSquare, Bug } from "lucide-react";

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

export function IssueDetailModal({ 
    open, 
    onOpenChange, 
    issue,
    membersMap,
    sprintsMap
}: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void, 
    issue: any,
    membersMap: Record<string, any>,
    sprintsMap?: Record<string, any>
}) {
    if (!issue) return null;

    const assignee = membersMap[issue.assigneeId];
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="max-w-4xl bg-[#060d1a] border-[#19376D] text-white p-0 overflow-hidden shadow-2xl gap-0"
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

                <div className="flex h-[600px]">
                    {/* Main Body */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
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
                                    {issue.subtasks?.filter((t: any) => t.completed).length || 0} / {issue.subtasks?.length || 0} completed
                                </span>
                            </div>

                            {issue.subtasks && issue.subtasks.length > 0 ? (
                                <div className="space-y-2">
                                    {issue.subtasks.map((task: any) => (
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
                    </div>

                    {/* Sidebar */}
                    <div className="w-72 bg-[#19376D]/5 border-l border-[#19376D] p-6 space-y-6 overflow-y-auto">
                        
                        <div className="space-y-1.5">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Status</span>
                            <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center text-sm font-bold text-white uppercase tracking-wider">
                                {issue.status}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Issue Type</span>
                            <div className="w-full bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center gap-2 text-sm text-white capitalize">
                                <span className="text-[#A5D7E8]">
                                    {issue.type === "STORY" && <BookOpen size={14} />}
                                    {issue.type === "TASK" && <CheckSquare size={14} />}
                                    {issue.type === "BUG" && <Bug size={14} className="text-red-400" />}
                                </span>
                                {issue.type.toLowerCase()}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Priority</span>
                            <div className={`w-full border border-[#576CBC]/20 rounded-md h-10 px-3 flex items-center text-sm font-bold capitalize ${priorityColors[issue.priority] || 'text-white bg-[#19376D]/20'}`}>
                                {issue.priority.toLowerCase()}
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
                <div className="flex items-center justify-end p-4 border-t border-[#19376D] bg-[#19376D]/5">
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
