import { ITicketMessageRepository } from "@/application/interfaces/repositories/ITicketMessageRepository";
import { TicketMessage } from "@/domain/entities/TicketMessage";
import { TicketMessageModel, TicketMessageDocument } from "@/infrastructure/database/models/MongoTicketMessageModel";

export class MongoTicketMessageRepository implements ITicketMessageRepository {
  async create(message: TicketMessage): Promise<TicketMessage> {
    const created = await TicketMessageModel.create({
      messageId: message.messageId,
      ticketId: message.ticketId,
      senderId: message.senderId,
      message: message.message,
      attachments: message.attachments,
    });

    return this.toDomain(created);
  }

  async findByTicketId(ticketId: string): Promise<TicketMessage[]> {
    const docs = await TicketMessageModel.find({ ticketId }).sort({ createdAt: 1 }).lean();
    return docs.map((doc) => this.toDomain(doc as TicketMessageDocument));
  }

  private toDomain(doc: TicketMessageDocument): TicketMessage {
    return new TicketMessage(
      doc.messageId,
      doc.ticketId,
      doc.senderId,
      doc.message,
      doc.attachments || [],
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
