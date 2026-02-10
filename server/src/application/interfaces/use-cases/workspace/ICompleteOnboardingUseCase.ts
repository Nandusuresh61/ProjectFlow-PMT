import {
  CompletedOnboardingDto,
  OnboardingResponseDto,
} from "@/application/dtos/OnboardingDtos";

export interface ICompleteOnboardingUseCase {
  execute(dto: CompletedOnboardingDto): Promise<OnboardingResponseDto>;
}
