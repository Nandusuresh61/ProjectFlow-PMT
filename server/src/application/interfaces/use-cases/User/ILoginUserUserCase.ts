import {
  LoginRequestDto,
  UserAuthResponseDto,
} from "@/application/dtos/UserDtos";

export interface ILoginUserUseCase {
  execute(user: LoginRequestDto): Promise<UserAuthResponseDto>;
}
