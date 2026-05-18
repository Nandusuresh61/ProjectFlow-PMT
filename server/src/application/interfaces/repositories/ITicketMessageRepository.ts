import { TicketMessage } from "@/domain/entities/TicketMessage";

export interface ITicketMessageRepository {
  create(message: TicketMessage): Promise<TicketMessage>;
  findByTicketId(ticketId: string): Promise<TicketMessage[]>;
}
