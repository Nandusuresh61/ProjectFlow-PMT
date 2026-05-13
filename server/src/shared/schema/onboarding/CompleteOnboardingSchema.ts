import { z } from "zod";
import { WorkspaceRoleEnum } from "../../enums/WorkspaceRolesEnum";

export const CompleteOnboardingSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(100, "Workspace name cannot exceed 100 characters"),

  invites: z
    .array(
      z.object({
        email: z.string().email("Invalid email address"),
        role: z.nativeEnum(WorkspaceRoleEnum),
      }),
    )
    .optional(),
});
