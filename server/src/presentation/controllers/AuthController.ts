import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { AppMessages } from "@/shared/messages/AppMessages";
import { AppError } from "@/shared/errors/AppError";
import { LoginUserSchema } from "@/shared/schema/auth/LoginUserSchema";
import { RegisterUserSchema } from "@/shared/schema/auth/RegisterUserSchema";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { ForgotEmailSchema } from "@/shared/schema/auth/ForgotEmailSchema";
import { ResetPasswordSchema } from "@/shared/schema/auth/ResetPasswordSchema";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";

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
import { IOAuthProviderService } from "@/application/interfaces/services/IOAuthProviderService";
import { IGoogleAuthUseCase } from "@/application/interfaces/use-cases/User/IGoogleAuthUseCase";
import { IGetMeUseCase } from "@/application/interfaces/use-cases/User/IGetMeUseCase";
import { logger } from "@/infrastructure/utils/Logger";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { IAuthCookieService } from "@/application/interfaces/services/IAuthCookieService";

export class AuthController implements IAuthController {
  constructor(
    private readonly _startRegisterUseCase: IStartRegisterUseCase,
    private readonly _verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly _resendOtpUseCase: IResendOtpUseCase,
    private readonly _loginUserUseCase: ILoginUserUseCase,
    private readonly _refreshTokenUseCase: IRefreshTokenUseCase,
    private readonly _resetPasswordOtpUseCase: IForgotPasswordOtpUseCase,
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
    private readonly _googleOAuthService: IOAuthProviderService,
    private readonly _googleAuthUseCase: IGoogleAuthUseCase,
    private readonly _getMeUseCase: IGetMeUseCase,
    private readonly _authCookieService: IAuthCookieService,
  ) {}

  startRegister = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = RegisterUserSchema.parse(req.body);

      const dto = AuthRequestMapper.toStartRegisterDto(validatedData);

      logger.info(
        `>>>  OTP <<< [AuthController] startRegister called with email: ${dto.email}`,
      );

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

      this._authCookieService.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
      );

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

      logger.info(`[AuthController] resendOtp called with email: ${email}`);

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

      this._authCookieService.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
      );

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

      this._authCookieService.setAuthCookies(res, accessToken, newRefreshToken);

      res
        .status(HttpStatusCode.OK)
        .json(ResponseHandler.success(AppMessages.LOGIN_SUCCESS));
    },
  );

  LogoutUser = asyncHandler(async (req: Request, res: Response) => {
    this._authCookieService.clearAuthCookies(res);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.LOGOUT_SUCCESS));
  });

  getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tokenPayload = req.user!;

    const userProfile = await this._getMeUseCase.execute(tokenPayload.userId);

    res.status(200).json(
      ResponseHandler.success(AppMessages.OPERATION_SUCCESS, {
        user: userProfile,
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
  });

  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.INVALID_GOOGLE_CODE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const oauthPayload = await this._googleOAuthService.verifyAndGetUser(code);

    const result = await this._googleAuthUseCase.execute(oauthPayload);

    this._authCookieService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    res.json(
      ResponseHandler.success(
        AppMessages.LOGIN_SUCCESS,
        AuthResponseMapper.toUserResponse(result),
      ),
    );
  });
}
