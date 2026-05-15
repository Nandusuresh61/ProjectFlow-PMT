import { Ticket } from "../../domain/entities/Ticket";
import { TicketMessage } from "../../domain/entities/TicketMessage";

export interface TicketDetailsResponse {
  ticket: Ticket;
  messages: TicketMessage[];
}

export interface IGetTicketDetailsUseCase {
  execute(ticketId: string, userId: string, isSuperAdmin: boolean): Promise<TicketDetailsResponse>;
}
