import { AuthProvider } from "shared";


export interface User {
    userId: string;
    fullName: string;
    email: string;
    passwordHash?: string;
    authProvider: string;
    providerId?: string;
    currentWorkspaceId?: string;
    isSuperAdmin: boolean;
    createdAt: Date
    updatedAt: Date
}