import z, { email } from "zod";
import { TokenEnums } from "../enums";

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  isSuperAdmin: z.boolean(),
  isBlocked: z.boolean(),
  type: z.nativeEnum(TokenEnums),
});

export type TokenPayloadType = z.infer<typeof TokenPayloadSchema>;
