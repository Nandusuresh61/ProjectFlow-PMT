import { TicketStatus } from "../enums/TicketStatus";
import { TicketPriority } from "../enums/TicketPriority";
import { PlanType } from "@/shared/enums/PlanType";

export class Ticket {
  constructor(
    public ticketId: string,
    public workspaceId: string,
    public createdBy: string,
    public title: string,
    public planType: PlanType,
    public priority: TicketPriority,
    public status: TicketStatus,
    public lastReplyAt: Date,
    public createdAt: Date,
    public updatedAt: Date,
    public resolvedAt?: Date,
  ) {}
}
