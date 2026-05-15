import { Ticket } from "../../domain/entities/Ticket";
import { TicketStatus } from "../../domain/enums/TicketStatus";

export interface GetAllTicketsFilters {
  status?: TicketStatus;
  priority?: string;
  page?: number;
  limit?: number;
}

export interface IGetAllTicketsUseCase {
  execute(filters: GetAllTicketsFilters): Promise<{ tickets: Ticket[]; total: number }>;
}
