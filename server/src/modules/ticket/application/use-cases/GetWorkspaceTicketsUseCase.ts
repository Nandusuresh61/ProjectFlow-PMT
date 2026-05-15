import { IGetWorkspaceTicketsUseCase } from "./IGetWorkspaceTicketsUseCase";
import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { Ticket } from "../../domain/entities/Ticket";

export class GetWorkspaceTicketsUseCase implements IGetWorkspaceTicketsUseCase {
  constructor(private readonly _ticketRepository: ITicketRepository) {}

  async execute(workspaceId: string): Promise<Ticket[]> {
    return this._ticketRepository.findByWorkspaceId(workspaceId);
  }
}
