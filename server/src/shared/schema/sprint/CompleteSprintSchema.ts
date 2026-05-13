import { z } from "zod";

export const CompleteSprintSchema = z.object({
  moveToSprintId: z.string().nullable().optional(),
  workspaceId: z.string().min(1, { message: "Workspace ID is required" }),
});
