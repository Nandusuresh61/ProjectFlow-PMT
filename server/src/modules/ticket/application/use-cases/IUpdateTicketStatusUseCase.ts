import { TicketStatus } from "../../domain/enums/TicketStatus";

export interface IUpdateTicketStatusUseCase {
  execute(ticketId: string, status: TicketStatus): Promise<void>;
}
