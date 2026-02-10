import { MongoOnboardingRepository } from "@/infrastructure/repositories/MongoOnboardingRepository";
import { UidService } from "@/infrastructure/services/UidService";
import { OnboardingController } from "@/presentation/controllers/OnboardingController";
import { MongoWorkspaceRepostitory } from "../repositories/MongoWorkspaceRepository";
import { CompleteOnboardingUseCase } from "@/application/use-cases/Workspace/CompleteOnboardingUseCase";

const workspaceRepository = new MongoWorkspaceRepostitory();
const onboardingRepository = new MongoOnboardingRepository();
const uidService = new UidService();

const completeOnboardingUseCase = new CompleteOnboardingUseCase(
  workspaceRepository,
  onboardingRepository,
  uidService,
);

export const onboardingController = new OnboardingController(
  completeOnboardingUseCase,
  onboardingRepository,
);