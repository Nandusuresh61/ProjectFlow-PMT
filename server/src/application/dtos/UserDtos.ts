import { LoginUserSchemaType, RegisterUserSchemaType } from "shared";

export type RegisterVerifiedUserDto = {
  fullName: string;
  email: string;
  passwordHash: string;
};

export type UserAuthResponseDto = {
  user: {
    userId: string;
    fullName: string;
    email: string;
    isSuperAdmin: boolean;
  };
  accessToken: string;
  refreshToken: string;
};

export type StartRegisterDto = RegisterUserSchemaType;

export type LoginRequestDto = LoginUserSchemaType;
