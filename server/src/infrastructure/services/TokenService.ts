import jwt from "jsonwebtoken";
import { ITokenService } from "@/application/interfaces/services/ITokenService";
import { TokenPayloadType } from "shared";
import { config } from "@/app.config";

export class TokenService implements ITokenService {
  createAccessToken(payload: TokenPayloadType): string {
    return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  }

  createRefreshToken(payload: TokenPayloadType): string {
    return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  }

  verifyAccessToken(token: string): TokenPayloadType | null {
    try {
      return jwt.verify(token, config.ACCESS_TOKEN_SECRET) as TokenPayloadType;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayloadType | null {
    try {
      return jwt.verify(token, config.REFRESH_TOKEN_SECRET) as TokenPayloadType;
    } catch (error) {
      return null;
    }
  }
}
