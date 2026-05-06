import { IWorkLogRepository } from "@/application/interfaces/repositories/IWorkLogRepository";
import { WorkLog } from "@/domain/entities/WorkLog";
import { WorkLogModel, WorkLogDocument } from "../database/models/MongoWorkLogModel";

export class MongoWorkLogRepository implements IWorkLogRepository {
  async create(workLog: WorkLog): Promise<WorkLog> {
    const created = await WorkLogModel.create({
      workLogId: workLog.workLogId,
      issueId: workLog.issueId,
      userId: workLog.userId,
      hours: workLog.hours,
      note: workLog.note,
    });
    return this.toDomain(created);
  }

  async findById(workLogId: string): Promise<WorkLog | null> {
    const doc = await WorkLogModel.findOne({ workLogId }).lean();
    if (!doc) return null;
    return this.toDomain(doc as WorkLogDocument);
  }

  async findByIssueId(issueId: string): Promise<WorkLog[]> {
    const docs = await WorkLogModel.find({ issueId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this.toDomain(doc as WorkLogDocument));
  }

  async update(workLogId: string, data: Partial<WorkLog>): Promise<WorkLog | null> {
    const updated = await WorkLogModel.findOneAndUpdate(
      { workLogId },
      { $set: data },
      { new: true }
    ).lean();
    if (!updated) return null;
    return this.toDomain(updated as WorkLogDocument);
  }

  async delete(workLogId: string): Promise<boolean> {
    const result = await WorkLogModel.deleteOne({ workLogId });
    return result.deletedCount > 0;
  }

  async getTotalLoggedHours(issueId: string): Promise<number> {
    const result = await WorkLogModel.aggregate([
      { $match: { issueId } },
      { $group: { _id: null, total: { $sum: "$hours" } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getTotalLoggedHoursByIssueIds(issueIds: string[]): Promise<Record<string, number>> {
    if (issueIds.length === 0) return {};

    const result = await WorkLogModel.aggregate([
      { $match: { issueId: { $in: issueIds } } },
      { $group: { _id: "$issueId", total: { $sum: "$hours" } } },
    ]);

    return result.reduce<Record<string, number>>((totals, item) => {
      totals[item._id] = item.total;
      return totals;
    }, {});
  }

  private toDomain(doc: WorkLogDocument): WorkLog {
    return new WorkLog(
      doc.workLogId,
      doc.issueId,
      doc.userId,
      doc.hours,
      doc.note,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
