import { CreateIssueUseCase } from "@/application/use-cases/Issue/CreateIssueUseCase";
import { IssueController } from "@/presentation/controllers/IssueController";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { MongoIssueRepository } from "../repositories/MongoIssueRepository";
import { UidService } from "../services/UidService";
import { GetIssuesByProjectUseCase } from "@/application/use-cases/Issue/GetIssuesByProjectUseCase";
import { UpdateIssueUseCase } from "@/application/use-cases/Issue/UpdateIssueUseCase";

const projectRepository = new MongoProjectRepository();
const issueRepository = new MongoIssueRepository();
const uidGenerator = new UidService();
const createissueUseCase = new CreateIssueUseCase(
  projectRepository,
  issueRepository,
  uidGenerator,
);

const getIssuesByProjectUseCase = new GetIssuesByProjectUseCase(
  issueRepository
);

const updateIssueUseCase = new UpdateIssueUseCase(
  issueRepository
);

export const issueController = new IssueController(
  createissueUseCase,
  getIssuesByProjectUseCase,
  updateIssueUseCase
);
