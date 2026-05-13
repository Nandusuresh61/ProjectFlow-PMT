import { ISprintMemberAllocationRepository } from "@/application/interfaces/repositories/ISprintMemberAllocationRepository";
import { SprintMemberAllocation, CapacityStatus } from "@/domain/entities/SprintMemberAllocation";
import { MongoBaseRepository } from "./MongoBaseRepository";
import { SprintMemberAllocationDocument, SprintMemberAllocationModel } from "../database/models/MongoSprintMemberAllocationModel";

export class MongoSprintMemberAllocationRepository
  extends MongoBaseRepository<SprintMemberAllocation, SprintMemberAllocationDocument>
  implements ISprintMemberAllocationRepository
{
  constructor() {
    super(SprintMemberAllocationModel);
  }

  protected mapToEntity(doc: SprintMemberAllocationDocument): SprintMemberAllocation {
    return new SprintMemberAllocation(
      doc.allocationId,
      doc.sprintId,
      doc.projectId,
      doc.workspaceId,
      doc.userId,
      doc.assignedHours,
      doc.loggedHours,
      doc.remainingHours,
      doc.completedTasks,
      doc.incompleteTasks,
      doc.capacityStatus as CapacityStatus,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findBySprintId(sprintId: string): Promise<SprintMemberAllocation[]> {
    return this.find({ sprintId });
  }

  async findBySprintIdAndUserId(sprintId: string, userId: string): Promise<SprintMemberAllocation | null> {
    return this.findOne({ sprintId, userId });
  }

  async upsert(allocation: SprintMemberAllocation): Promise<void> {
    await SprintMemberAllocationModel.findOneAndUpdate(
      { sprintId: allocation.sprintId, userId: allocation.userId },
      {
        $set: {
          allocationId: allocation.allocationId,
          projectId: allocation.projectId,
          workspaceId: allocation.workspaceId,
          assignedHours: allocation.assignedHours,
          loggedHours: allocation.loggedHours,
          remainingHours: allocation.remainingHours,
          completedTasks: allocation.completedTasks,
          incompleteTasks: allocation.incompleteTasks,
          capacityStatus: allocation.capacityStatus,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        }
      },
      { upsert: true, new: true }
    ).exec();
  }

  async deleteBySprintId(sprintId: string): Promise<void> {
    await SprintMemberAllocationModel.deleteMany({ sprintId }).exec();
  }
}
