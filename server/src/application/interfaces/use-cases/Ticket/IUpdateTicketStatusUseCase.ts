import { TicketStatus } from "@/shared/enums/TicketStatus";

export interface IUpdateTicketStatusUseCase {
  execute(ticketId: string, status: TicketStatus): Promise<void>;
}
