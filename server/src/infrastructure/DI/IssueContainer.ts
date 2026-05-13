import { CreateIssueUseCase } from "@/application/use-cases/Issue/CreateIssueUseCase";
import { IssueController } from "@/presentation/controllers/IssueController";
import { GetIssuesByProjectUseCase } from "@/application/use-cases/Issue/GetIssuesByProjectUseCase";
import { UpdateIssueUseCase } from "@/application/use-cases/Issue/UpdateIssueUseCase";
import { MongoIssueRepository } from "../repositories/MongoIssueRepository";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";
import { WorkspaceRepository } from "../repositories/MongoWorkspaceRepository";
import { UidService } from "../services/UidService";

// Comments
import { MongoCommentRepository } from "../repositories/MongoCommentRepository";
import { AddCommentUseCase } from "@/application/use-cases/Issue/AddCommentUseCase";
import { GetIssueCommentsUseCase } from "@/application/use-cases/Issue/GetIssueCommentsUseCase";

import { MongoWorkLogRepository } from "../repositories/MongoWorkLogRepository";
import { sprintBurndownSnapshotService, sprintAllocationCalculatorService } from "./SprintContainer";


const projectRepository = new MongoProjectRepository();
const issueRepository = new MongoIssueRepository();
const membershipRepository = new MembershipRepository();
const workspaceRepository = new WorkspaceRepository();
const commentRepository = new MongoCommentRepository();
const workLogRepository = new MongoWorkLogRepository();
const uidGenerator = new UidService();

const createissueUseCase = new CreateIssueUseCase(
  projectRepository,
  issueRepository,
  uidGenerator,
  workspaceRepository,
  membershipRepository
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
  sprintAllocationCalculatorService
);


const addCommentUseCase = new AddCommentUseCase(
  commentRepository,
  issueRepository,
  uidGenerator
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
