import { Sprint } from "@/domain/entities/Sprint";

export interface ICompleteSprintUseCase {
  execute(userId: string, sprintId: string): Promise<Sprint>;
}
