import { CreateSprintUseCase } from "@/application/use-cases/Sprint/CreateSprintUseCase";
import { GetSprintsByProjectUseCase } from "@/application/use-cases/Sprint/GetSprintsByProjectUseCase";
import { AssignIssueToSprintUseCase } from "@/application/use-cases/Sprint/AssignIssueToSprintUseCase";
import { StartSprintUseCase } from "@/application/use-cases/Sprint/StartSprintUseCase";
import { GetActiveSprintUseCase } from "@/application/use-cases/Sprint/GetActiveSprintUseCase";
import { CompleteSprintUseCase } from "@/application/use-cases/Sprint/CompleteSprintUseCase";
import { UpdateSprintUseCase } from "@/application/use-cases/Sprint/UpdateSprintUseCase";
import { GetSprintBurndownUseCase } from "@/application/use-cases/Sprint/GetSprintBurndownUseCase";
import { GetSprintAllocationUseCase } from "@/application/use-cases/Sprint/GetSprintAllocationUseCase";
import { GetSprintHistoryDetailsUseCase } from "@/application/use-cases/Sprint/GetSprintHistoryDetailsUseCase";

import { SprintController } from "@/presentation/controllers/SprintController";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { IssueRepository } from "../repositories/IssueRepository";
import { UidService } from "../services/UidService";
import { SprintRepository } from "../repositories/SprintRepository";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { SprintAnalyticsRepository } from "../repositories/SprintAnalyticsRepository";
import { WorkLogRepository } from "../repositories/WorkLogRepository";
import { SprintMetricsCalculatorService } from "@/application/services/SprintMetricsCalculatorService";
import { SprintDailyMetricRepository } from "../repositories/SprintDailyMetricRepository";
import { SprintBurndownSnapshotService } from "@/application/services/SprintBurndownSnapshotService";
import { SprintMemberAllocationRepository } from "../repositories/SprintMemberAllocationRepository";
import { SprintAllocationCalculatorService } from "@/application/services/SprintAllocationCalculatorService";
import { UserRepository } from "../repositories/UserRepository";
import { workspaceEventTrackingService } from "./WorkspaceEventContainer";


const sprintRepository = new SprintRepository();
const projectRepository = new ProjectRepository();
const issueRepository = new IssueRepository();
const membershipRepository = new MembershipRepository();
const uidGenarator = new UidService();
const sprintAnalyticsRepository = new SprintAnalyticsRepository();
const workLogRepository = new WorkLogRepository();
const sprintMetricsCalculatorService = new SprintMetricsCalculatorService();
const sprintDailyMetricRepository = new SprintDailyMetricRepository();
const sprintMemberAllocationRepository = new SprintMemberAllocationRepository();
const userRepository = new UserRepository();

export const sprintBurndownSnapshotService = new SprintBurndownSnapshotService(
  sprintRepository,
  issueRepository,
  workLogRepository,
  sprintDailyMetricRepository,
  uidGenarator
);

export const sprintAllocationCalculatorService = new SprintAllocationCalculatorService(
  sprintRepository,
  issueRepository,
  workLogRepository,
  sprintMemberAllocationRepository,
  uidGenarator
);


const createSprintUseCase = new CreateSprintUseCase(
  projectRepository,
  uidGenarator,
  sprintRepository,
  membershipRepository,
  workspaceEventTrackingService
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
  sprintAllocationCalculatorService,
  workspaceEventTrackingService
);

const startSprintUseCase = new StartSprintUseCase(
  sprintRepository,
  issueRepository,
  projectRepository,
  membershipRepository,
  sprintBurndownSnapshotService,
  sprintAllocationCalculatorService,
  workspaceEventTrackingService
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
  sprintMetricsCalculatorService,
  sprintBurndownSnapshotService,
  sprintAllocationCalculatorService,
  workspaceEventTrackingService
);

const updateSprintUseCase = new UpdateSprintUseCase(
  sprintRepository,
  membershipRepository
);

const getSprintBurndownUseCase = new GetSprintBurndownUseCase(
  sprintRepository,
  sprintDailyMetricRepository
);

const getSprintAllocationUseCase = new GetSprintAllocationUseCase(
  sprintRepository,
  sprintMemberAllocationRepository,
  userRepository
);

const getSprintHistoryDetailsUseCase = new GetSprintHistoryDetailsUseCase(
  sprintRepository,
  sprintAnalyticsRepository,
  sprintDailyMetricRepository,
  sprintMemberAllocationRepository,
  issueRepository,
  userRepository
);


export const sprintController = new SprintController(
  createSprintUseCase,
  getSprintsByProjectUseCase,
  assignIssueToSprintUseCase,
  startSprintUseCase,
  getActiveSprintUseCase,
  completeSprintUseCase,
  updateSprintUseCase,
  getSprintBurndownUseCase,
  getSprintAllocationUseCase,
  getSprintHistoryDetailsUseCase
);

