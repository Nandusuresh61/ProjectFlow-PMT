import { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";

export interface CompleteOnboardingDto {
  userId: string;
  workspaceName: string;
  planId: string;
  invites?: {
    email: string;
    role: WorkspaceRoleEnum;
  }[];
}
