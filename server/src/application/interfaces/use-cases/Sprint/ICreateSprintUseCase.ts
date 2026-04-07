import { CreateSprintDto } from "@/application/dtos/SprintDto";

export interface ICreateSprintUseCase {
  execute(data: CreateSprintDto): Promise<CreateSprintDto>;
}
