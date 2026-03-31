import React, { useCallback, useReducer, useEffect, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X, BookOpen, CheckSquare, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Zod Schema
const issueFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.enum(["Story", "Task", "Bug"]),
    priority: z.enum(["Low", "Medium", "High"]),
    size: z.enum(["XS", "S", "M", "L", "XL", ""]).optional(),
    assignee: z.string().optional(),
    sprint: z.string().optional(),
    subtasks: z.array(z.object({
        id: z.string(),
        title: z.string().min(1, "Subtask title is required"),
        completed: z.boolean().default(false)
    })).optional()
}).superRefine((data, ctx) => {
    if (data.type === "Story" && !data.size) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Size is required for story type",
            path: ["size"],
        });
    }
});

type FormValues = {
    title: string;
    description: string;
    type: "Story" | "Task" | "Bug";
    priority: "Low" | "Medium" | "High";
    size: "XS" | "S" | "M" | "L" | "XL" | "";
    assignee: string;
    sprint: string;
    subtasks: { id: string; title: string; completed: boolean }[];
};

type FormState = {
    values: FormValues;
    errors: Partial<Record<keyof FormValues | string, string>>;
    touched: Partial<Record<keyof FormValues | string, boolean>>;
    isSubmitting: boolean;
};

type FormAction =
    | { type: "SET_VALUE"; field: string; value: any }
    | { type: "SET_ERRORS"; errors: Partial<Record<string, string>> }
    | { type: "TOUCH"; field: string }
    | { type: "SET_SUBMITTING"; isSubmitting: boolean }
    | { type: "RESET"; values: FormValues };

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

const initialValues: FormValues = {
    title: "",
    description: "",
    type: "Story",
    priority: "Medium",
    size: "",
    assignee: "",
    sprint: "Backlog",
    subtasks: []
};

// Map size to Tailwind classes styles
const sizeColors = {
    "XS": "bg-slate-100 text-slate-800",
    "S": "bg-blue-100 text-blue-800",
    "M": "bg-green-100 text-green-800",
    "L": "bg-yellow-100 text-yellow-800",
    "XL": "bg-red-100 text-red-800"
};

import { createIssue } from "@/services/issue/issue.api";
import { toast } from "sonner";
import { getMembers } from "@/services/workspace/team.api";

export function IssueCreationModal({ open, onOpenChange, project }: { open: boolean, onOpenChange: (open: boolean) => void, project?: { key: string, id: string, workspaceId: string, memberIds: string[] } }) {
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        if (open && project?.workspaceId) {
            getMembers(project.workspaceId).then(res => {
                if (res?.data) {
                    setMembers(res.data.filter((m: any) => project.memberIds?.includes(m.userId)));
                }
            }).catch(err => console.error("Failed to load members", err));
        }
    }, [open, project]);

    const [state, dispatch] = useReducer(formReducer, {
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
    });

    // Reset when opened
    useEffect(() => {
        if (open) {
            dispatch({ type: "RESET", values: initialValues });
        }
    }, [open]);

    const handleChange = useCallback((field: string, value: any) => {
        dispatch({ type: "SET_VALUE", field, value });
    }, []);

    const handleBlur = useCallback((field: string) => {
        dispatch({ type: "TOUCH", field });
    }, []);

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

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Touch all fields
        const allFields = ["title", "description", "type", "priority", "size", "assignee", "sprint"];
        allFields.forEach(f => dispatch({ type: "TOUCH", field: f }));

        const result = issueFormSchema.safeParse(state.values);
        if (!result.success) {
            const errorMap: Record<string, string> = {};
            result.error.issues.forEach(issue => {
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

            const response = await createIssue({
                title: state.values.title,
                description: state.values.description,
                type: state.values.type.toUpperCase() as "STORY" | "TASK" | "BUG",
                priority: state.values.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
                sizeLabel: state.values.size || null,
                assigneeId: state.values.assignee || null,
                sprintId: state.values.sprint === "Backlog" ? null : state.values.sprint,
                projectId: project.id,
                workspaceId: project.workspaceId,
                subtasks: state.values.subtasks,
            });

            toast.success(response.message || "Issue created successfully");
            onOpenChange(false);
            dispatch({ type: "RESET", values: initialValues });
        } catch (error: any) {
            toast.error(error.message || "Failed to create issue");
        } finally {
            dispatch({ type: "SET_SUBMITTING", isSubmitting: false });
        }
    }, [state.values, onOpenChange]);

    // Keyboard shortcut (Cmd/Ctrl + Enter)
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
                className="max-w-4xl bg-[#060d1a] border-[#19376D] text-white p-0 overflow-hidden shadow-2xl gap-0"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#19376D] flex items-center justify-between bg-[#19376D]/10">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-[#19376D] text-[#A5D7E8] px-2 py-1 rounded">{project?.key || "PF"}</span>
                        <DialogTitle className="text-lg font-bold">Create New Issue</DialogTitle>
                    </div>
                </div>

                <div className="flex h-[600px]">
                    {/* Main Body */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6">
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

                        <div className="space-y-1.5 flex flex-col h-64">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Description</Label>
                            <textarea
                                value={state.values.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Add a markdown description..."
                                className="flex-1 w-full bg-[#19376D]/10 border border-[#576CBC]/20 rounded-md p-3 text-white placeholder:text-[#576CBC]/40 focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 focus:border-[#A5D7E8]/50 resize-none transition-all"
                            />
                        </div>

                        {/* Subtasks */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-[#19376D]/50 pb-2">
                                <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Subtasks</Label>
                                <button type="button" onClick={addSubtask} className="text-xs font-bold text-[#A5D7E8] hover:text-white transition-colors flex items-center gap-1">
                                    <Plus size={12} /> Add Subtask
                                </button>
                            </div>

                            {state.values.subtasks.map((task, idx) => (
                                <div key={task.id} className="flex items-center gap-2 group">
                                    <input type="checkbox" disabled className="w-4 h-4 outline-none rounded appearance-none border border-[#576CBC]/40 bg-[#19376D]/20 opacity-50 cursor-not-allowed checked:bg-[#A5D7E8]" />
                                    <Input
                                        value={task.title}
                                        onChange={(e) => updateSubtask(idx, e.target.value)}
                                        placeholder="What needs to be done?"
                                        className="h-8 bg-transparent border-transparent hover:border-[#576CBC]/20 focus-visible:bg-[#19376D]/10 focus-visible:border-[#A5D7E8]/50 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSubtask(idx)}
                                        className="text-[#576CBC] opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all p-1"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {state.values.subtasks.length === 0 && (
                                <p className="text-xs text-[#576CBC]/50 italic">No subtasks added.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-72 bg-[#19376D]/5 border-l border-[#19376D] p-6 space-y-6 overflow-y-auto">
                        
                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Issue Type *</Label>
                            <div className="relative">
                                <select
                                    value={state.values.type}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                    className={cn(
                                        "w-full appearance-none bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 pl-9 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 cursor-pointer",
                                        state.touched.type && state.errors.type && "border-red-500/60"
                                    )}
                                >
                                    <option value="Story" className="bg-[#0b1b36] text-white">Story</option>
                                    <option value="Task" className="bg-[#0b1b36] text-white">Task</option>
                                    <option value="Bug" className="bg-[#0b1b36] text-white">Bug</option>
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#A5D7E8]">
                                    {state.values.type === "Story" && <BookOpen size={14} />}
                                    {state.values.type === "Task" && <CheckSquare size={14} />}
                                    {state.values.type === "Bug" && <Bug size={14} className="text-red-400" />}
                                </div>
                            </div>
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

                        {(state.values.type === "Story") && (
                            <div className="space-y-1.5">
                                <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest flex items-center justify-between">
                                    Size *
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

                        <div className="space-y-1.5">
                            <Label className="text-[#576CBC]/60 text-xs font-bold uppercase tracking-widest">Assignee</Label>
                            <select
                                value={state.values.assignee}
                                onChange={(e) => handleChange("assignee", e.target.value)}
                                className="w-full appearance-none bg-[#19376D]/20 border border-[#576CBC]/20 rounded-md h-10 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A5D7E8]/20 cursor-pointer"
                            >
                                <option value="" className="bg-[#0b1b36] text-white">Unassigned</option>
                                {members.map((member: any) => (
                                    <option key={member.userId} value={member.userId} className="bg-[#0b1b36] text-white">
                                        {member.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

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

                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-[#19376D] bg-[#19376D]/5">
                    <span className="text-xs text-[#576CBC]/60 font-medium">Use <kbd className="font-mono bg-[#19376D]/40 px-1 py-0.5 rounded text-[#A5D7E8]">Cmd</kbd> + <kbd className="font-mono bg-[#19376D]/40 px-1 py-0.5 rounded text-[#A5D7E8]">Enter</kbd> to save</span>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" className="text-[#576CBC] hover:text-white hover:bg-transparent" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button 
                            type="button" 
                            onClick={handleSubmit} 
                            disabled={state.isSubmitting}
                            className="font-bold bg-[#A5D7E8] text-[#0B2447] hover:bg-white transition-all shadow-[0_0_15px_rgba(165,215,232,0.2)] h-9 px-6"
                        >
                            {state.isSubmitting ? "Saving..." : "Create Issue"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default IssueCreationModal;
