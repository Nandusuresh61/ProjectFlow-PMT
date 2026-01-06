import z, { email } from "zod";
import { TokenEnums } from "../enums";

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  isSuperAdmin: z.boolean(),
  type: z.enum(TokenEnums),
});

export type TokenPayloadType = z.infer<typeof TokenPayloadSchema>;
