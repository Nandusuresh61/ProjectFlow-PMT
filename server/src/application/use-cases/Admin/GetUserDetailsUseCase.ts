import { UserDetailsDto } from "@/application/dtos/UserDtos";
import { IUserRepository } from "@/application/interfaces/repositories/IUserRepository";
import { IGetUserDetailsUseCase } from "@/application/interfaces/use-cases/SuperAdmin/IGetUserDetailsUseCase";

export class GetUserDetailsUseCase implements IGetUserDetailsUseCase {
    constructor(private _userRepo: IUserRepository) { }

    async execute(userId: string): Promise<UserDetailsDto | null> {
        return this._userRepo.getUserDetails(userId);
    }
}
