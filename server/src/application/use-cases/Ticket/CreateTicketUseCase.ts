import { ICreateTicketUseCase, CreateTicketDto } from "@/application/interfaces/use-cases/Ticket/ICreateTicketUseCase";
import { ITicketRepository } from "@/application/interfaces/repositories/ITicketRepository";
import { ITicketMessageRepository } from "@/application/interfaces/repositories/ITicketMessageRepository";
import { Ticket } from "@/domain/entities/Ticket";
import { TicketMessage } from "@/domain/entities/TicketMessage";
import { TicketStatus } from "@/shared/enums/TicketStatus";
import { TicketPriority } from "@/shared/enums/TicketPriority";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";
import { IPlanRepository } from "@/application/interfaces/repositories/IPlanRepository";
import { PlanType } from "@/shared/enums/PlanType";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class CreateTicketUseCase implements ICreateTicketUseCase {
  constructor(
    private readonly _ticketRepository: ITicketRepository,
    private readonly _ticketMessageRepository: ITicketMessageRepository,
    private readonly _workspaceRepository: IWorkspaceRepository,
    private readonly _planRepository: IPlanRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async execute(data: CreateTicketDto): Promise<void> {
    const workspace = await this._workspaceRepository.findById(data.workspaceId);
    if (!workspace) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.WORKSPACE_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const plan = await this._planRepository.findById(workspace.planId);
    if (!plan) {
      throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, AppMessages.PLAN_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }

    const planType = plan.type as unknown as PlanType;
    const priority = this._calculatePriority(planType);

    const ticketId = this._uidGenerator.createId();
    const now = new Date();

    const ticket = new Ticket(
      ticketId,
      data.workspaceId,
      data.userId,
      data.title,
      planType,
      priority,
      TicketStatus.OPEN,
      now,
      now,
      now
    );

    await this._ticketRepository.create(ticket);

    const messageId = this._uidGenerator.createId();
    const ticketMessage = new TicketMessage(
      messageId,
      ticketId,
      data.userId,
      data.message,
      data.attachments || [],
      now,
      now
    );

    await this._ticketMessageRepository.create(ticketMessage);
  }

  private _calculatePriority(planType: PlanType): TicketPriority {
    switch (planType) {
      case PlanType.ENTERPRISE:
        return TicketPriority.HIGH;
      case PlanType.PRO:
        return TicketPriority.MEDIUM;
      default:
        return TicketPriority.LOW;
    }
  }
}
