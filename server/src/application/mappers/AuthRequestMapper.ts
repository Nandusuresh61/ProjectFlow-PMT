import { RegisterUserSchemaType } from "@/shared/schema/auth/RegisterUserSchema";
import { LoginUserSchemaType } from "@/shared/schema/auth/LoginUserSchema";
import { ForgotEmailSchemaType } from "@/shared/schema/auth/ForgotEmailSchema";
import { ResetPasswordSchemaType } from "@/shared/schema/auth/ResetPasswordSchema";
import {
  StartRegisterDto,
  LoginRequestDto,
  ForgotRequestDto,
  ResetPasswordRequestDto,
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

  static toResetPasswordDto(data: ResetPasswordSchemaType): ResetPasswordRequestDto {
    return {
      email: data.email,
      otp: data.otp,
      newPassword: data.password
    }
  }
}
