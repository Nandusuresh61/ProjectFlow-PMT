import { z } from "zod";

export const AddCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment content is required")
    .max(2000, "Comment is too long"),
  mentions: z.array(z.string()).optional(),
  attachments: z.array(z.string().url("Invalid attachment URL")).optional(),
});
