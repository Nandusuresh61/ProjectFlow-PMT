import { AuthProvider } from "@/shared/enums/AuthProviders";


export interface OAuthUserPayload {
  email: string;
  fullName: string;
  provider: AuthProvider;
  providerId: string;
}
