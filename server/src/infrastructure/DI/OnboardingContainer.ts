import { CompleteOnboardingUseCase } from "@/application/use-cases/Onboarding/CompleteOnboardingUseCase";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { OrganizationRepository } from "../repositories/MongoOrganizationRepository";
import { MongoPlanRepository } from "../repositories/MongoPlanRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { UidService } from "../services/UidService";
import { OnboardingController } from "@/presentation/controllers/OnboardingController";

const orgRepo = new OrganizationRepository();
const membershipRepo = new MembershipRepository();
const userRepo = new MongoUserRepository();
const planRepo = new MongoPlanRepository();
const uidGenerator = new UidService();

const completeOnboardingUseCase = new CompleteOnboardingUseCase(
  userRepo,
  orgRepo,
  membershipRepo,
  planRepo,
  uidGenerator
);

export const onboardingController = new OnboardingController(
  completeOnboardingUseCase
);

