import { CreateSprintUseCase } from "@/application/use-cases/Sprint/CreateSprintUseCase";
import { GetSprintsByProjectUseCase } from "@/application/use-cases/Sprint/GetSprintsByProjectUseCase";
import { SprintController } from "@/presentation/controllers/SprintController";
import { MongoProjectRepository } from "../repositories/MongoProjectRepository";
import { UidService } from "../services/UidService";
import { SprintRepository } from "../repositories/MongoSprintRepository";
import { MembershipRepository } from "../repositories/MongoMembershipRepository";

const sprintRepository = new SprintRepository();
const projectRepository = new MongoProjectRepository();
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

export const sprintController = new SprintController(
  createSprintUseCase,
  getSprintsByProjectUseCase,
);
