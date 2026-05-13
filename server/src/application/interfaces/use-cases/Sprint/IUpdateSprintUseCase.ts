import { UpdateSprintInput } from "@/shared/schema/sprint/UpdateSprintSchema";
import { Sprint } from "@/domain/entities/Sprint";

export interface IUpdateSprintUseCase {
  execute(userId: string, input: UpdateSprintInput): Promise<Sprint>;
}
