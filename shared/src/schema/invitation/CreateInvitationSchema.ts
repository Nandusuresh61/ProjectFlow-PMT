import { z } from "zod";
import { WorkspaceRoleEnum } from "../../enums";


export const CreateInvitationSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(WorkspaceRoleEnum),
});