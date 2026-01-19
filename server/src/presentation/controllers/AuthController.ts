import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  AppMessages,
  AppError,
  LoginUserSchema,
  RegisterUserSchema,
  ResponseHandler,
  ErrorCode,
} from "shared";
import { HttpStatusCode } from "shared";

import { IAuthController } from "../interfaces/IAuthController";
import { IVerifyOtpUseCase } from "@/application/interfaces/use-cases/User/IVerifyOtpUseCase";
import { IStartRegisterUseCase } from "@/application/interfaces/use-cases/User/IStartRegisterUseCase";
import { IResendOtpUseCase } from "@/application/interfaces/use-cases/User/IResendOtpUseCase";
import { ILoginUserUseCase } from "@/application/interfaces/use-cases/User/ILoginUserUserCase";
import { IRefreshTokenUseCase } from "@/application/interfaces/use-cases/User/IRefreshTokenUseCase";
import { AuthRequestMapper } from "@/application/mappers/AuthRequestMapper";
import { AuthResponseMapper } from "@/application/mappers/AuthResponseMapper";

export class AuthController implements IAuthController {
  constructor(
    private readonly startRegisterUseCase: IStartRegisterUseCase,
    private readonly verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly resendOtpUseCase: IResendOtpUseCase,
    private readonly loginUserUseCase: ILoginUserUseCase,
    private readonly refreshTokenUseCase: IRefreshTokenUseCase,
  ) { }

  startRegister = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = RegisterUserSchema.parse(req.body);

      const dto = AuthRequestMapper.toStartRegisterDto(validatedData);

      await this.startRegisterUseCase.execute(dto);

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHandler.success(AppMessages.OTP_SENT));
    },
  );

  verifyOtp = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, otp } = req.body;

      const result = await this.verifyOtpUseCase.execute({ email, otp });

      res.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          ResponseHandler.success(
            AppMessages.EMAIL_VERIFIED,
            AuthResponseMapper.toUserResponse(result),
          ),
        );
    },
  );

  resendOtp = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;

      await this.resendOtpUseCase.execute(email);

      res
        .status(HttpStatusCode.CREATED)
        .json(ResponseHandler.success(AppMessages.OTP_RESENT));
    },
  );

  loginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = LoginUserSchema.parse(req.body);

      const dto = AuthRequestMapper.toLoginDto(validatedData);
      const result = await this.loginUserUseCase.execute(dto);

      res.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          ResponseHandler.success(
            AppMessages.LOGIN_SUCCESS,
            AuthResponseMapper.toUserResponse(result),
          ),
        );
    },
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw new AppError(
          ErrorCode.AUTH,
          AppMessages.TOKEN_INVALID,
          HttpStatusCode.UNAUTHORIZED
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.refreshTokenUseCase.execute(refreshToken);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHandler.success(AppMessages.LOGIN_SUCCESS));
    },
  );

  LogoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.LOGOUT_SUCCESS));
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(
        AppMessages.OPERATION_SUCCESS,
        {
          user: user
        }
      )
    );
  });
}
