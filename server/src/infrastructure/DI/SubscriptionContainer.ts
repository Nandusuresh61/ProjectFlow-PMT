import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { PlanRepository } from "../repositories/PlanRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { RazorpayService } from "../services/RazorpayService";
import { UidService } from "../services/UidService";
import { CreateSubscriptionUseCase } from "@/application/use-cases/Subscription/CreateSubscriptionUseCase";
import { UpgradeSubscriptionUseCase } from "@/application/use-cases/Subscription/UpgradeSubscriptionUseCase";
import { VerifyPaymentUseCase } from "@/application/use-cases/Subscription/VerifyPaymentUseCase";
import { GetSubscriptionDetailsUseCase } from "@/application/use-cases/Subscription/GetSubscriptionDetailsUseCase";
import { SubscriptionController } from "@/presentation/controllers/SubscriptionController";

export const subscriptionRepo = new SubscriptionRepository();
const planRepo = new PlanRepository();
const workspaceRepo = new WorkspaceRepository();
const projectRepo = new ProjectRepository();
const membershipRepo = new MembershipRepository();
const paymentService = new RazorpayService();
const uidGenerator = new UidService();

export const createSubscriptionUseCase = new CreateSubscriptionUseCase(subscriptionRepo, uidGenerator);
export const upgradeSubscriptionUseCase = new UpgradeSubscriptionUseCase(subscriptionRepo, planRepo, projectRepo, membershipRepo, paymentService);
export const verifyPaymentUseCase = new VerifyPaymentUseCase(subscriptionRepo, planRepo, workspaceRepo, paymentService, uidGenerator);
export const getSubscriptionDetailsUseCase = new GetSubscriptionDetailsUseCase(subscriptionRepo, planRepo, projectRepo, membershipRepo);

export const subscriptionController = new SubscriptionController(
  upgradeSubscriptionUseCase,
  verifyPaymentUseCase,
  getSubscriptionDetailsUseCase
);

