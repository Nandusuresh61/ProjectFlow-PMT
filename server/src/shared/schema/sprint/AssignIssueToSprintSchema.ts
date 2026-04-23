import { z } from "zod";

export const AssignIssueToSprintSchema = z.object({
  issueId: z.string().min(1, "Issue ID is required"),
  sprintId: z.string().nullable(),
});
