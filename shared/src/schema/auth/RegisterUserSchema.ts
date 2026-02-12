import { z } from "zod";

export const RegisterUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must not exceed 50 characters")
    .regex(
      /^[A-Za-z ]+$/,
      "Full name can contain only letters and spaces"
    ),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must not exceed 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
    
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .regex(/^\S*$/, "Password must not contain spaces"),
});

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;
