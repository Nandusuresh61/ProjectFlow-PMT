import { StartSprintDto } from "@/application/dtos/SprintDto";
import { ISprintRepository } from "@/application/interfaces/repositories/ISprintRepository";
import { IStartSprintUseCase } from "@/application/interfaces/use-cases/Sprint/IStartSprintUseCase";
import { Sprint } from "@/domain/entities/Sprint";
import { ErrorCode } from "@/shared/enums/ErrorCode";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCodes";
import { AppError } from "@/shared/errors/AppError";
import { AppMessages } from "@/shared/messages/AppMessages";

export class StartSprintUseCase implements IStartSprintUseCase {
  constructor(
    private readonly _sprintRepo: ISprintRepository,
  ) {}

  async execute(userId: string, data: StartSprintDto): Promise<Sprint> {
    const { sprintId, startDate, endDate } = data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.INVALID_DATE_RANGE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const sprint = await this._sprintRepo.findById(sprintId);

    if (!sprint) {
      throw new AppError(
        ErrorCode.RESOURCE_NOT_FOUND,
        AppMessages.TARGET_SPRINT_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    if (sprint.status !== "PLANNED") {
       throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_NOT_PLANNED,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const activeSprint = await this._sprintRepo.findActiveProjectId(sprint.projectId);
    
    if (activeSprint) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        AppMessages.SPRINT_ALREADY_ACTIVE,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const updatedSprint = await this._sprintRepo.update(sprintId, {
      status: "ACTIVE",
      startDate: start,
      endDate: end,
    });

    if (!updatedSprint) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        AppMessages.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedSprint;
  }
}
