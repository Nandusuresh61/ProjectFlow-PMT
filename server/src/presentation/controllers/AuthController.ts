import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import {
  AppMessages,
  AppError,
  LoginUserSchema,
  RegisterUserSchema,
  ResponseHandler,
  ErrorCode,
  ForgotEmailSchema,
  ResetPasswordSchema,
} from "shared";
import { HttpStatusCode } from "shared";
import { config } from "@/app.config";

import { IAuthController } from "../interfaces/IAuthController";
import { IVerifyOtpUseCase } from "@/application/interfaces/use-cases/User/IVerifyOtpUseCase";
import { IStartRegisterUseCase } from "@/application/interfaces/use-cases/User/IStartRegisterUseCase";
import { IResendOtpUseCase } from "@/application/interfaces/use-cases/User/IResendOtpUseCase";
import { ILoginUserUseCase } from "@/application/interfaces/use-cases/User/ILoginUserUserCase";
import { IRefreshTokenUseCase } from "@/application/interfaces/use-cases/User/IRefreshTokenUseCase";
import { AuthRequestMapper } from "@/application/mappers/AuthRequestMapper";
import { AuthResponseMapper } from "@/application/mappers/AuthResponseMapper";
import { IForgotPasswordOtpUseCase } from "@/application/interfaces/use-cases/User/IForgotPasswordOtpUseCase";
import { IResetPasswordUseCase } from "@/application/interfaces/use-cases/User/IResetPasswordUseCase";

export class AuthController implements IAuthController {
  constructor(
    private readonly _startRegisterUseCase: IStartRegisterUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _resendOtpUseCase: IResendOtpUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _resetPasswordOtpUseCase: IForgotPasswordOtpUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase
  ) { }

  startRegister = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = RegisterUserSchema.parse(req.body);

      const dto = AuthRequestMapper.toStartRegisterDto(validatedData);

      await this._startRegisterUseCase.execute(dto);

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHandler.success(AppMessages.OTP_SENT));
    },
  );

  verifyOtp = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, otp } = req.body;

      const result = await this._verifyOtpUseCase.execute({ email, otp });

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
        path: "/api/auth" + config.REFRESH_TOKEN_PATH,
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

      await this._resendOtpUseCase.execute(email);

      res
        .status(HttpStatusCode.CREATED)
        .json(ResponseHandler.success(AppMessages.OTP_RESENT));
    },
  );

  loginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = LoginUserSchema.parse(req.body);

      const dto = AuthRequestMapper.toLoginDto(validatedData);
      const result = await this._loginUserUseCase.execute(dto);

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
        path: "/api/auth" + config.REFRESH_TOKEN_PATH,
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
          HttpStatusCode.UNAUTHORIZED,
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this._refreshTokenUseCase.execute(refreshToken);

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
        path: "/api/auth" + config.REFRESH_TOKEN_PATH,
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
      path: "/api/auth" + config.REFRESH_TOKEN_PATH,
    });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.LOGOUT_SUCCESS));
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(HttpStatusCode.OK).json(
      ResponseHandler.success(AppMessages.OPERATION_SUCCESS, {
        user: user,
      }),
    );
  });

  forgotOtp = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = ForgotEmailSchema.parse(req.body);
    const dto = AuthRequestMapper.toForgotDto(validatedData);

    await this._resetPasswordOtpUseCase.execute(dto);

    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.EMAIL_SENT_SUCCESS));
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = ResetPasswordSchema.parse(req.body);

    const dto = AuthRequestMapper.toResetPasswordDto(validatedData);

    await this._resetPasswordUseCase.execute(dto);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.PASSWORD_RESET_SUCCESS));
  })
}
