import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { IUpgradeSubscriptionUseCase } from "@/application/interfaces/use-cases/Subscription/IUpgradeSubscriptionUseCase";
import { IVerifyPaymentUseCase } from "@/application/interfaces/use-cases/Subscription/IVerifyPaymentUseCase";
import { IGetSubscriptionDetailsUseCase } from "@/application/interfaces/use-cases/Subscription/IGetSubscriptionDetailsUseCase";

export class SubscriptionController {
  constructor(
    private readonly _upgradeUseCase: IUpgradeSubscriptionUseCase,
    private readonly _verifyUseCase: IVerifyPaymentUseCase,
    private readonly _getDetailsUseCase: IGetSubscriptionDetailsUseCase
  ) {}

  getSubscription = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string;
    const result = await this._getDetailsUseCase.execute(workspaceId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });

  upgrade = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string;
    const { planId } = req.body;

    const result = await this._upgradeUseCase.execute({ workspaceId, planId });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });

  verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } = req.body;

    const result = await this._verifyUseCase.execute({
      workspaceId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      planId,
    });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });
}
