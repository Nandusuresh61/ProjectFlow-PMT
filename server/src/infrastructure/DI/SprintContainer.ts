import { CreateSprintUseCase } from "@/application/use-cases/Sprint/CreateSprintUseCase";
import { GetSprintsByProjectUseCase } from "@/application/use-cases/Sprint/GetSprintsByProjectUseCase";
import { AssignIssueToSprintUseCase } from "@/application/use-cases/Sprint/AssignIssueToSprintUseCase";
import { StartSprintUseCase } from "@/application/use-cases/Sprint/StartSprintUseCase";
import { GetActiveSprintUseCase } from "@/application/use-cases/Sprint/GetActiveSprintUseCase";
import { SprintController } from "@/presentation/controllers/SprintController";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { MongoIssueRepository } from "../repositories/MongoIssueRepository";
import { UidService } from "../services/UidService";
import { SprintRepository } from "../repositories/MongoSprintRepository";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";

const sprintRepository = new SprintRepository();
const projectRepository = new MongoProjectRepository();
const issueRepository = new MongoIssueRepository();
const membershipRepository = new MembershipRepository();
const uidGenarator = new UidService();
const createSprintUseCase = new CreateSprintUseCase(
  projectRepository,
  uidGenarator,
  sprintRepository,
  membershipRepository,
);

const getSprintsByProjectUseCase = new GetSprintsByProjectUseCase(
  projectRepository,
  membershipRepository,
  sprintRepository,
);

const assignIssueToSprintUseCase = new AssignIssueToSprintUseCase(
  issueRepository,
  sprintRepository,
  projectRepository,
  membershipRepository,
);

const startSprintUseCase = new StartSprintUseCase(
  sprintRepository
);

const getActiveSprintUseCase = new GetActiveSprintUseCase(
  projectRepository,
  membershipRepository,
  sprintRepository,
  issueRepository
);

export const sprintController = new SprintController(
  createSprintUseCase,
  getSprintsByProjectUseCase,
  assignIssueToSprintUseCase,
  startSprintUseCase,
  getActiveSprintUseCase
);
