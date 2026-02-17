import { VerifyAuthDto } from "@/application/dtos/AuthDto";
import { UserAuthResponseDto } from "@/application/dtos/UserDtos";

export interface IVerifyOtpUseCase {
  execute(data:VerifyAuthDto ): Promise<UserAuthResponseDto>;
}
