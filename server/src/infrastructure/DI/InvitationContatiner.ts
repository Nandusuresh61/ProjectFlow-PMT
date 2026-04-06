import { CreateInvitationUseCase } from "@/application/use-cases/Invitation/CreateInvitationUseCase";
import { WorkspaceRepository } from "../repositories/MongoWorkspaceRepository";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { MongoPlanRepository } from "../repositories/MongoPlanRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { MongoInvitationRepository } from "../repositories/MongoInvitationRepository";
import { EmailService } from "../services/EmailService";
import { PasswordHash } from "../services/PasswordHash";
import { UidService } from "../services/UidService";
import { InvitationController } from "@/presentation/controllers/InvitationController";
import { AcceptInvitationUseCase } from "@/application/use-cases/Invitation/AcceptInvitationUseCase";
import { GetInvitationDetailsUseCase } from "@/application/use-cases/Invitation/GetInvitationDetailsUseCase";

const workspaceRepo = new WorkspaceRepository();
const membershipRepo = new MembershipRepository();
const planRepo = new MongoPlanRepository();
const userRepo = new MongoUserRepository();
const invitationRepo = new MongoInvitationRepository();

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
);

const acceptInvitationUseCase = new AcceptInvitationUseCase(
  invitationRepo,
  membershipRepo,
  userRepo,
  passwordHasher,
  uidGenerator
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
