import { MongoMeetingRepository } from "@/infrastructure/repositories/MongoMeetingRepository";
import { CreateMeetingUseCase } from "@/application/use-cases/meeting/CreateMeetingUseCase";
import { GetMeetingUseCase } from "@/application/use-cases/meeting/GetMeetingUseCase";
import { EndMeetingUseCase } from "@/application/use-cases/meeting/EndMeetingUseCase";
import { GetWorkspaceMeetingsUseCase } from "@/application/use-cases/meeting/GetWorkspaceMeetingsUseCase";
import { workspaceEventTrackingService } from "@/infrastructure/DI/WorkspaceEventContainer";
import { MeetingController } from "@/presentation/controllers/MeetingController";
import { UidService } from "@/infrastructure/services/UidService";

const meetingRepo = new MongoMeetingRepository();
const uidGenerator = new UidService();

export const createMeetingUseCase = new CreateMeetingUseCase(meetingRepo, workspaceEventTrackingService, uidGenerator);
export const getMeetingUseCase = new GetMeetingUseCase(meetingRepo);
export const getWorkspaceMeetingsUseCase = new GetWorkspaceMeetingsUseCase(meetingRepo);
export const endMeetingUseCase = new EndMeetingUseCase(meetingRepo, workspaceEventTrackingService);

export const meetingController = new MeetingController(
  createMeetingUseCase,
  getMeetingUseCase,
  getWorkspaceMeetingsUseCase,
  endMeetingUseCase
);
