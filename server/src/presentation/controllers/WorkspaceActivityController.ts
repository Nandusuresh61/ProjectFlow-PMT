import { Response } from "express";
import { AuthRequest } from "@/presentation/middlewares/AuthMiddleware";
import { IGetWorkspaceActivityFeedUseCase } from "@/application/interfaces/use-cases/Activity/IGetWorkspaceActivityFeedUseCase";
import { IGetEntityTimelineUseCase } from "@/application/interfaces/use-cases/Activity/IGetEntityTimelineUseCase";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { asyncHandler } from "@/presentation/utils/AsyncHandler";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";

export class WorkspaceActivityController {
  constructor(
    private readonly _getWorkspaceActivityFeedUseCase: IGetWorkspaceActivityFeedUseCase,
    private readonly _getEntityTimelineUseCase: IGetEntityTimelineUseCase
  ) {}

  getWorkspaceFeed = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const { workspaceId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const feed = await this._getWorkspaceActivityFeedUseCase.execute(user.userId, workspaceId, {
      limit,
      offset,
    });

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.ACTIVITY_FEED_RETRIEVED, feed));
  });

  getEntityTimeline = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user!;
    const { entityId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const timeline = await this._getEntityTimelineUseCase.execute(user.userId, entityId, {
      limit,
      offset,
    });

    res.status(HttpStatusCode.OK).json(ResponseHandler.success(AppMessages.ENTITY_TIMELINE_RETRIEVED, timeline));
  });
}
