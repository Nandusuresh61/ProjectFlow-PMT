import { z } from "zod";

export const UpdateSprintSchema = z.object({
  sprintId: z.string().min(1, { message: "Sprint ID is required" }),
  name: z.string().min(1, { message: "Sprint name cannot be empty" }).optional(),
  goal: z.string().optional(),
  startDate: z.string().or(z.date()).optional().refine((val) => !val || !isNaN(new Date(val).getTime()), { message: "Invalid start date" }),
  endDate: z.string().or(z.date()).optional().refine((val) => !val || !isNaN(new Date(val).getTime()), { message: "Invalid end date" }),
  workspaceId: z.string().min(1, { message: "Workspace ID is required" }),
});

export type UpdateSprintInput = z.infer<typeof UpdateSprintSchema>;
