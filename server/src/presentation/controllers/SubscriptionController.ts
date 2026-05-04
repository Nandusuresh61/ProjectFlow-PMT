import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { ResponseHandler } from "@/shared/response/responseHandler";
import { AppMessages } from "@/shared/messages/AppMessages";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { UpgradeSubscriptionUseCase } from "@/application/use-cases/Subscription/UpgradeSubscriptionUseCase";
import { VerifyPaymentUseCase } from "@/application/use-cases/Subscription/VerifyPaymentUseCase";
import { GetSubscriptionDetailsUseCase } from "@/application/use-cases/Subscription/GetSubscriptionDetailsUseCase";

export class SubscriptionController {
  constructor(
    private readonly _upgradeUseCase: UpgradeSubscriptionUseCase,
    private readonly _verifyUseCase: VerifyPaymentUseCase,
    private readonly _getDetailsUseCase: GetSubscriptionDetailsUseCase
  ) {}

  getSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const result = await this._getDetailsUseCase.execute(workspaceId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });

  upgrade = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const { planId } = req.body;

    const result = await this._upgradeUseCase.execute({ workspaceId, planId });

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, result));
  });

  verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
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
