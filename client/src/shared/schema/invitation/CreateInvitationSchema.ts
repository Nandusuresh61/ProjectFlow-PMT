import { z } from "zod";
import { WorkspaceRoleEnum } from "../../enums/WorkspaceRolesEnum";

export const CreateInvitationSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  role: z.nativeEnum(WorkspaceRoleEnum, {
    message: "Please select a valid role",
  }),
});

export type CreateInvitationType = z.infer<typeof CreateInvitationSchema>;
