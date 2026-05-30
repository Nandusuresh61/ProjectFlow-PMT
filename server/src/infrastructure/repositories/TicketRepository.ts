import { QueryFilter } from "mongoose";
import { ITicketRepository, TicketFilters, PaginationParams } from "@/application/interfaces/repositories/ITicketRepository";
import { Ticket } from "@/domain/entities/Ticket";
import { TicketModel, TicketDocument } from "@/infrastructure/database/models/MongoTicketModel";
import { TicketStatus } from "@/shared/enums/TicketStatus";
import { TicketPriority } from "@/shared/enums/TicketPriority";
import { PlanType } from "@/shared/enums/PlanType";

export class TicketRepository implements ITicketRepository {
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

  async findAll(filters: TicketFilters, pagination: PaginationParams): Promise<{ tickets: Ticket[]; total: number }> {
    const query: QueryFilter<TicketDocument> = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority as TicketPriority;
    if (filters.workspaceId) query.workspaceId = filters.workspaceId;
    if (filters.search) {
      query.title = { $regex: filters.search, $options: "i" };
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [docs, total] = await Promise.all([
      TicketModel.find(query)
        .sort({ priority: 1, lastReplyAt: -1 })
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
    const update: Record<string, unknown> = { status };
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
