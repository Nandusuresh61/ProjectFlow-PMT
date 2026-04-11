import { z } from "zod";

export const UpdateIssueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(55, "Title is too long")
    .optional(),
  description: z.string().trim().optional(),
  type: z.enum(["STORY", "TASK", "BUG"]).optional(),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE", "TESTING", "READY"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  sizeLabel: z.enum(["XS", "S", "M", "L", "XL"]).optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  sprintId: z.string().optional().nullable(),
  subtasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        completed: z.boolean(),
      })
    )
    .optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.enum(["IMAGE", "PDF", "LINK"]),
      })
    )
    .optional(),
  parentId: z.string().optional().nullable(),
});
