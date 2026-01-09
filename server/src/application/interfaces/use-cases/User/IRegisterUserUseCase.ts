import { RegisterVerifiedUserDto,UserAuthResponseDto } from "@/application/dtos/UserDtos"

export interface IRegisterUserUseCase{
    execute(user: RegisterVerifiedUserDto): Promise<UserAuthResponseDto>
}

