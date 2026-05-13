import type { IssueData } from "@/services/sprint/sprint.api";
import { z } from "zod";
import React, { useCallback, useReducer, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { IssueTypeIcon } from "./IssueTypeIcon";
import { cn } from "@/lib/utils";
import { issueFormSchema } from "@/shared/schema/issue/issue.schema";
import type { FormState, FormAction, FormValues } from "@/shared/types/issue.types";

const initialValues: FormValues = {
    title: "",
    description: "",
    type: "Story",
    status: "BACKLOG",
    priority: "Medium",
    size: "",
    assignee: "",
    sprint: "Backlog",
    parentId: "",
    subtasks: [],
    attachments: [],
    estimatedHours: undefined,
};

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case "SET_VALUE":
            return {
                ...state,
                values: { ...state.values, [action.field]: action.value } as FormValues,
                errors: { ...state.errors, [action.field]: undefined },
            };
        case "SET_ERRORS":
            return { ...state, errors: action.errors };
        case "TOUCH":
            return { ...state, touched: { ...state.touched, [action.field]: true } };
        case "SET_SUBMITTING":
            return { ...state, isSubmitting: action.isSubmitting };
        case "RESET":
            return { values: action.values, errors: {}, touched: {}, isSubmitting: false };
        default:
            return state;
    }
}

const sizeColors = {
    "XS": "bg-slate-100 text-slate-800",
    "S": "bg-blue-100 text-blue-800",
    "M": "bg-green-100 text-green-800",
    "L": "bg-yellow-100 text-yellow-800",
    "XL": "bg-red-100 text-red-800"
};

import { createIssue, updateIssue, getProjectIssues } from "@/services/issue/issue.api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { getMembers } from "@/services/workspace/team.api";
import { FileText, Image as ImageIcon, Link as LinkIcon, Paperclip } from "lucide-react";
import { getErrorMessage } from "@/shared/utils/error";

export function IssueCreationModal({
    open,
    onOpenChange,
    project,
    onSuccess,
    editIssue,
    parentStoryId
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    project?: { key: string, id: string, workspaceId: string, memberIds: string[] },
    onSuccess?: () => void,
    editIssue?: IssueData | null,
    parentStoryId?: string
}) {
    const [members, setMembers] = useState<{ userId: string, fullName: string, profileImage: string }[]>([]);

    useEffect(() => {
        if (open && project?.id) {
            getProjectIssues(project.id, { limit: 100 }).catch(err => console.error("Failed to load issues", err));
        }
    }, [open, project?.id]);

    useEffect(() => {
        if (open && project?.workspaceId) {
            getMembers(project.workspaceId).then(res => {
                if (res?.data) {
                    setMembers(res.data.filter((m: { userId: string }) => project.memberIds?.includes(m.userId)));
                }
            }).catch(err => console.error("Failed to load members", err));
        }
    }, [open, project?.workspaceId, project?.memberIds]);

    const [state, dispatch] = useReducer(formReducer, {
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
    } as FormState);

    useEffect(() => {
        if (open) {
            if (editIssue) {
                dispatch({
                    type: "RESET", values: {
                        title: editIssue.title || "",
                        description: editIssue.description || "",
                        type: editIssue.type === "STORY" ? "Story" : editIssue.type === "BUG" ? "Bug" : "Task",
                        status: (editIssue.status === "REVIEW" ? "IN_PROGRESS" : editIssue.status || "BACKLOG") as "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE",
                        priority: editIssue.priority === "HIGH" ? "High" : editIssue.priority === "LOW" ? "Low" : "Medium",
                        size: (editIssue.sizeLabel || "") as "XS" | "S" | "M" | "L" | "XL" | "",
                        assignee: editIssue.assigneeId || "",
                        sprint: editIssue.sprintId || "Backlog",
                        parentId: editIssue.parentId || "",
                        subtasks: editIssue.acceptanceCriteria ? editIssue.acceptanceCriteria.map((title: string, i: number) => ({ id: `ac-${i}`, title, completed: false })) : [],
                        attachments: editIssue.attachments ? [...editIssue.attachments as { name: string; url: string; type: "IMAGE" | "PDF" | "LINK" }[]] : [],
                        estimatedHours: editIssue.estimatedHours || undefined,
                        remainingHours: editIssue.remainingHours || undefined
                    }
                });
            } else if (parentStoryId) {
                dispatch({
                    type: "RESET", values: {
                        ...initialValues,
                        type: "Task",
                        parentId: parentStoryId
                    }
                });
            } else {
                dispatch({ type: "RESET", values: initialValues });
            }
        }
    }, [open, editIssue, parentStoryId]);

    const [linkUrl, setLinkUrl] = useState("");
    const [pendingFiles, setPendingFiles] = useState<{ id: string; file: File }[]>([]);

    const handleChange = useCallback((field: string, value: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch({ type: "SET_VALUE", field: field as "title", value: value as any }); 
    }, []);

    const handleBlur = useCallback((field: string) => {
        dispatch({ type: "TOUCH", field: field as "title" });
    }, []);

    const handleTypeChange = useCallback((value: "Story" | "Task" | "Bug") => {
        handleChange("type", value);
        if (value === "Task") {
            handleChange("size", "");
        }
    }, [handleChange]);

    const addSubtask = () => {
        handleChange("subtasks", [
            ...state.values.subtasks,
            { id: Math.random().toString(36).substr(2, 9), title: "", completed: false }
        ]);
    };

    const updateSubtask = (index: number, title: string) => {
        const newSubtasks = [...state.values.subtasks];
        newSubtasks[index].title = title;
        handleChange("subtasks", newSubtasks);
    };

    const removeSubtask = (index: number) => {
        const newSubtasks = [...state.values.subtasks];
        newSubtasks.splice(index, 1);
        handleChange("subtasks", newSubtasks);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const id = Math.random().toString(36).substr(2, 9);
        const type = file.type.startsWith("image/") ? "IMAGE" : "PDF";

        setPendingFiles(prev => [...prev, { id, file }]);
        handleChange("attachments", [
            ...state.values.attachments,
            { name: file.name, url: "", type: type as "IMAGE" | "PDF" | "LINK", id }
        ]);
        
        e.target.value = "";
    };

    const addLink = () => {
        if (!linkUrl.trim()) return;
        if (!linkUrl.startsWith("http")) {
            toast.error("Please enter a valid URL (starting with http/https)");
            return;
        }

        handleChange("attachments", [
            ...state.values.attachments,
            { name: linkUrl.replace(/^https?:\/\/(www\.)?/, ""), url: linkUrl, type: "LINK" }
        ]);
        setLinkUrl("");
    };

    const removeAttachment = (index: number) => {
        const attachment = state.values.attachments[index];
        if ((attachment as { id?: string }).id) {
            setPendingFiles(prev => prev.filter(f => f.id !== (attachment as { id?: string }).id));
        }
        const newAttachments = [...state.values.attachments];
        newAttachments.splice(index, 1);
        handleChange("attachments", newAttachments);
    };

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const allFields = ["title", "description", "type", "status", "priority", "size", "assignee", "sprint"];
        allFields.forEach(f => dispatch({ type: "TOUCH", field: f }));

        const result = issueFormSchema.safeParse(state.values);
        if (!result.success) {
            const errorMap: Record<string, string> = {};
            result.error.issues.forEach((issue: z.ZodIssue) => {
                const key = issue.path.join(".");
                if (!errorMap[key]) {
                    errorMap[key] = issue.message;
                }
            });
            dispatch({ type: "SET_ERRORS", errors: errorMap });
            return;
        }

        dispatch({ type: "SET_SUBMITTING", isSubmitting: true });

        try {
            if (!project) {
                toast.error("Project context is missing");
                return;
            }

            // Handle pending uploads
            const finalAttachments = [...state.values.attachments];
            if (pendingFiles.length > 0) {
                const uploadPromises = pendingFiles.map(async (pending) => {
                    try {
                        const url = await uploadToCloudinary(pending.file);
                        return { id: pending.id, url };
                    } catch {
                        throw new Error(`Failed to upload ${pending.file.name}`);
                    }
                });

                const uploadedResults = await Promise.all(uploadPromises);
                
                // Map URLs back to attachments
                uploadedResults.forEach(result => {
                    const idx = finalAttachments.findIndex(a => (a as { id?: string }).id === result.id);
                    if (idx !== -1) {
                        finalAttachments[idx] = {
                            ...finalAttachments[idx],
                            url: result.url
                        };
                        // Remove the temporary ID before sending to backend
                        delete (finalAttachments[idx] as { id?: string }).id;
                    }
                });
            }

            // Cleanup any remaining temporary IDs from links or existing attachments
            const cleanedAttachments = finalAttachments.map(({ name, url, type }) => ({ name, url, type }));

            const payload = {
                title: state.values.title,
                description: state.values.description,
                type: state.values.type.toUpperCase() as "STORY" | "TASK" | "BUG",
                status: state.values.status,
                priority: state.values.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
                sizeLabel: state.values.type === "Task" ? null : state.values.size || null,
                assigneeId: state.values.assignee || null,
                sprintId: state.values.sprint === "Backlog" ? null : state.values.sprint,
                parentId: state.values.parentId || null,
                projectId: project.id,
                workspaceId: project.workspaceId,
                acceptanceCriteria: state.values.subtasks.map(t => t.title).filter(t => t.trim().length > 0),
                attachments: cleanedAttachments,
                estimatedHours: state.values.estimatedHours || null,
            };

            let response;
            if (editIssue) {
                response = await updateIssue(editIssue.issueId, payload);
            } else {
                response = await createIssue(payload);
            }

            toast.success(response.message || `Issue ${editIssue ? 'updated' : 'created'} successfully`);
            onOpenChange(false);
            if (!editIssue) {
                dispatch({ type: "RESET", values: initialValues });
                setPendingFiles([]);
            }
            if (onSuccess) onSuccess();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error) || `Failed to ${editIssue ? 'update' : 'create'} issue`);
        } finally {
            dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
        }
    }, [state.values, onOpenChange, editIssue, project, onSuccess, pendingFiles]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && open) {
                handleSubmit();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, handleSubmit]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-[95vw] max-w-4xl max-h-[96vh] bg-[#060d1a] border-[#19376D] text-white p-0 overflow-hidden shadow-2xl gap-0 flex flex-col"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#19376D] flex items-center justify-between bg-[#19376D]/10">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-[#19376D] text-[#A5D7E8] px-2 py-1 rounded">{editIssue ? editIssue.issueKey : project?.key || "PF"}</span>
                        <DialogTitle className="text-lg font-bold">
                            {editIssue ? "Edit Issue" : parentStoryId ? "Add Task to Story" : "Create New Issue"}
                        </DialogTitle>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden min-h-0">
                    {/* Main Body */}
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 min-h-0">
                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Title *</Label>
                            <Input
                                value={state.values.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                onBlur={() => handleBlur("title")}
                                placeholder="Issue title"
                                className={cn(
                                    "bg-[#19376D]/10 border-[#576CBC]/20 text-white placeholder:text-[#576CBC]/40 text-lg h-12 focus-visible:ring-[#A5D7E8]/20 focus-visible:border-[#A5D7E8]/50",
                                    state.touched.title && state.errors.title && "border-red-500/60 focus-visible:ring-red-500/30"
                                )}
                            />
                            {state.touched.title && state.errors.title && <p className="text-xs text-red-400 mt-0.5">{state.errors.title}</p>}
                        </div>

                        <div className="space-y-1.5 flex flex-col min-h-[200px] lg:h-64">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Description</Label>
                            <textarea
                                value={state.values.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Add a markdown description..."
                                className="flex-1 w-full bg-[#19376D]/10 border border-[#576CBC]/20 rounded-md p-3 text-white placeholder:text-[#576CBC]/40 focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 focus:border-[#A5D7E8]/50 resize-none transition-all"
                            />
                        </div>

                        {state.values.type === "Story" && (
                            <div className="space-y-4 pt-4 border-t border-[#19376D]/50">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Acceptance Criteria</Label>
                                    <button type="button" onClick={addSubtask} className="text-xs font-bold text-[#A5D7E8] hover:text-white transition-colors flex items-center gap-1">
                                        <Plus size={12} /> Add Criteria
                                    </button>
                                </div>
                                
                                {state.values.subtasks.map((task, idx) => (
                                    <div key={idx} className="flex items-center gap-3 group bg-white/[0.02] p-3 rounded-xl border border-white/5 focus-within:border-[#A5D7E8]/30 transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#A5D7E8]/30" />
                                        <input 
                                            className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-white/20 focus:outline-none"
                                            placeholder="Enter criteria..."
                                            value={task.title}
                                            onChange={(e) => updateSubtask(idx, e.target.value)}
                                        />
                                        <button 
                                            type="button"
                                            className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-rose-400 transition-all"
                                            onClick={() => removeSubtask(idx)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {state.values.subtasks.length === 0 && (
                                    <p className="text-xs text-[#576CBC]/50 italic">No acceptance criteria added.</p>
                                )}
                            </div>
                        )}

                        {/* Attachments */}
                        <div className="space-y-4 pt-4 border-t border-[#19376D]/50">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Attachments</Label>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Upload Button */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept="image/*,application/pdf"
                                        onChange={handleFileUpload}
                                        disabled={state.isSubmitting}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#576CBC]/20 rounded-lg hover:border-[#A5D7E8]/50 hover:bg-[#19376D]/5 cursor-pointer transition-all gap-2",
                                            state.isSubmitting && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <Paperclip className="text-[#A5D7E8]" size={20} />
                                        <span className="text-xs font-medium text-[#A5D7E8]">Upload Image or PDF</span>
                                    </label>
                                </div>

                                {/* Link Input */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.target.value)}
                                            placeholder="Paste link here..."
                                            className="h-10 bg-[#19376D]/10 border-[#576CBC]/20 text-sm"
                                        />
                                        <Button 
                                            type="button" 
                                            onClick={addLink} 
                                            className="h-10 bg-[#19376D] hover:bg-[#19376D]/80 border border-[#576CBC]/20 px-3"
                                        >
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-[#576CBC]/60 pl-1">Attach external links (e.g. Figma, Docs)</p>
                                </div>
                            </div>

                            {/* Attachment List */}
                            {state.values.attachments.length > 0 && (
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {state.values.attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-[#19376D]/10 border border-[#576CBC]/10 rounded group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-1.5 bg-[#19376D]/20 rounded text-[#A5D7E8]">
                                                    {file.type === "IMAGE" && <ImageIcon size={14} />}
                                                    {file.type === "PDF" && <FileText size={14} />}
                                                    {file.type === "LINK" && <LinkIcon size={14} />}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    {file.url ? (
                                                        <a 
                                                            href={file.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-sm font-medium hover:text-[#A5D7E8] transition-colors truncate"
                                                        >
                                                            {file.name}
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm font-medium text-[#A5D7E8] truncate flex items-center gap-2">
                                                            {file.name}
                                                            <span className="text-[10px] bg-[#A5D7E8]/10 px-1 rounded border border-[#A5D7E8]/20">Pending</span>
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-[#576CBC]/60 uppercase tracking-tighter">{file.type}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(idx)}
                                                className="p-1.5 text-[#576CBC] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {state.errors.attachments && (
                                <p className="text-xs text-red-400 mt-1">{state.errors.attachments}</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 bg-[#19376D]/5 border-t lg:border-t-0 lg:border-l border-[#19376D] p-4 sm:p-6 space-y-6 overflow-y-auto">

                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Issue Type *</Label>
                            <div className="relative">
                                <select
                                    value={state.values.type}
                                    onChange={(e) => handleTypeChange(e.target.value as "Story" | "Task" | "Bug")}
                                    disabled={!!parentStoryId && !editIssue}
                                    className={cn(
                                        "w-full appearance-none bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 pl-9 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 cursor-pointer",
                                        state.touched.type && state.errors.type && "border-red-500/60",
                                        (!!parentStoryId && !editIssue) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {parentStoryId && !editIssue ? (
                                        <option value="Task" className="bg-[#0b1b36] text-white">Task</option>
                                    ) : (
                                        <>
                                            <option value="Story" className="bg-[#0b1b36] text-white">Story</option>
                                            <option value="Bug" className="bg-[#0b1b36] text-white">Bug</option>
                                            {editIssue && editIssue.type === "TASK" && (
                                                <option value="Task" className="bg-[#0b1b36] text-white">Task</option>
                                            )}
                                        </>
                                    )}
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <IssueTypeIcon type={state.values.type} size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Status</Label>
                            <select
                                value={state.values.status}
                                onChange={(e) => handleChange("status", e.target.value)}
                                className="w-full appearance-none bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 cursor-pointer"
                            >
                                <option value="BACKLOG" className="bg-[#0b1b36] text-white">Backlog</option>
                                <option value="TODO" className="bg-[#0b1b36] text-white">To Do</option>
                                <option value="IN_PROGRESS" className="bg-[#0b1b36] text-white">In Progress</option>
                                <option value="DONE" className="bg-[#0b1b36] text-white">Done</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Priority</Label>
                            <select
                                value={state.values.priority}
                                onChange={(e) => handleChange("priority", e.target.value)}
                                className="w-full appearance-none bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 cursor-pointer"
                            >
                                <option value="Low" className="bg-[#0b1b36] text-white">Low</option>
                                <option value="Medium" className="bg-[#0b1b36] text-white">Medium</option>
                                <option value="High" className="bg-[#0b1b36] text-white">High</option>
                            </select>
                        </div>

                        {(state.values.type === "Story" || state.values.type === "Bug") && (
                            <div className="space-y-1.5">
                                <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest flex items-center justify-between">
                                    Story Points {state.values.type === "Story" ? "*" : ""}
                                    {state.touched.size && state.errors.size && <span className="text-red-400 normal-case tracking-normal">{state.errors.size}</span>}
                                </Label>
                                <div className="flex items-center gap-1.5">
                                    {(["XS", "S", "M", "L", "XL"] as const).map(size => {
                                        const isSelected = state.values.size === size;
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    handleChange("size", isSelected ? "" : size);
                                                    handleBlur("size");
                                                }}
                                                className={cn(
                                                    "h-8 flex-1 rounded text-xs font-bold transition-all border",
                                                    isSelected ? `${sizeColors[size]} border-transparent` : "bg-[#19376D]/10 text-[#576CBC] border-[#576CBC]/20 hover:border-[#576CBC]/50",
                                                    state.touched.size && state.errors.size && !state.values.size && "border-red-500/60"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {state.values.type !== "Story" && (
                            <div className="space-y-1.5">
                                <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Assignee</Label>
                                <select
                                    value={state.values.assignee}
                                    onChange={(e) => handleChange("assignee", e.target.value)}
                                    className="w-full appearance-none bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 cursor-pointer"
                                >
                                    <option value="" className="bg-[#0b1b36] text-white">Unassigned</option>
                                    {members.map((member: { userId: string, fullName: string, profileImage: string }) => (
                                        <option key={member.userId} value={member.userId} className="bg-[#0b1b36] text-white">
                                            {member.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Sprint</Label>
                            <select
                                value={state.values.sprint}
                                onChange={(e) => handleChange("sprint", e.target.value)}
                                className="w-full appearance-none bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 cursor-pointer"
                            >
                                <option value="Backlog" className="bg-[#0b1b36] text-white">Backlog</option>
                                <option value="Sprint 1" className="bg-[#0b1b36] text-white">Sprint 1</option>
                                <option value="Sprint 2" className="bg-[#0b1b36] text-white">Sprint 2</option>
                            </select>
                        </div>

                        {state.values.type !== "Story" && (
                            <div className="space-y-1.5 pt-4 border-t border-[#19376D]/50">
                                <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Estimated Hours</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="999"
                                    value={state.values.estimatedHours || ""}
                                    onChange={(e) => handleChange("estimatedHours", e.target.value ? parseFloat(e.target.value) : undefined)}
                                    placeholder="e.g. 8"
                                    className="bg-[#19376D]/20 border-[#576CBC]/20 text-white placeholder:text-[#576CBC]/40 text-sm h-10 focus-visible:ring-[#A5D7E8]/20 focus-visible:border-[#A5D7E8]/50"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#19376D] bg-[#19376D]/5">

                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" className="text-[#576CBC] hover:text-white hover:bg-transparent" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={state.isSubmitting}
                            className="font-bold bg-[#A5D7E8] text-[#0B2447] hover:bg-white transition-all shadow-[0_0_15px_rgba(165,215,232,0.2)] h-9 px-6"
                        >
                            {state.isSubmitting ? "Saving..." : editIssue ? "Save Changes" : parentStoryId ? "Add Task" : "Create Issue"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default IssueCreationModal;
