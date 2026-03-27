import { z } from "zod";

export const LoginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(64, "Password is too long"),
});

export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;
