import { IMessageRepository } from "@/application/interfaces/repositories/IMessageRepository";
import { Message } from "@/domain/entities/Chat/Message";

export interface IGetChatMessagesUseCase {
  execute(roomId: string, limit?: number, skip?: number): Promise<Message[]>;
}

export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
  constructor(private readonly _messageRepo: IMessageRepository) {}

  async execute(roomId: string, limit: number = 50, skip: number = 0): Promise<Message[]> {
    return this._messageRepo.findByRoomId(roomId, limit, skip);
  }
}
