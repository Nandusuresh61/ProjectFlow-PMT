import { GetProjectVelocityUseCase } from "@/application/use-cases/Analytics/GetProjectVelocityUseCase";
import { GetSprintAnalyticsUseCase } from "@/application/use-cases/Analytics/GetSprintAnalyticsUseCase";
import { GetSprintPerformanceSummaryUseCase } from "@/application/use-cases/Analytics/GetSprintPerformanceSummaryUseCase";
import { SprintMetricsCalculatorService } from "@/application/services/SprintMetricsCalculatorService";
import { SprintAnalyticsController } from "@/presentation/controllers/SprintAnalyticsController";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { IssueRepository } from "../repositories/IssueRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { SprintAnalyticsRepository } from "../repositories/SprintAnalyticsRepository";
import { WorkLogRepository } from "../repositories/WorkLogRepository";
import { SprintRepository } from "../repositories/SprintRepository";

const sprintAnalyticsRepository = new SprintAnalyticsRepository();
const sprintRepository = new SprintRepository();
const projectRepository = new ProjectRepository();
const membershipRepository = new MembershipRepository();
const issueRepository = new IssueRepository();
const workLogRepository = new WorkLogRepository();
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
