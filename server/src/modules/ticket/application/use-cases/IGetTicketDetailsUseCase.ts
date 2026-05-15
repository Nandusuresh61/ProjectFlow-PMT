import { Ticket } from "../../domain/entities/Ticket";
import { TicketMessage } from "../../domain/entities/TicketMessage";

export interface TicketMessageWithSender extends TicketMessage {
  senderName: string;
}

export interface TicketDetailsResponse {
  ticket: Ticket;
  messages: TicketMessageWithSender[];
}

export interface IGetTicketDetailsUseCase {
  execute(ticketId: string, userId: string, isSuperAdmin: boolean): Promise<TicketDetailsResponse>;
}
