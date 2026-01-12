import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { RegisterUserSchema } from "shared";
import { HttpStatusCode } from "shared";
import { IVerifyOtpUseCase } from "@/application/interfaces/use-cases/User/IVerifyOtpUseCase";
import { IStartRegisterUseCase } from "@/application/interfaces/use-cases/User/IStartRegisterUseCase";
import { IResendOtpUseCase } from "@/application/interfaces/use-cases/User/IResendOtpUseCase";

export class AuthController {
  constructor(
    private readonly startRegisterUseCase: IStartRegisterUseCase,
    private readonly verifyOtpUseCase: IVerifyOtpUseCase,
    private readonly resendOtpUseCase: IResendOtpUseCase
  ) {}

  // Send OTP
  startRegister = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = RegisterUserSchema.parse(req.body);

    await this.startRegisterUseCase.execute(validatedData);

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "OTP sent to email",
    });
  });

  // Verify Otp

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const result = await this.verifyOtpUseCase.execute({ email, otp });

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      data: result,
    });
  });

  // Resend Otp

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.resendOtpUseCase.execute(email);
    res.status(HttpStatusCode.CREATED).json({success:true,message: "OTP resend successfully."})
  });
}
