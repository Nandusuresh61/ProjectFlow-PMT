import { MongoSubscriptionRepository } from "../repositories/MongoSubscriptionRepository";
import { MongoPlanRepository } from "../repositories/MongoPlanRepository";
import { WorkspaceRepository } from "../repositories/MongoWorkspaceRepository";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { RazorpayService } from "../services/RazorpayService";
import { UidService } from "../services/UidService";
import { CreateSubscriptionUseCase } from "@/application/use-cases/Subscription/CreateSubscriptionUseCase";
import { UpgradeSubscriptionUseCase } from "@/application/use-cases/Subscription/UpgradeSubscriptionUseCase";
import { VerifyPaymentUseCase } from "@/application/use-cases/Subscription/VerifyPaymentUseCase";
import { GetSubscriptionDetailsUseCase } from "@/application/use-cases/Subscription/GetSubscriptionDetailsUseCase";
import { SubscriptionController } from "@/presentation/controllers/SubscriptionController";

export const subscriptionRepo = new MongoSubscriptionRepository();
const planRepo = new MongoPlanRepository();
const workspaceRepo = new WorkspaceRepository();
const projectRepo = new MongoProjectRepository();
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

