import { Request, Response } from "express";
import { asyncHandler } from "@/presentation/utils/AsyncHandler";
import { ICreateTicketUseCase } from "../../application/use-cases/ICreateTicketUseCase";
import { IReplyToTicketUseCase } from "../../application/use-cases/IReplyToTicketUseCase";
import { IGetWorkspaceTicketsUseCase } from "../../application/use-cases/IGetWorkspaceTicketsUseCase";
import { IGetTicketDetailsUseCase } from "../../application/use-cases/IGetTicketDetailsUseCase";
import { IUpdateTicketStatusUseCase } from "../../application/use-cases/IUpdateTicketStatusUseCase";
import { IGetAllTicketsUseCase } from "../../application/use-cases/IGetAllTicketsUseCase";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AuthRequest } from "@/presentation/middlewares/AuthMiddleware";
import { TicketStatus } from "../../domain/enums/TicketStatus";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { AppMessages } from "@/shared/messages/AppMessages";

export class TicketController {
  constructor(
    private readonly _createTicketUseCase: ICreateTicketUseCase,
    private readonly _replyToTicketUseCase: IReplyToTicketUseCase,
    private readonly _getWorkspaceTicketsUseCase: IGetWorkspaceTicketsUseCase,
    private readonly _getTicketDetailsUseCase: IGetTicketDetailsUseCase,
    private readonly _updateTicketStatusUseCase: IUpdateTicketStatusUseCase,
    private readonly _getAllTicketsUseCase: IGetAllTicketsUseCase,
    private readonly _membershipRepository: IMembershipRepository
  ) {}

  createTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.user!;
    const { workspaceId, title, message, attachments } = req.body;

    await this._createTicketUseCase.execute({
      workspaceId,
      userId,
      title,
      message,
      attachments,
    });

    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.TICKET_CREATED_SUCCESS));
  });

  replyToTicket = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.user!;
    const { ticketId } = req.params;
    const { message, attachments } = req.body;

    await this._replyToTicketUseCase.execute({
      ticketId,
      senderId: userId,
      message,
      attachments,
    });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.TICKET_REPLY_SUCCESS));
  });

  getWorkspaceTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { workspaceId, search, page, limit } = req.query;
    const { userId, isSuperAdmin } = req.user!;
    
    if (!workspaceId) {
        res.status(HttpStatusCode.BAD_REQUEST).json(ResponseHandler.error(AppMessages.WORKSPACE_ID_REQUIRED));
        return;
    }

    if (!isSuperAdmin) {
        const membership = await this._membershipRepository.findByUserAndWorkspace(userId, workspaceId as string);
        if (!membership) {
            res.status(HttpStatusCode.FORBIDDEN).json(ResponseHandler.error(AppMessages.TICKET_UNAUTHORIZED));
            return;
        }
    }

    const result = await this._getWorkspaceTicketsUseCase.execute({
      workspaceId: workspaceId as string,
      search: search as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.TICKET_RETRIEVED_SUCCESS, result));
  });

  getTicketDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId, isSuperAdmin } = req.user!;
    const { ticketId } = req.params;

    const result = await this._getTicketDetailsUseCase.execute(ticketId, userId, isSuperAdmin);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.TICKET_DETAILS_RETRIEVED_SUCCESS, result));
  });

  // Admin APIs
  getAllTickets = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, priority, search, page, limit } = req.query;

    const result = await this._getAllTicketsUseCase.execute({
      status: status as TicketStatus,
      priority: priority as string,
      search: search as string,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.TICKET_ADMIN_RETRIEVED_SUCCESS, result));
  });

  updateTicketStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { ticketId } = req.params;
    const { status } = req.body;

    await this._updateTicketStatusUseCase.execute(ticketId, status as TicketStatus);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.TICKET_STATUS_UPDATED));
  });
}
