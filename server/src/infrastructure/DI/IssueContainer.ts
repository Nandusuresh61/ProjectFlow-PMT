import { CreateIssueUseCase } from "@/application/use-cases/Issue/CreateIssueUseCase";
import { IssueController } from "@/presentation/controllers/IssueController";
import { GetIssuesByProjectUseCase } from "@/application/use-cases/Issue/GetIssuesByProjectUseCase";
import { UpdateIssueUseCase } from "@/application/use-cases/Issue/UpdateIssueUseCase";
import { IssueRepository } from "../repositories/IssueRepository";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { MembershipRepository } from "../repositories/MembershipRepository";
import { WorkspaceRepository } from "../repositories/WorkspaceRepository";
import { UidService } from "../services/UidService";
import { workspaceEventTrackingService } from "./WorkspaceEventContainer";

// Comments
import { CommentRepository } from "../repositories/CommentRepository";
import { AddCommentUseCase } from "@/application/use-cases/Issue/AddCommentUseCase";
import { GetIssueCommentsUseCase } from "@/application/use-cases/Issue/GetIssueCommentsUseCase";

import { WorkLogRepository } from "../repositories/WorkLogRepository";
import { sprintBurndownSnapshotService, sprintAllocationCalculatorService } from "./SprintContainer";


const projectRepository = new ProjectRepository();
const issueRepository = new IssueRepository();
const membershipRepository = new MembershipRepository();
const workspaceRepository = new WorkspaceRepository();
const commentRepository = new CommentRepository();
const workLogRepository = new WorkLogRepository();
const uidGenerator = new UidService();

const createissueUseCase = new CreateIssueUseCase(
  projectRepository,
  issueRepository,
  uidGenerator,
  workspaceRepository,
  membershipRepository,
  workspaceEventTrackingService
);

const getIssuesByProjectUseCase = new GetIssuesByProjectUseCase(
  issueRepository,
  projectRepository,
  workspaceRepository,
  membershipRepository
);

const updateIssueUseCase = new UpdateIssueUseCase(
  issueRepository,
  projectRepository,
  workspaceRepository,
  membershipRepository,
  workLogRepository,
  sprintBurndownSnapshotService,
  sprintAllocationCalculatorService,
  workspaceEventTrackingService
);


const addCommentUseCase = new AddCommentUseCase(
  commentRepository,
  issueRepository,
  uidGenerator,
  workspaceEventTrackingService
);

const getIssueCommentsUseCase = new GetIssueCommentsUseCase(
  commentRepository
);

export const issueController = new IssueController(
  createissueUseCase,
  getIssuesByProjectUseCase,
  updateIssueUseCase,
  addCommentUseCase,
  getIssueCommentsUseCase
);
