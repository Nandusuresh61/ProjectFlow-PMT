export interface TeamInviteDto {
  email: string;
  role: "Admin" | "Member";
}

export interface CompletedOnboardingDto {
    userId: string;
    workspaceName: string;
    plan: "free" | "pro" | "enterprise";
    teamInvites: TeamInviteDto[];
}

export interface OnboardingResponseDto {
    workspaceId: string;
    workspaceName: string;
    plan: string;
    invitesSent: number;
}
