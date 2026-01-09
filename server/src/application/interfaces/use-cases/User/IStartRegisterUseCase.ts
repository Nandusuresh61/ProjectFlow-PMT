import { StartRegisterDto } from "@/application/dtos/UserDtos";

export interface IStartRegisterUseCase {
    execute(user: StartRegisterDto):Promise <void>;
}