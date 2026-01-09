import { RegisterVerifiedUserDto } from "@/application/dtos/UserDtos";
import { RegisterUserSchemaType } from "shared";

/**
 * Express Request  → Mapper → DTO → Use Case
 */
export class AuthRequestMapper {
    static toRegisterUserDto(
        data: RegisterUserSchemaType
    ): RegisterVerifiedUserDto {
        return {
            fullName: data.fullName,
            email:data.email,
            passwordHash: data.password
        }
    }
}