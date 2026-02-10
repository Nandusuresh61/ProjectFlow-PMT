import { z } from "zod";

export const TeamInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["Admin", "Member"]),
});

export const CompleteOnboardingSchema = z.object({
  workspaceName: z.string().min(3).max(50),
  plan: z.enum(["free", "pro", "enterprise"]),
  teamInvites: z.array(TeamInviteSchema).optional().default([]),
});


export type CompletedOnboardingInput = z.infer<typeof CompleteOnboardingSchema>;
export type TeamInviteInput = z.infer<typeof TeamInviteSchema>;