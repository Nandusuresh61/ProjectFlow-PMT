import { StartSprintDto } from "@/application/dtos/SprintDto";
import { Sprint } from "@/domain/entities/Sprint";

export interface IStartSprintUseCase {
  execute(userId: string, data: StartSprintDto): Promise<Sprint>;
}
