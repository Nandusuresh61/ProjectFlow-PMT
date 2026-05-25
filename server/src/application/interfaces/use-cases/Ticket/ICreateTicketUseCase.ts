export interface CreateTicketDto {
  workspaceId: string;
  userId: string;
  title: string;
  message: string;
  attachments?: string[];
}

export interface ICreateTicketUseCase {
  execute(data: CreateTicketDto): Promise<void>;
}
