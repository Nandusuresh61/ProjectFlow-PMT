import jwt from "jsonwebtoken";
import { ITokenService } from "@/application/interfaces/services/ITokenService";
import { TokenPayloadType } from "shared";
import { config } from "@/app.config";

export class TokenService implements ITokenService {
  createAccessToken(payload: TokenPayloadType): string {
    return jwt.sign(payload, config.ACCESS_TOKEN_SECRET);
  }

  createRefreshToken(payload: TokenPayloadType): string {
    return jwt.sign(payload, config.REFRESH_TOKEN_SECRET);
  }
}
