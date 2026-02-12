import { z } from "zod";

export const CreatePlanSchema = z.object({
  name: z.string({ message: "Plan name is required" }).min(1, "Plan name is required"),

  priceMonthly: z.number({ message: "Price is required" }).min(0, "Price cannot be negative"),

  description: z.string({ message: "Description is required" }).min(1, "Description is required"),

  maxProjects: z.number({ message: "Max projects count is required" }).min(0, "Max projects cannot be negative"),

  maxMembers: z.number({ message: "Max members count is required" }).min(0, "Max members cannot be negative"),

  features: z
    .array(z.string().min(1), { message: "Features are required" })
    .min(1, "At least one feature is required"),
});

export type CreatePlanSchemaType = z.infer<typeof CreatePlanSchema>;
