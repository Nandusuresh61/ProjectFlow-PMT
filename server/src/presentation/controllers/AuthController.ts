import { Request, Response } from "express";
import { IRegisterUserUseCase } from "@/application/interfaces/use-cases/User/IRegisterUserUseCase";
import { asyncHandler } from "../utils/AsyncHandler";
import { RegisterUserSchema } from "shared";
import { AuthRequestMapper } from "../mappers/AuthRequestMapper";
import { HttpStatusCode } from "shared";

export class AuthController {
  constructor(private readonly registerUserUseCase: IRegisterUserUseCase) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    // validate data from req.body
    const validateData = RegisterUserSchema.parse(req.body);

    // Mapper to register dto
    const registerDto = AuthRequestMapper.toRegisterUserDto(validateData);

    const result = await this.registerUserUseCase.execute(registerDto);
    console.log(result)

    res.status(HttpStatusCode.CREATED).json({
      success: true,
      data: result,
    });

  });
}
