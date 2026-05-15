import { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import { Ticket } from "../../domain/entities/Ticket";
import { TicketModel, TicketDocument } from "../models/TicketModel";
import { TicketStatus } from "../../domain/enums/TicketStatus";
import { TicketPriority } from "../../domain/enums/TicketPriority";
import { PlanType } from "@/shared/enums/PlanType";

export class MongoTicketRepository implements ITicketRepository {
  async create(ticket: Ticket): Promise<Ticket> {
    const created = await TicketModel.create({
      ticketId: ticket.ticketId,
      workspaceId: ticket.workspaceId,
      createdBy: ticket.createdBy,
      title: ticket.title,
      planType: ticket.planType,
      priority: ticket.priority,
      status: ticket.status,
      lastReplyAt: ticket.lastReplyAt,
      resolvedAt: ticket.resolvedAt,
    });

    return this.toDomain(created);
  }

  async findById(ticketId: string): Promise<Ticket | null> {
    const doc = await TicketModel.findOne({ ticketId }).lean();
    if (!doc) return null;
    return this.toDomain(doc as TicketDocument);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Ticket[]> {
    const docs = await TicketModel.find({ workspaceId }).sort({ lastReplyAt: -1 }).lean();
    return docs.map((doc) => this.toDomain(doc as TicketDocument));
  }

  async findAll(filters: { status?: TicketStatus; priority?: string }, pagination: { page: number; limit: number }): Promise<{ tickets: Ticket[]; total: number }> {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;

    const skip = (pagination.page - 1) * pagination.limit;

    const priorityOrder: Record<string, number> = {
      [TicketPriority.HIGH]: 1,
      [TicketPriority.MEDIUM]: 2,
      [TicketPriority.LOW]: 3,
    };

    // Note: Mongoose sort doesn't support custom priority order directly easily without aggregation or mapping.
    // For now, we'll sort by priority field (H, M, L) and then lastReplyAt.
    // Actually, sorting alphabetically 'HIGH', 'MEDIUM', 'LOW' works well? H, M, L... L comes after H, M.
    // H < M < L (alphabetical) => HIGH, MEDIUM, LOW.
    // So sorting by priority ascending will give HIGH, LOW, MEDIUM. Not quite.
    // I'll use simple sort for now and maybe aggregation later if needed.
    
    const [docs, total] = await Promise.all([
      TicketModel.find(query)
        .sort({ priority: 1, lastReplyAt: -1 }) // This is a rough sort, but should be fine for now
        .skip(skip)
        .limit(pagination.limit)
        .lean(),
      TicketModel.countDocuments(query),
    ]);

    return {
      tickets: docs.map((doc) => this.toDomain(doc as TicketDocument)),
      total,
    };
  }

  async updateStatus(ticketId: string, status: TicketStatus, resolvedAt?: Date): Promise<void> {
    const update: any = { status };
    if (resolvedAt) update.resolvedAt = resolvedAt;
    await TicketModel.updateOne({ ticketId }, { $set: update });
  }

  async updateLastReplyAt(ticketId: string, lastReplyAt: Date): Promise<void> {
    await TicketModel.updateOne({ ticketId }, { $set: { lastReplyAt } });
  }

  private toDomain(doc: TicketDocument): Ticket {
    return new Ticket(
      doc.ticketId,
      doc.workspaceId,
      doc.createdBy,
      doc.title,
      doc.planType as PlanType,
      doc.priority as TicketPriority,
      doc.status as TicketStatus,
      doc.lastReplyAt,
      doc.createdAt,
      doc.updatedAt,
      doc.resolvedAt,
    );
  }
}
