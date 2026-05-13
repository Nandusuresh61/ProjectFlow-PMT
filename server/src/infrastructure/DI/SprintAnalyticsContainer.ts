import { GetProjectVelocityUseCase } from "@/application/use-cases/Analytics/GetProjectVelocityUseCase";
import { GetSprintAnalyticsUseCase } from "@/application/use-cases/Analytics/GetSprintAnalyticsUseCase";
import { GetSprintPerformanceSummaryUseCase } from "@/application/use-cases/Analytics/GetSprintPerformanceSummaryUseCase";
import { SprintMetricsCalculatorService } from "@/application/services/SprintMetricsCalculatorService";
import { SprintAnalyticsController } from "@/presentation/controllers/SprintAnalyticsController";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { MongoIssueRepository } from "../repositories/MongoIssueRepository";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { MongoSprintAnalyticsRepository } from "../repositories/MongoSprintAnalyticsRepository";
import { MongoWorkLogRepository } from "../repositories/MongoWorkLogRepository";
import { SprintRepository } from "../repositories/MongoSprintRepository";

const sprintAnalyticsRepository = new MongoSprintAnalyticsRepository();
const sprintRepository = new SprintRepository();
const projectRepository = new MongoProjectRepository();
const membershipRepository = new MembershipRepository();
const issueRepository = new MongoIssueRepository();
const workLogRepository = new MongoWorkLogRepository();
const sprintMetricsCalculatorService = new SprintMetricsCalculatorService();

const getSprintAnalyticsUseCase = new GetSprintAnalyticsUseCase(
  sprintAnalyticsRepository,
  sprintRepository,
  projectRepository,
  membershipRepository,
  issueRepository,
  workLogRepository,
  sprintMetricsCalculatorService,
);

const getProjectVelocityUseCase = new GetProjectVelocityUseCase(
  projectRepository,
  membershipRepository,
  sprintAnalyticsRepository,
);

const getSprintPerformanceSummaryUseCase = new GetSprintPerformanceSummaryUseCase(
  projectRepository,
  membershipRepository,
  sprintAnalyticsRepository,
);

export const sprintAnalyticsController = new SprintAnalyticsController(
  getSprintAnalyticsUseCase,
  getProjectVelocityUseCase,
  getSprintPerformanceSummaryUseCase,
);
