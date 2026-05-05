export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
}

export class Message {
  constructor(
    public readonly messageId: string | undefined,
    public readonly roomId: string,
    public readonly senderId: string,
    public readonly content: string,
    public readonly type: MessageType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly senderName?: string
  ) {}
}
