import { CreateSprintDto } from "@/application/dtos/SprintDto";
import { Sprint } from "@/domain/entities/Sprint";

export interface ICreateSprintUseCase {
  execute(userId: string, data: CreateSprintDto): Promise<Sprint>;
}
