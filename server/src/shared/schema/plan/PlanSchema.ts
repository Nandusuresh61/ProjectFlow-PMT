import { PlanType } from "../../enums/PlanType";
import { z } from "zod";

export const CreatePlanSchema = z.object({
  type: z.nativeEnum(PlanType, { message: "Invalid plan type" }),

  priceMonthly: z.number({ message: "Price is required" }).min(0, "Price cannot be negative"),

  description: z.string({ message: "Description is required" }).min(1, "Description is required"),

  maxProjects: z.number({ message: "Max projects count is required" }).min(-1, "Max projects cannot be less than -1"),

  maxMembers: z.number({ message: "Max members count is required" }).min(-1, "Max members cannot be less than -1"),

  features: z
    .array(z.string().min(1), { message: "Features are required" })
    .min(1, "At least one feature is required"),
}).refine((data) => {
  if (data.type === PlanType.FREE && data.priceMonthly !== 0) {
    return false;
  }
  return true;
}, {
  message: "Free plan must have 0 price",
  path: ["priceMonthly"],
});

export type CreatePlanSchemaType = z.infer<typeof CreatePlanSchema>;
