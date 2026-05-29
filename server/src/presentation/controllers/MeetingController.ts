import { Response } from "express";
import { AuthRequest } from "@/presentation/middlewares/AuthMiddleware";
import { asyncHandler } from "@/presentation/utils/AsyncHandler";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { ICreateMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/ICreateMeetingUseCase";
import { IGetMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/IGetMeetingUseCase";
import { IGetWorkspaceMeetingsUseCase } from "@/application/interfaces/use-cases/Meeting/IGetWorkspaceMeetingsUseCase";
import { IEndMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/IEndMeetingUseCase";
import { IEditMeetingUseCase } from "@/application/interfaces/use-cases/Meeting/IEditMeetingUseCase";
import { AppMessages } from "@/shared/messages/AppMessages";

export class MeetingController {
  constructor(
    private readonly _createMeetingUseCase: ICreateMeetingUseCase,
    private readonly _getMeetingUseCase: IGetMeetingUseCase,
    private readonly _getWorkspaceMeetingsUseCase: IGetWorkspaceMeetingsUseCase,
    private readonly _endMeetingUseCase: IEndMeetingUseCase,
    private readonly _editMeetingUseCase: IEditMeetingUseCase
  ) {}

  createMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { workspaceId, title, participants, scheduledAt, duration } = req.body;
    const userId = req.user!.userId;

    const meeting = await this._createMeetingUseCase.execute({
      workspaceId,
      hostId: userId,
      title,
      participants,
      scheduledAt,
      duration
    });

    res.status(HttpStatusCode.CREATED).json(ResponseHandler.success(AppMessages.MEETING_CREATED_SUCCESS, meeting));
  });

  getMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const meetingId = req.params.meetingId as string;
    const userId = req.user!.userId;

    const meeting = await this._getMeetingUseCase.execute(meetingId, userId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.MEETING_RETRIEVED_SUCCESS, meeting));
  });

  getWorkspaceMeetings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId as string;
    const userId = req.user!.userId;

    const meetings = await this._getWorkspaceMeetingsUseCase.execute(workspaceId, userId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.MEETINGS_RETRIEVED_SUCCESS, meetings));
  });

  endMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const meetingId = req.params.meetingId as string;
    const userId = req.user!.userId;

    const meeting = await this._endMeetingUseCase.execute(meetingId, userId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.MEETING_ENDED_SUCCESS, meeting));
  });

  editMeeting = asyncHandler(async (req: AuthRequest, res: Response) => {
    const meetingId = req.params.meetingId as string;
    const userId = req.user!.userId;
    const { title, participants, scheduledAt, duration } = req.body;

    const meeting = await this._editMeetingUseCase.execute({
      meetingId,
      title,
      participants,
      scheduledAt,
      duration
    }, userId);

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.MEETING_UPDATED_SUCCESS, meeting));
  });
}
