import { CompletedOnboardingInput } from "shared";
import { CompletedOnboardingDto } from "../dtos/OnboardingDtos";

export class OnboardingRequestMapper {
  static toCompleteOnboardingDto(
    data: CompletedOnboardingInput,
    userId: string,
  ): CompletedOnboardingDto {
    return {
      userId,
      workspaceName: data.workspaceName,
      plan: data.plan,
      teamInvites: (data.teamInvites ?? []).map((invite) => ({
        email: invite.email,
        role: invite.role,
      })),
    };
  }
}
