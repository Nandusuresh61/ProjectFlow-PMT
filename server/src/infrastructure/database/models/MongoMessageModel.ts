import { Document, model, Schema } from "mongoose";
import { MessageType } from "@/domain/entities/Message";

export interface MessageDoc extends Document {
  messageId: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: Date;
  updatedAt: Date;
  senderName?: string;
}

const MessageSchema = new Schema<MessageDoc>({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(MessageType),
    required: true,
    default: MessageType.TEXT,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export const MessageModel = model<MessageDoc>("Message", MessageSchema);
