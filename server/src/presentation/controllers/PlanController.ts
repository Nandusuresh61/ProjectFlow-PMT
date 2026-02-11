import { ICreatePlanUseCase } from "@/application/interfaces/use-cases/Plan/ICreatePlanUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import { AppMessages, HttpStatusCode, ResponseHandler } from "shared";

export class PlanController {
  constructor(private readonly _createPlanUseCase: ICreatePlanUseCase) {}

  createPlan = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._createPlanUseCase.execute(req.body);
    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.PLAN_CREATED, result));
  });
}
