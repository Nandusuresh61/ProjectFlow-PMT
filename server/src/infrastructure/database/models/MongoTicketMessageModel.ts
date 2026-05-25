import mongoose, { Schema, Document } from "mongoose";

export interface TicketMessageDocument extends Document {
  messageId: string;
  ticketId: string;
  senderId: string;
  message: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketMessageSchema = new Schema<TicketMessageDocument>(
  {
    messageId: { type: String, required: true, unique: true },
    ticketId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    message: { type: String, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: true },
);

export const TicketMessageModel = mongoose.model<TicketMessageDocument>(
  "TicketMessage",
  TicketMessageSchema,
);
