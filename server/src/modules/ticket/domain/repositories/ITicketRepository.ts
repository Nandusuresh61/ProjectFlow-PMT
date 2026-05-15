import { Ticket } from "../entities/Ticket";
import { TicketStatus } from "../enums/TicketStatus";

export interface ITicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findById(ticketId: string): Promise<Ticket | null>;
  findByWorkspaceId(workspaceId: string): Promise<Ticket[]>;
  findAll(filters: { status?: TicketStatus; priority?: string }, pagination: { page: number; limit: number }): Promise<{ tickets: Ticket[]; total: number }>;
  updateStatus(ticketId: string, status: TicketStatus, resolvedAt?: Date): Promise<void>;
  updateLastReplyAt(ticketId: string, lastReplyAt: Date): Promise<void>;
}
