import { IGetAllTicketsUseCase, GetAllTicketsFilters } from "./IGetAllTicketsUseCase";
import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { Ticket } from "../../domain/entities/Ticket";

export class GetAllTicketsUseCase implements IGetAllTicketsUseCase {
  constructor(private readonly _ticketRepository: ITicketRepository) {}

  async execute(filters: GetAllTicketsFilters): Promise<{ tickets: Ticket[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    return this._ticketRepository.findAll(
      { status: filters.status, priority: filters.priority },
      { page, limit }
    );
  }
}
