import { AuthProvider } from "@/domain/entities/auth/authProvider";

export interface OAuthUserPayload {
  email: string;
  fullName: string;
  provider: AuthProvider;
  providerId: string;
}
