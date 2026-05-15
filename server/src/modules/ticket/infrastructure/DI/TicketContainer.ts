import { MongoTicketRepository } from "../repositories/MongoTicketRepository";
import { MongoTicketMessageRepository } from "../repositories/MongoTicketMessageRepository";
import { WorkspaceRepository } from "@/infrastructure/repositories/MongoWorkspaceRepository";
import { MongoPlanRepository } from "@/infrastructure/repositories/MongoPlanRepository";
import { UidService } from "@/infrastructure/services/UidService";
import { MembershipRepository } from "@/infrastructure/repositories/MongoMembershipRepository";
import { MongoUserRepository } from "@/infrastructure/repositories/MongoUserRepository";

import { CreateTicketUseCase } from "../../application/use-cases/CreateTicketUseCase";
import { ReplyToTicketUseCase } from "../../application/use-cases/ReplyToTicketUseCase";
import { GetWorkspaceTicketsUseCase } from "../../application/use-cases/GetWorkspaceTicketsUseCase";
import { GetTicketDetailsUseCase } from "../../application/use-cases/GetTicketDetailsUseCase";
import { UpdateTicketStatusUseCase } from "../../application/use-cases/UpdateTicketStatusUseCase";
import { GetAllTicketsUseCase } from "../../application/use-cases/GetAllTicketsUseCase";

import { TicketController } from "../../presentation/controllers/TicketController";

const ticketRepository = new MongoTicketRepository();
const ticketMessageRepository = new MongoTicketMessageRepository();
const workspaceRepository = new WorkspaceRepository();
const planRepository = new MongoPlanRepository();
const uidGenerator = new UidService();
const membershipRepository = new MembershipRepository();
const userRepository = new MongoUserRepository();

const createTicketUseCase = new CreateTicketUseCase(
  ticketRepository,
  ticketMessageRepository,
  workspaceRepository,
  planRepository,
  uidGenerator
);

const replyToTicketUseCase = new ReplyToTicketUseCase(
  ticketRepository,
  ticketMessageRepository,
  uidGenerator
);

const getWorkspaceTicketsUseCase = new GetWorkspaceTicketsUseCase(ticketRepository);

const getTicketDetailsUseCase = new GetTicketDetailsUseCase(
  ticketRepository,
  ticketMessageRepository,
  membershipRepository,
  userRepository
);

const updateTicketStatusUseCase = new UpdateTicketStatusUseCase(ticketRepository);

const getAllTicketsUseCase = new GetAllTicketsUseCase(ticketRepository, workspaceRepository);

export const ticketController = new TicketController(
  createTicketUseCase,
  replyToTicketUseCase,
  getWorkspaceTicketsUseCase,
  getTicketDetailsUseCase,
  updateTicketStatusUseCase,
  getAllTicketsUseCase,
  membershipRepository
);
