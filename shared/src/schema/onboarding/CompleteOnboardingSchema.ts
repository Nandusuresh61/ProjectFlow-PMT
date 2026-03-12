import { z } from "zod";
import { WorkspaceRoleEnum } from "../../enums";

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

  invites: z
    .array(
      z.object({
        email: z.string().email("Invalid email address"),
        role: z.nativeEnum(WorkspaceRoleEnum),
      }),
    )
    .optional(),
});
