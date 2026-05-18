import { Ticket } from "@/domain/entities/Ticket";

export interface WorkspaceTicketFilters {
  workspaceId: string;
  search?: string;
  page?: number;
  limit?: number;
  userId: string;
  isSuperAdmin: boolean;
}

export interface IGetWorkspaceTicketsUseCase {
  execute(filters: WorkspaceTicketFilters): Promise<{ tickets: Ticket[]; total: number }>;
}
