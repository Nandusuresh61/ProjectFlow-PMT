import { PlanType } from "../../enums/PlanType";
import { z } from "zod";

export const CreatePlanSchema = z.object({
  type: z.nativeEnum(PlanType, { message: "Invalid plan type" }),

  priceMonthly: z.number({ message: "Price is required" }).min(0, "Price cannot be negative"),

  description: z.string({ message: "Description is required" }).min(1, "Description is required"),

  maxProjects: z
    .number({ message: "Max projects count is required" })
    .min(-1, "Max projects cannot be less than -1")
    .optional(),

  maxMembers: z
    .number({ message: "Max members count is required" })
    .min(-1, "Max members cannot be less than -1")
    .optional(),

  features: z
    .array(z.string().min(1), { message: "Features are required" })
    .min(1, "At least one feature is required"),
}).superRefine((data, ctx) => {
  if (data.type === PlanType.FREE && data.priceMonthly !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Free plan must have 0 price",
      path: ["priceMonthly"],
    });
  }

  if (data.type !== PlanType.ENTERPRISE) {
    if (data.maxProjects === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max projects count is required",
        path: ["maxProjects"],
      });
    }
    if (data.maxMembers === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max members count is required",
        path: ["maxMembers"],
      });
    }
  }
});

export type CreatePlanSchemaType = z.infer<typeof CreatePlanSchema>;
