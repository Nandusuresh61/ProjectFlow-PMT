import { z } from "zod";
import { WorkspaceRoleEnum } from "../../enums/WorkspaceRolesEnum";

export const CreateInvitationSchema = z.object({
  invites: z
    .array(
      z.object({
        email: z.string().email(),
        role: z.nativeEnum(WorkspaceRoleEnum),
      }),
    )
    .min(1),
});
