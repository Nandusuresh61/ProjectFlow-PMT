import { TokenPayloadType } from "shared";

export interface ITokenService {
    createAccessToken(payload: TokenPayloadType):string;
    createRefreshToken(payload: TokenPayloadType):string;
}   