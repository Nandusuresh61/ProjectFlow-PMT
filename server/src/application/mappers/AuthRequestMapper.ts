import { RegisterUserSchemaType, LoginUserSchemaType } from "shared";
import { StartRegisterDto, LoginRequestDto } from "@/application/dtos/UserDtos";

export class AuthRequestMapper {
  static toStartRegisterDto(
    data: RegisterUserSchemaType
  ): StartRegisterDto {
    return {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };
  }

  static toLoginDto(
    data: LoginUserSchemaType
  ): LoginRequestDto {
    return {
      email: data.email,
      password: data.password,
    };
  }
}
