import { Ticket } from "../entities/Ticket";
import { TicketStatus } from "../enums/TicketStatus";

export interface TicketFilters {
  status?: TicketStatus;
  priority?: string;
  workspaceId?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ITicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findById(ticketId: string): Promise<Ticket | null>;
  findByWorkspaceId(workspaceId: string): Promise<Ticket[]>;
  findAll(filters: TicketFilters, pagination: PaginationParams): Promise<{ tickets: Ticket[]; total: number }>;
  updateStatus(ticketId: string, status: TicketStatus, resolvedAt?: Date): Promise<void>;
  updateLastReplyAt(ticketId: string, lastReplyAt: Date): Promise<void>;
}
