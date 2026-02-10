export interface TeamInvite {
  email: string;
  role: "Admin" | "Member";
}

export interface CompleteOnboardingPayload {
  workspaceName: string;
  plan: "free" | "pro" | "enterprise";
  teamInvites: TeamInvite[];
}

export interface OnboardingStatusResponse {
  isCompleted: boolean;
  workspaceId: string | null;
}
