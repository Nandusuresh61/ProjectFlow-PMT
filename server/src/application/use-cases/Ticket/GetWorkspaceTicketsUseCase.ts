import { IGetWorkspaceTicketsUseCase, WorkspaceTicketFilters } from "@/application/interfaces/use-cases/Ticket/IGetWorkspaceTicketsUseCase";
import { ITicketRepository } from "@/application/interfaces/repositories/ITicketRepository";
import { Ticket } from "@/domain/entities/Ticket";

export class GetWorkspaceTicketsUseCase implements IGetWorkspaceTicketsUseCase {
  constructor(private readonly _ticketRepository: ITicketRepository) {}

  async execute(filters: WorkspaceTicketFilters): Promise<{ tickets: Ticket[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    return this._ticketRepository.findAll(
      { workspaceId: filters.workspaceId, search: filters.search },
      { page, limit }
    );
  }
}
