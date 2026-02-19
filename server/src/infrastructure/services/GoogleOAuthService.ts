import { IOAuthProviderService } from "@/application/interfaces/services/IOAuthProviderService";
import { OAuth2Client } from "google-auth-library";
import { OAuthUserPayload } from "@/application/dtos/OAuthUserPayload";
import { AppError, AppMessages, AuthProvider, ErrorCode, HttpStatusCode } from "shared";
import { config } from "@/app.config";

export class GoogleOAuthService implements IOAuthProviderService {
  private _client: OAuth2Client;

  constructor() {
    this._client = new OAuth2Client(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URI,
    );
  }

  async verifyAndGetUser(code: string): Promise<OAuthUserPayload> {
    try {
      const { tokens } = await this._client.getToken(code);

      if (!tokens.id_token) {
        throw new AppError(
          ErrorCode.AUTH,
          AppMessages.INVALID_GOOGLE_TOKEN,
          HttpStatusCode.BAD_REQUEST,
        );
      }

      const ticket = await this._client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new AppError(
          ErrorCode.AUTH,
          AppMessages.INVALID_GOOGLE_PAYLOAD,
          HttpStatusCode.UNAUTHORIZED,
        );
      }

      return {
        email: payload.email,
        fullName: payload.name ?? payload.email,
        provider: AuthProvider.GOOGLE,
        providerId: payload.sub,
      };
    } catch (error) {
      throw new AppError(
        ErrorCode.AUTH,
        AppMessages.GOOGLE_AUTH_FAILED,
        HttpStatusCode.UNAUTHORIZED,
      );
    }
  }
}
