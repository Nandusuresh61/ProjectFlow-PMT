import { IGetAllTicketsUseCase, GetAllTicketsFilters, TicketWithWorkspace } from "./IGetAllTicketsUseCase";
import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { IWorkspaceRepository } from "@/application/interfaces/repositories/IWorkspaceRepository";

export class GetAllTicketsUseCase implements IGetAllTicketsUseCase {
  constructor(
    private readonly _ticketRepository: ITicketRepository,
    private readonly _workspaceRepository: IWorkspaceRepository
  ) {}

  async execute(filters: GetAllTicketsFilters): Promise<{ tickets: TicketWithWorkspace[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    
    const { tickets, total } = await this._ticketRepository.findAll(
      { status: filters.status, priority: filters.priority },
      { page, limit }
    );

    // Fetch workspace names
    const workspaceIds = Array.from(new Set(tickets.map(t => t.workspaceId)));
    
    // We can fetch details for each workspace
    // Since we don't have a findByIds for workspaces, we can use Promise.all or just handle it efficiently
    const workspacePromises = workspaceIds.map(id => this._workspaceRepository.findById(id));
    const workspaces = await Promise.all(workspacePromises);
    const workspaceMap = new Map(workspaces.filter(w => w !== null).map(w => [w!.workspaceId, w!.name]));

    const ticketsWithWorkspace = tickets.map(ticket => ({
        ...ticket,
        workspaceName: workspaceMap.get(ticket.workspaceId) || "Unknown Workspace"
    }));

    return {
      tickets: ticketsWithWorkspace,
      total
    };
  }
}
