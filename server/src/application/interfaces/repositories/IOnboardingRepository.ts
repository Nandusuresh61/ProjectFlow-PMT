import { OnboardingStatus } from "@/domain/entities/Onboarding/OnboardingStatus";

export interface IOnboardingRepository {
    findByUserId(userId:string): Promise<OnboardingStatus | null>;
    create(data: OnboardingStatus): Promise<OnboardingStatus>;
}