import { Response } from "express";
import { AuthRequest } from "../middlewares/AuthMiddleware";
import { asyncHandler } from "@/presentation/utils/AsyncHandler";
import { ICompleteOnboardingUseCase } from "@/application/interfaces/use-cases/Onboarding/ICompleteOnboardingUseCase";
import { CompleteOnboardingSchema } from "@/shared/schema/onboarding/CompleteOnboardingSchema";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppMessages } from "@/shared/messages/AppMessages";

export class OnboardingController {
  constructor(
    private readonly _completeOnboardingUseCase: ICompleteOnboardingUseCase,
  ) { }

  completeOnboarding = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
      const validatedData = CompleteOnboardingSchema.parse(req.body);

      const userId = req.user?.userId;

      const result = await this._completeOnboardingUseCase.execute({
        userId,
        workspaceName: validatedData.workspaceName,
        invites: validatedData.invites,
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          ResponseHandler.success(AppMessages.ONBOARDING_COMPLETED, result),
        );
    },
  );
}
