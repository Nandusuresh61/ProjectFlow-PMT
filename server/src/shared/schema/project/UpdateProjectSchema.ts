import { z } from "zod";

export const UpdateProjectSchema = z
  .object({
    projectKey: z
      .string()
      .trim()
      .min(2, "Project key must be at least 2 characters")
      .max(5, "Project key cannot exceed 5 characters")
      .regex(/^[A-Za-z0-9]+$/, "Project key must be alphanumeric")
      .transform((val) => val.toUpperCase())
      .optional(),
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
      data.projectKey !== undefined ||
      data.name !== undefined ||
      data.description !== undefined ||
      data.memberIds !== undefined,
    {
      message: "At least one field is required to update the project",
    }
  );
