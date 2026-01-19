import { TokenPayloadType } from "shared";

export interface ITokenService {
    createAccessToken(payload: TokenPayloadType): string;
    createRefreshToken(payload: TokenPayloadType): string;
    verifyAccessToken(token: string): TokenPayloadType | null;
    verifyRefreshToken(token: string): TokenPayloadType | null;
}   