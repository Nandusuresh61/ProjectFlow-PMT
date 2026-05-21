import { Request, Response } from "express";
import { AuthRequest } from "@/presentation/middlewares/AuthMiddleware";
import { asyncHandler } from "@/presentation/utils/AsyncHandler";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { CreateMeetingUseCase } from "@/application/use-cases/meeting/CreateMeetingUseCase";
import { GetMeetingUseCase } from "@/application/use-cases/meeting/GetMeetingUseCase";
import { GetWorkspaceMeetingsUseCase } from "@/application/use-cases/meeting/GetWorkspaceMeetingsUseCase";
import { EndMeetingUseCase } from "@/application/use-cases/meeting/EndMeetingUseCase";

export class MeetingController {
  constructor(
    private readonly createMeetingUseCase: CreateMeetingUseCase,
    private readonly getMeetingUseCase: GetMeetingUseCase,
    private readonly getWorkspaceMeetingsUseCase: GetWorkspaceMeetingsUseCase,
    private readonly endMeetingUseCase: EndMeetingUseCase
  ) {}

  createMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { workspaceId, title, participants, scheduledAt, duration } = req.body;
    const userId = req.user!.userId;

    const meeting = await this.createMeetingUseCase.execute({
      workspaceId,
      hostId: userId,
      title,
      participants,
      scheduledAt,
      duration
    });

    res.status(HttpStatusCode.CREATED).json(ResponseHandler.success("Meeting created successfully", meeting));
  });

  getMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { meetingId } = req.params;
    const userId = req.user!.userId;

    const meeting = await this.getMeetingUseCase.execute(meetingId, userId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success("Meeting retrieved successfully", meeting));
  });

  getWorkspaceMeetings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { workspaceId } = req.params;
    const userId = req.user!.userId;

    const meetings = await this.getWorkspaceMeetingsUseCase.execute(workspaceId, userId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success("Meetings retrieved successfully", meetings));
  });

  endMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { meetingId } = req.params;
    const userId = req.user!.userId;

    const meeting = await this.endMeetingUseCase.execute(meetingId, userId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success("Meeting ended successfully", meeting));
  });
}
