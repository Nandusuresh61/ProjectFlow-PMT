import { z } from "zod";

export const UpdateUserProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .optional(),

  profileImage: z
    .string()
    .url("Profile image must be a valid URL")
    .optional(),
});