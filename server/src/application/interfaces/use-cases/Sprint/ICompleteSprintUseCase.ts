import { Sprint } from "@/domain/entities/Sprint";
import { CompleteSprintDto } from "@/application/dtos/SprintDto";

export interface ICompleteSprintUseCase {
  execute(userId: string, data: CompleteSprintDto): Promise<Sprint>;
}
