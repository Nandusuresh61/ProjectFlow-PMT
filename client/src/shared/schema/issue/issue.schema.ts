import { z } from "zod";

export const issueFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.enum(["Story", "Task", "Bug"]),
    status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE"]),
    priority: z.enum(["Low", "Medium", "High"]),
    size: z.enum(["XS", "S", "M", "L", "XL", ""]).optional(),
    assignee: z.string().optional(),
    sprint: z.string().optional(),
    parentId: z.string().optional(),
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


