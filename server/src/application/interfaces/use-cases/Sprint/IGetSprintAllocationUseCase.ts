import { SprintMemberAllocationResponse } from "@/application/use-cases/Sprint/GetSprintAllocationUseCase";

export interface IGetSprintAllocationUseCase {
  execute(sprintId: string): Promise<SprintMemberAllocationResponse>;
}
