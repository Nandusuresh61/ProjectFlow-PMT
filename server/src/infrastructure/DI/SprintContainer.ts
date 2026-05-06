import { CreateSprintUseCase } from "@/application/use-cases/Sprint/CreateSprintUseCase";
import { GetSprintsByProjectUseCase } from "@/application/use-cases/Sprint/GetSprintsByProjectUseCase";
import { AssignIssueToSprintUseCase } from "@/application/use-cases/Sprint/AssignIssueToSprintUseCase";
import { StartSprintUseCase } from "@/application/use-cases/Sprint/StartSprintUseCase";
import { GetActiveSprintUseCase } from "@/application/use-cases/Sprint/GetActiveSprintUseCase";
import { CompleteSprintUseCase } from "@/application/use-cases/Sprint/CompleteSprintUseCase";
import { GetProjectPerformanceUseCase } from "@/application/use-cases/Sprint/GetProjectPerformanceUseCase";
import { UpdateSprintUseCase } from "@/application/use-cases/Sprint/UpdateSprintUseCase";
import { SprintController } from "@/presentation/controllers/SprintController";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { MongoIssueRepository } from "../repositories/MongoIssueRepository";
import { UidService } from "../services/UidService";
import { SprintRepository } from "../repositories/MongoSprintRepository";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { MongoSprintAnalyticsRepository } from "../repositories/MongoSprintAnalyticsRepository";
import { MongoWorkLogRepository } from "../repositories/MongoWorkLogRepository";
import { SprintMetricsCalculatorService } from "@/application/services/SprintMetricsCalculatorService";

const sprintRepository = new SprintRepository();
const projectRepository = new MongoProjectRepository();
const issueRepository = new MongoIssueRepository();
const membershipRepository = new MembershipRepository();
const uidGenarator = new UidService();
const sprintAnalyticsRepository = new MongoSprintAnalyticsRepository();
const workLogRepository = new MongoWorkLogRepository();
const sprintMetricsCalculatorService = new SprintMetricsCalculatorService();

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
  sprintRepository,
  issueRepository,
  projectRepository,
  membershipRepository
);

const getActiveSprintUseCase = new GetActiveSprintUseCase(
  projectRepository,
  membershipRepository,
  sprintRepository,
  issueRepository
);

const completeSprintUseCase = new CompleteSprintUseCase(
  sprintRepository,
  issueRepository,
  projectRepository,
  membershipRepository,
  sprintAnalyticsRepository,
  workLogRepository,
  uidGenarator,
  sprintMetricsCalculatorService
);

const getProjectPerformanceUseCase = new GetProjectPerformanceUseCase(
  sprintAnalyticsRepository
);

const updateSprintUseCase = new UpdateSprintUseCase(
  sprintRepository,
  membershipRepository
);

export const sprintController = new SprintController(
  createSprintUseCase,
  getSprintsByProjectUseCase,
  assignIssueToSprintUseCase,
  startSprintUseCase,
  getActiveSprintUseCase,
  completeSprintUseCase,
  getProjectPerformanceUseCase,
  updateSprintUseCase
);
