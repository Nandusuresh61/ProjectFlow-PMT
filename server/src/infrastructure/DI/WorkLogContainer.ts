import { MongoWorkLogRepository } from "../repositories/MongoWorkLogRepository";
import { MongoIssueRepository } from "../repositories/MongoIssueRepository";
import { UidService } from "../services/UidService";
import { sprintBurndownSnapshotService } from "./SprintContainer";

import { AddWorkLogUseCase } from "@/application/use-cases/WorkLog/AddWorkLogUseCase";
import { UpdateWorkLogUseCase } from "@/application/use-cases/WorkLog/UpdateWorkLogUseCase";
import { DeleteWorkLogUseCase } from "@/application/use-cases/WorkLog/DeleteWorkLogUseCase";
import { GetIssueWorkLogsUseCase } from "@/application/use-cases/WorkLog/GetIssueWorkLogsUseCase";
import { WorkLogController } from "@/presentation/controllers/WorkLogController";

const workLogRepository = new MongoWorkLogRepository();
const issueRepository = new MongoIssueRepository();
const uidService = new UidService();

const addWorkLogUseCase = new AddWorkLogUseCase(
  workLogRepository,
  issueRepository,
  uidService,
  sprintBurndownSnapshotService
);

const updateWorkLogUseCase = new UpdateWorkLogUseCase(
  workLogRepository,
  issueRepository,
  sprintBurndownSnapshotService
);

const deleteWorkLogUseCase = new DeleteWorkLogUseCase(
  workLogRepository,
  issueRepository,
  sprintBurndownSnapshotService
);


const getIssueWorkLogsUseCase = new GetIssueWorkLogsUseCase(
  workLogRepository
);

export const workLogController = new WorkLogController(
  addWorkLogUseCase,
  updateWorkLogUseCase,
  deleteWorkLogUseCase,
  getIssueWorkLogsUseCase
);
