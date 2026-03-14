import { WorkspaceRoleEnum } from "shared";

export interface CompleteOnboardingDto {
  userId: string;
  workspaceName: string;
  planId: string;
  invites?: {
    email: string;
    role: WorkspaceRoleEnum;
  }[];
}
