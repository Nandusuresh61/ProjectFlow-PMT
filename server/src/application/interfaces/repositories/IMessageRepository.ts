import { Message } from "@/domain/entities/Message";

export interface IMessageRepository {
  create(message: Message): Promise<Message>;
  findByRoomId(roomId: string, limit?: number, skip?: number): Promise<Message[]>;
  findById(messageId: string): Promise<Message | null>;
}
