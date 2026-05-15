import { Ticket } from "../../domain/entities/Ticket";

export interface IGetWorkspaceTicketsUseCase {
  execute(workspaceId: string): Promise<Ticket[]>;
}
