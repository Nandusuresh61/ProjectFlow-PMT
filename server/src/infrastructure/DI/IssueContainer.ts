import { CreateIssueUseCase } from "@/application/use-cases/Issue/CreateIssueUseCase";
import { IssueController } from "@/presentation/controllers/IssueController";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { MongoIssueRepository } from "../repositories/MongoIssueRepository";
import { UidService } from "../services/UidService";

const projectRepository = new MongoProjectRepository();
const issueRepository = new MongoIssueRepository();
const uidGenerator = new UidService();
const createissueUseCase = new CreateIssueUseCase(
  projectRepository,
  issueRepository,
  uidGenerator,
);

export const issueController = new IssueController(createissueUseCase);
