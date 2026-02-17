import { ICreatePlanUseCase } from "@/application/interfaces/use-cases/Plan/ICreatePlanUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { Request, Response } from "express";
import {
  AppMessages,
  CreatePlanSchema,
  HttpStatusCode,
  ResponseHandler,
} from "shared";
import { IGetAllPlansUsecase } from "@/application/interfaces/use-cases/Plan/IGetAllPlansUseCase";
import { ITogglePlanStatusUseCase } from "@/application/interfaces/use-cases/Plan/ITogglePlanStatusUseCase";
import { PlanMapper } from "@/application/mappers/PlanMapper";


export class PlanController {
  constructor(
    private readonly _createPlanUseCase: ICreatePlanUseCase,
    private readonly _getAllPlansUsecase: IGetAllPlansUsecase,
    private readonly _togglePlanStatusUseCase: ITogglePlanStatusUseCase,
  ) { }

  createPlan = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = CreatePlanSchema.parse(req.body);

    const result = await this._createPlanUseCase.execute(validatedData);

    res
      .status(HttpStatusCode.CREATED)
      .json(ResponseHandler.success(AppMessages.PLAN_CREATED, PlanMapper.toDTO(result)));
  });

  getPlans = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._getAllPlansUsecase.execute();

    const plansDTO = result.map((plan) => PlanMapper.toDTO(plan));

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.OPERATION_SUCCESS, plansDTO));
  });

  togglePlanStatus = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;

    const result = await this._togglePlanStatusUseCase.execute(planId);

    res
      .status(HttpStatusCode.OK)
      .json(ResponseHandler.success(AppMessages.PLAN_STATUS_UPDATED, PlanMapper.toDTO(result)));
  });
}
