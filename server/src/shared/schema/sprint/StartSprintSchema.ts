import { z } from "zod";

export const StartSprintSchema = z.object({
  sprintId: z.string().min(1, { message: "Sprint ID is required" }),
  startDate: z.string().or(z.date()).refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid start date" }),
  endDate: z.string().or(z.date()).refine((val) => !isNaN(new Date(val).getTime()), { message: "Invalid end date" }),
});
