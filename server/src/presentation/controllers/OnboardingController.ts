import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { CompleteOnboardingSchema, AppMessages, ResponseHandler, HttpStatusCode } from "shared";
import { IOnboardingController } from "../interfaces/IOnboardingController";
import { IOnboardingRepository } from "@/application/interfaces/repositories/IOnboardingRepository";
import { OnboardingRequestMapper } from "@/application/mappers/OnboardingRequestMapper";
import { ICompleteOnboardingUseCase } from "@/application/interfaces/use-cases/workspace/ICompleteOnboardingUseCase";

export class OnboardingController implements IOnboardingController {
  constructor(
    private readonly _completeOnboardingUseCase: ICompleteOnboardingUseCase,
    private readonly _onboardingRepo: IOnboardingRepository,
  ) {}

  completeOnboarding = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = (req as any).user;
      const validatedData = CompleteOnboardingSchema.parse(req.body);
      const dto = OnboardingRequestMapper.toCompleteOnboardingDto(
        validatedData,
        user.userId,
      );
      const result = await this._completeOnboardingUseCase.execute(dto);
      res
        .status(HttpStatusCode.CREATED)
        .json(ResponseHandler.success(AppMessages.ONBOARDING_COMPLETE, result));
    },
  );

  getOnboardingStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const user = (req as any).user;
      const status = await this._onboardingRepo.findByUserId(user.userId);
      res.status(HttpStatusCode.OK).json(
        ResponseHandler.success(AppMessages.OPERATION_SUCCESS, {
          isCompleted: !!status?.isCompleted,
          workspaceId: status?.workspaceId ?? null,
        }),
      );
    },
  );
}