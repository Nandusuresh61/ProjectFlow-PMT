import { OAuthUserPayload } from "@/application/dtos/OAuthUserPayload";
import { UserAuthResponseDto } from "@/application/dtos/UserDtos";

export interface IGoogleAuthUseCase {
    execute(payload: OAuthUserPayload):Promise<UserAuthResponseDto>;
}