import { IMessageRepository } from "@/application/interfaces/repositories/IMessageRepository";
import { IUidGenerator } from "@/application/interfaces/services/IUidGenerator";
import { ISendMessageUseCase, SendMessageDto } from "@/application/interfaces/use-cases/Chat/ISendMessageUseCase";
import { Message } from "@/domain/entities/Chat/Message";

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private readonly _messageRepo: IMessageRepository,
    private readonly _uidGenerator: IUidGenerator
  ) {}

  async execute(data: SendMessageDto): Promise<Message> {
    const now = new Date();
    const message = new Message(
      this._uidGenerator.createId(),
      data.roomId,
      data.senderId,
      data.content,
      data.type,
      now,
      now
    );

    return this._messageRepo.create(message);
  }
}
