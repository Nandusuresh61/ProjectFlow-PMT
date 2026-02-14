import { Request, Response } from "express";
import { asyncHandler } from "@/presentation/utils/AsyncHandler";
import { ICompleteOnboardingUseCase } from "@/application/interfaces/use-cases/Onboarding/ICompleteOnboardingUseCase";
import {
  CompleteOnboardingSchema,
  ResponseHandler,
  HttpStatusCode,
  AppMessages,
} from "shared";

export class OnboardingController {
  constructor(
    private readonly _completeOnboardingUseCase: ICompleteOnboardingUseCase,
  ) {}

  completeOnboarding = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const validatedData = CompleteOnboardingSchema.parse(req.body);

      const userId = (req as any).user?.userId;

      const result = await this._completeOnboardingUseCase.execute({
        userId,
        workspaceName: validatedData.workspaceName,
        planId: validatedData.planId,
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          ResponseHandler.success(AppMessages.ONBOARDING_COMPLETED, result),
        );
    },
  );
}
