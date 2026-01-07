import { z } from "zod";

export const RegisterUserSchema = z.object({
  fullName: z.string().min(3, "Fullname must be atleast 3 letters!"),
  email: z.string().email("Invalid Email Address!"),
  password: z.string().min(8, "Password must be atleast 8 characters!"),
});

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;
