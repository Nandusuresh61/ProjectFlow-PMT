import { AuthProvider } from "shared";


export interface OAuthUserPayload {
  email: string;
  fullName: string;
  provider: AuthProvider;
  providerId: string;
}
