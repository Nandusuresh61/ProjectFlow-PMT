import { IGetWorkspaceTicketsUseCase, WorkspaceTicketFilters } from "@/application/interfaces/use-cases/Ticket/IGetWorkspaceTicketsUseCase";
import { ITicketRepository } from "@/application/interfaces/repositories/ITicketRepository";
import { Ticket } from "@/domain/entities/Ticket";
import { IMembershipRepository } from "@/application/interfaces/repositories/IMembershipRepository";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class GetWorkspaceTicketsUseCase implements IGetWorkspaceTicketsUseCase {
  constructor(
    private readonly _ticketRepository: ITicketRepository,
    private readonly _membershipRepository: IMembershipRepository
  ) {}

  async execute(filters: WorkspaceTicketFilters): Promise<{ tickets: Ticket[]; total: number }> {
    if (!filters.isSuperAdmin) {
      const membership = await this._membershipRepository.findByUserAndWorkspace(filters.userId, filters.workspaceId);
      if (!membership) {
        throw new AppError(ErrorCode.AUTH, AppMessages.TICKET_UNAUTHORIZED, HttpStatusCode.FORBIDDEN);
      }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    return this._ticketRepository.findAll(
      { workspaceId: filters.workspaceId, search: filters.search },
      { page, limit }
    );
  }
}
