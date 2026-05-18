export class TicketMessage {
  constructor(
    public messageId: string,
    public ticketId: string,
    public senderId: string,
    public message: string,
    public attachments: string[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
