import { AuthProvider } from "./auth/authProvider";

export interface User {
    userId: string;
    fullName: string;
    email: string;
    passwordHash?: string;
    authProvider: AuthProvider;
    providerId?: string;
    isOnboarded: boolean;
    currentWorkspaceId?: string;
    isSuperAdmin: boolean;
    createdAt: Date
    updatedAt: Date
}