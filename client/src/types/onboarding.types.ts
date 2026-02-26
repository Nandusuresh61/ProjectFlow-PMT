import type { WorkspaceRoleEnum } from "shared";
import type { Plan } from "./plan.types";

export interface CompleteOnboardingPayload {
  workspaceName: string;
  planId: string;
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
  planId: string;
  teamMembers: TeamMember[];
}

export type WorkspaceValues = { workspaceName: string };


export interface StepPlanProps {
  data: OnboardingState;
  plans: Plan[];
  loading: boolean;
  updateData: (data: Partial<OnboardingState>) => void;
  onNext: () => void;
  onBack: () => void;
}


export interface StepTeamProps {
  data: OnboardingState;
  updateData: (data: Partial<OnboardingState>) => void;
  onBack: () => void;
  onFinish: () => void;
}

export interface StepWorkspaceProps {
  initialName: string;
  onSubmit: (values: WorkspaceValues) => Promise<void>;
}