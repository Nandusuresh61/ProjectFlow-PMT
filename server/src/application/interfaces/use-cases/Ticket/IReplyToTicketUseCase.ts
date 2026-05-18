export interface ReplyToTicketDto {
  ticketId: string;
  senderId: string;
  message: string;
  attachments?: string[];
}

export interface IReplyToTicketUseCase {
  execute(data: ReplyToTicketDto): Promise<void>;
}
