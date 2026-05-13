import { Message, MessageType } from "@/domain/entities/Message";

export interface SendMessageDto {
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
}

export interface ISendMessageUseCase {
  execute(data: SendMessageDto): Promise<Message>;
}
