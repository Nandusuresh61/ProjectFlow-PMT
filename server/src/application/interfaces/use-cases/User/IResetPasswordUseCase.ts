import { ResetPasswordRequestDto } from "@/application/dtos/UserDtos";

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordRequestDto): Promise<void>;
}
