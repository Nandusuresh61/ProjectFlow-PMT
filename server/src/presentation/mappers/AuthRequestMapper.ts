import { RegisterUserDto } from "@/application/dtos/UserDtos";
import { RegisterUserSchemaType } from "shared";

/**
 * Express Request  → Mapper → DTO → Use Case
 */
export class AuthRequestMapper {
    static toRegisterUserDto(
        data: RegisterUserSchemaType
    ): RegisterUserDto {
        return {
            fullName: data.fullName,
            email:data.email,
            password: data.password
        }
    }
}