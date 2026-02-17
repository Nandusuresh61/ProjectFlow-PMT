import { z } from "zod";

export const CompleteOnboardingSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(100, "Workspace name cannot exceed 100 characters"),

  planId: z
    .string()
    .trim()
    .min(1, "Plan ID is required"),
});
