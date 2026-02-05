import { OAuthUserPayload } from "@/application/dtos/OAuthUserPayload";

export interface IOAuthProviderService {
  verifyAndGetUser(code: string): Promise<OAuthUserPayload>;
}
