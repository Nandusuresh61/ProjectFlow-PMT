import type { WorkspaceRoleEnum } from "@/shared/enums/WorkspaceRolesEnum";
import type { Plan } from "./plan.types";

export interface CompleteOnboardingPayload {
  workspaceName: string;
  invites?: {
    email: string;
    role: WorkspaceRoleEnum;
  }[];
}


export interface TeamMember {
  email: string;
  role: WorkspaceRoleEnum;
}

export interface OnboardingState {
  workspaceName: string;
  teamMembers: TeamMember[];
}

export type WorkspaceValues = { workspaceName: string };




export interface StepTeamProps {
  data: OnboardingState;
  updateData: (data: Partial<OnboardingState>) => void;
  onBack: () => void;
  onFinish: () => void;
  isLoading?: boolean;
}

export interface StepWorkspaceProps {
  initialName: string;
  onSubmit: (values: WorkspaceValues) => Promise<void>;
}