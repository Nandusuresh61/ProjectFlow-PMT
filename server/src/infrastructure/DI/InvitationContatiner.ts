import { CreateInvitationUseCase } from "@/application/use-cases/Invitation/CreateInvitationUseCase";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { PlanRepository } from "../repositories/PlanRepository";
import { UserRepository } from "../repositories/UserRepository";
import { InvitationRepository } from "../repositories/InvitationRepository";
import { EmailService } from "../services/EmailService";
import { PasswordHash } from "../services/PasswordHash";
import { UidService } from "../services/UidService";
import { workspaceEventTrackingService } from "./WorkspaceEventContainer";
import { InvitationController } from "@/presentation/controllers/InvitationController";
import { AcceptInvitationUseCase } from "@/application/use-cases/Invitation/AcceptInvitationUseCase";
import { GetInvitationDetailsUseCase } from "@/application/use-cases/Invitation/GetInvitationDetailsUseCase";

const workspaceRepo = new WorkspaceRepository();
const membershipRepo = new MembershipRepository();
const planRepo = new PlanRepository();
const userRepo = new UserRepository();
const invitationRepo = new InvitationRepository();

const emailService = new EmailService();
const passwordHasher = new PasswordHash();
const uidGenerator = new UidService();

export const createInvitationUseCase = new CreateInvitationUseCase(
  workspaceRepo,
  membershipRepo,
  planRepo,
  userRepo,
  invitationRepo,
  emailService,
  passwordHasher,
  uidGenerator,
  workspaceEventTrackingService
);

const acceptInvitationUseCase = new AcceptInvitationUseCase(
  invitationRepo,
  membershipRepo,
  userRepo,
  workspaceRepo,
  planRepo,
  passwordHasher,
  uidGenerator,
  workspaceEventTrackingService
);

const getInvitationDetailsUseCase = new GetInvitationDetailsUseCase(
  invitationRepo,
  userRepo
);

export const invitationController = new InvitationController(
  createInvitationUseCase,
  acceptInvitationUseCase,
  getInvitationDetailsUseCase
);
