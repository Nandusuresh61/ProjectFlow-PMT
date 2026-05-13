import { z } from "zod";

export const CreateSprintSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1),
  goal: z.string().optional(),
});