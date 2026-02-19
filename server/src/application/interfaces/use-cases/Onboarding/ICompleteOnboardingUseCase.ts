import { CompleteOnboardingDto } from "@/application/dtos/CompleteOnboardingDto";

export interface ICompleteOnboardingUseCase {
  execute(dto: CompleteOnboardingDto): Promise<{ workspaceId: string }>;
}
