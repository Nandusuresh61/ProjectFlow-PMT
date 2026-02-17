import { ForgotRequestDto } from "@/application/dtos/UserDtos";

export interface IForgotPasswordOtpUseCase {
  execute(email: ForgotRequestDto): Promise<void>;
}
