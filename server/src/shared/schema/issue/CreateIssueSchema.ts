import { z } from "zod";

export const CreateIssueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(55, "Title is too long"),
  description: z.string().trim().default(""),
  type: z.enum(["STORY", "TASK", "BUG"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  sizeLabel: z.enum(["XS", "S", "M", "L", "XL"]).optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  sprintId: z.string().optional().nullable(),
  projectId: z.string().min(1, "Project ID is required"),
  workspaceId: z.string().optional(),
  acceptanceCriteria: z
    .array(z.string())
    .optional()
    .default([]),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url(),
        type: z.enum(["IMAGE", "PDF", "LINK"]),
      })
    )
    .optional()
    .default([]),
  parentId: z.string().optional().nullable(),
});
