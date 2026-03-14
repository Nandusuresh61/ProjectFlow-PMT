import { UserDetailsDto } from "@/application/dtos/UserDtos";

export interface IGetUserDetailsUseCase {
    execute(userId: string): Promise<UserDetailsDto | null>;
}
