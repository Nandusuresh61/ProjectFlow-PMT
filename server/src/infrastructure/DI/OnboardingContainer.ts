import { CompleteOnboardingUseCase } from "@/application/use-cases/Onboarding/CompleteOnboardingUseCase";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { WorkspaceRepository } from "../repositories/MongoWorkspaceRepository";
import { MongoPlanRepository } from "../repositories/MongoPlanRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { MongoSubscriptionRepository } from "../repositories/MongoSubscriptionRepository";
import { UidService } from "../services/UidService";
import { OnboardingController } from "@/presentation/controllers/OnboardingController";
import { createInvitationUseCase } from "./InvitationContatiner";

const workspaceRepo = new WorkspaceRepository();
const membershipRepo = new MembershipRepository();
const userRepo = new MongoUserRepository();
const planRepo = new MongoPlanRepository();
const subscriptionRepo = new MongoSubscriptionRepository();
const uidGenerator = new UidService();

const completeOnboardingUseCase = new CompleteOnboardingUseCase(
  userRepo,
  workspaceRepo,
  membershipRepo,
  planRepo,
  subscriptionRepo,
  uidGenerator,
  createInvitationUseCase
);

export const onboardingController = new OnboardingController(
  completeOnboardingUseCase
);

