import { SprintMemberAllocation } from "@/domain/entities/SprintMemberAllocation";

export interface ISprintMemberAllocationRepository {
  findBySprintId(sprintId: string): Promise<SprintMemberAllocation[]>;
  findBySprintIdAndUserId(sprintId: string, userId: string): Promise<SprintMemberAllocation | null>;
  upsert(allocation: SprintMemberAllocation): Promise<void>;
  deleteBySprintId(sprintId: string): Promise<void>;
}
