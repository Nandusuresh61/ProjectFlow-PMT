import mongoose, { Schema, Document } from "mongoose";
import { TicketStatus } from "@/shared/enums/TicketStatus";
import { TicketPriority } from "@/shared/enums/TicketPriority";
import { PlanType } from "@/shared/enums/PlanType";

export interface TicketDocument extends Document {
  ticketId: string;
  workspaceId: string;
  createdBy: string;
  title: string;
  planType: PlanType;
  priority: TicketPriority;
  status: TicketStatus;
  lastReplyAt: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<TicketDocument>(
  {
    ticketId: { type: String, required: true, unique: true },
    workspaceId: { type: String, required: true, index: true },
    createdBy: { type: String, required: true },
    title: { type: String, required: true },
    planType: { type: String, enum: Object.values(PlanType), required: true },
    priority: { type: String, enum: Object.values(TicketPriority), required: true },
    status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.OPEN, index: true },
    lastReplyAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
  },
  { timestamps: true },
);

export const TicketModel = mongoose.model<TicketDocument>(
  "Ticket",
  TicketSchema,
);
