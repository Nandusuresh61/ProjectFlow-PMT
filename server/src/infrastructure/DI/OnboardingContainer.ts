import { CompleteOnboardingUseCase } from "@/application/use-cases/Onboarding/CompleteOnboardingUseCase";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { PlanRepository } from "../repositories/PlanRepository";
import { UserRepository } from "../repositories/UserRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { UidService } from "../services/UidService";
import { OnboardingController } from "@/presentation/controllers/OnboardingController";
import { createInvitationUseCase } from "./InvitationContatiner";

const workspaceRepo = new WorkspaceRepository();
const membershipRepo = new MembershipRepository();
const userRepo = new UserRepository();
const planRepo = new PlanRepository();
const subscriptionRepo = new SubscriptionRepository();
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

