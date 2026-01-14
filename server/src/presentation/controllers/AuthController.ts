import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { RegisterUserSchema } from "shared";
import { HttpStatusCode } from "shared";

import { IAuthController } from "../interfaces/IAuthController";
import { IVerifyOtpUseCase } from "@/application/interfaces/use-cases/User/IVerifyOtpUseCase";
import { IStartRegisterUseCase } from "@/application/interfaces/use-cases/User/IStartRegisterUseCase";
import { IResendOtpUseCase } from "@/application/interfaces/use-cases/User/IResendOtpUseCase";

export class AuthController implements IAuthController {
  constructor(
    private readonly startRegisterUseCase: IStartRegisterUseCase,
    private readonly verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly resendOtpUseCase: IResendOtpUseCase
  ) {}

  startRegister = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validatedData = RegisterUserSchema.parse(req.body);

    await this.startRegisterUseCase.execute(validatedData);

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "OTP sent to email",
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const result = await this.verifyOtpUseCase.execute({ email, otp });

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      data: result,
    });
  });

  resendOtp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await this.resendOtpUseCase.execute(email);

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      message: "OTP resend successfully.",
    });
  });
}
