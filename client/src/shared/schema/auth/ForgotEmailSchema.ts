import z from "zod";

export const ForgotEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),
});

export type ForgotEmailSchemaType = z.infer<typeof ForgotEmailSchema>;