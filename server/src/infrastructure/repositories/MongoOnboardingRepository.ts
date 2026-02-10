import { OnboardingStatus } from "@/domain/entities/Onboarding/OnboardingStatus";
import { OnboardingStatusModel } from "../database/models/MongoOnboardingStatusModel";
import { IOnboardingRepository } from "@/application/interfaces/repositories/IOnboardingRepository";

export class MongoOnboardingRepository implements IOnboardingRepository {
  async findByUserId(userId: string): Promise<OnboardingStatus | null> {
    return OnboardingStatusModel.findOne({ userId });
  }

  async create(data: OnboardingStatus): Promise<OnboardingStatus> {
    const status = new OnboardingStatusModel(data);
    return await status.save();
  }
}