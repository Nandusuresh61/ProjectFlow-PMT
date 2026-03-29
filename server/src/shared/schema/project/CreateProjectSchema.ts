import { z } from "zod";

export const CreateProjectSchema = z.object({
  workspaceId: z.string().trim().min(1, "Workspace ID is required"),
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Project description cannot exceed 500 characters")
    .optional()
    .nullable(),
  memberIds: z
    .array(z.string().trim().min(1, "Member ID is required"))
    .optional()
    .default([]),
});
