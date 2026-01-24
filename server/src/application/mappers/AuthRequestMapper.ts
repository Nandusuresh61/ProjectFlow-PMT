import {
  RegisterUserSchemaType,
  LoginUserSchemaType,
  ForgotEmailSchemaType,
} from "shared";
import {
  StartRegisterDto,
  LoginRequestDto,
  ForgotRequestDto,
} from "@/application/dtos/UserDtos";

export class AuthRequestMapper {
  static toStartRegisterDto(data: RegisterUserSchemaType): StartRegisterDto {
    return {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };
  }

  static toLoginDto(data: LoginUserSchemaType): LoginRequestDto {
    return {
      email: data.email,
      password: data.password,
    };
  }

  static toForgotDto(data: ForgotEmailSchemaType): ForgotRequestDto {
    return {
      email: data.email,
    };
  }
}
