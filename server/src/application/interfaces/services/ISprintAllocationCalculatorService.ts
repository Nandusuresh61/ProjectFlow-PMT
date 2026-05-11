import { SprintMemberAllocation } from "@/domain/entities/SprintMemberAllocation";

export interface ISprintAllocationCalculatorService {
  calculateAndSaveAllocation(sprintId: string): Promise<void>;
  getSprintAllocation(sprintId: string): Promise<SprintMemberAllocation[]>;
}
