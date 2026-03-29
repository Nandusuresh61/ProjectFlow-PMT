import { z } from "zod";

export const UpdateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters")
      .max(100, "Project name cannot exceed 100 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(500, "Project description cannot exceed 500 characters")
      .optional()
      .nullable(),
    memberIds: z
      .array(z.string().trim().min(1, "Member ID is required"))
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.memberIds !== undefined,
    {
      message: "At least one field is required to update the project",
    }
  );
