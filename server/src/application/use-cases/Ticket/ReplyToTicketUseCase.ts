import { IReplyToTicketUseCase, ReplyToTicketDto } from "@/application/interfaces/use-cases/Ticket/IReplyToTicketUseCase";
import { ITicketRepository } from "@/application/interfaces/repositories/ITicketRepository";
import { ITicketMessageRepository } from "@/application/interfaces/repositories/ITicketMessageRepository";
import { TicketMessage } from "@/domain/entities/TicketMessage";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { TicketStatus } from "@/shared/enums/TicketStatus";
import { IWorkspaceEventTrackingService } from "@/application/interfaces/services/IWorkspaceEventTrackingService";

export class ReplyToTicketUseCase implements IReplyToTicketUseCase {
  constructor(
    private readonly _ticketRepository: ITicketRepository,
    private readonly _ticketMessageRepository: ITicketMessageRepository,
    private readonly _uidGenerator: IUidGenerator,
    private readonly _eventTracker: IWorkspaceEventTrackingService
  ) {}

  async execute(data: ReplyToTicketDto): Promise<void> {
    const ticket = await this._ticketRepository.findById(data.ticketId);
    if (!ticket) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Ticket not found", HttpStatusCode.NOT_FOUND);
    }

    if (ticket.status === TicketStatus.CLOSED) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Cannot reply to a closed ticket", HttpStatusCode.BAD_REQUEST);
    }

    const messageId = this._uidGenerator.createId();
    const now = new Date();

    const ticketMessage = new TicketMessage(
      messageId,
      data.ticketId,
      data.senderId,
      data.message,
      data.attachments || [],
      now,
      now
    );

    await this._ticketMessageRepository.create(ticketMessage);
    await this._ticketRepository.updateLastReplyAt(data.ticketId, now);

    await this._eventTracker.trackEvent({
      workspaceId: ticket.workspaceId,
      actorId: data.senderId,
      eventType: "TICKET_REPLIED",
      entityType: "TICKET",
      entityId: ticket.ticketId,
      metadata: {
        ticketId: ticket.ticketId,
        creatorId: ticket.createdBy,
        messageId,
      },
    });
  }
}
