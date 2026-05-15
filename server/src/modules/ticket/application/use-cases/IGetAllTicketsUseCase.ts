import { Ticket } from "../../domain/entities/Ticket";
import { TicketStatus } from "../../domain/enums/TicketStatus";

export interface GetAllTicketsFilters {
  status?: TicketStatus;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TicketWithWorkspace extends Ticket {
  workspaceName: string;
}

export interface IGetAllTicketsUseCase {
  execute(filters: GetAllTicketsFilters): Promise<{ tickets: TicketWithWorkspace[]; total: number }>;
}
