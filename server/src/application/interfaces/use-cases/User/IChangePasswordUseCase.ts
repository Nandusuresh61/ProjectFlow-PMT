import { ChangePasswordDto } from "@/application/dtos/UserProfileDto";

export interface IChangePasswordUseCase {
  execute(userId: string, data: ChangePasswordDto): Promise<void>;
}
