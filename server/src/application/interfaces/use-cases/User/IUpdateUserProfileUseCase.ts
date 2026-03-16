import { UpdateUserProfileDto } from "@/application/dtos/UserProfileDto";

export interface IUpdateUserProfileUseCase {
  execute(userId: string, data: UpdateUserProfileDto): Promise<void>;
}
