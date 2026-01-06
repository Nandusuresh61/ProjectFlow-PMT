import { RegisterUserDto,UserAuthResponseDto } from "@/application/dtos/UserDtos"

export interface IRegisterUserUseCase{
    execute(user: RegisterUserDto): Promise<UserAuthResponseDto>
}

