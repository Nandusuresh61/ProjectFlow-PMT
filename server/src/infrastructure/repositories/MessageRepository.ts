import { Message } from "@/domain/entities/Message";
import { IMessageRepository } from "@/application/interfaces/repositories/IMessageRepository";
import { MessageDoc, MessageModel } from "../database/models/MongoMessageModel";
import { BaseRepository } from "./BaseRepository";

export class MessageRepository
  extends BaseRepository<Message, MessageDoc>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel);
  }

  protected mapToEntity(doc: MessageDoc): Message {
    return new Message(
      doc.messageId,
      doc.roomId,
      doc.senderId,
      doc.content,
      doc.type,
      doc.createdAt,
      doc.updatedAt,
      doc.senderName
    );
  }

  async findByRoomId(roomId: string, limit: number = 50, skip: number = 0): Promise<Message[]> {
    const results = await this.model.aggregate([
      { $match: { roomId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "userId",
          as: "sender",
        },
      },
      { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          senderName: "$sender.fullName",
        },
      },
    ]);

    // Sort back to ascending for display
    return results.map((doc) => this.mapToEntity(doc)).reverse();
  }

  async findById(messageId: string): Promise<Message | null> {
    return this.findOne({ messageId });
  }

  async create(message: Message): Promise<Message> {
    const doc = {
      messageId: message.messageId,
      roomId: message.roomId,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
    return super.create(doc as MessageDoc);
  }

  async getLastMessagesForRooms(roomIds: string[]): Promise<Message[]> {
    const results = await this.model.aggregate([
      { $match: { roomId: { $in: roomIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "lastMessage.senderId",
          foreignField: "userId",
          as: "sender",
        },
      },
      { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          "lastMessage.senderName": "$sender.fullName",
        },
      },
      { $replaceRoot: { newRoot: "$lastMessage" } },
    ]);

    return results.map((doc) => this.mapToEntity(doc));
  }
}
